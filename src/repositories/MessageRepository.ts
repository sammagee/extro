import parsePhoneNumberFromString from 'libphonenumber-js'
import { Database as SqlJsDatabase } from 'sql.js'
import Data from '../config/data'
import Conversation from '../models/Conversation'
import Message, { MessageService } from '../models/Message'
import parseTimestamp from '../utils/datetime'
import { ContactEntries } from './ContactRepository'
import { Repository } from './Repository'

class MessageRepository implements Repository<Message[]> {
  private messages: Message[] = []
  private db: SqlJsDatabase
  private contacts: ContactEntries
  private conversation: Conversation

  constructor(
    db: SqlJsDatabase,
    contacts: ContactEntries,
    conversation: Conversation
  ) {
    this.db = db
    this.contacts = contacts
    this.conversation = conversation
  }

  public async getAll(page: number = 0): Promise<Message[]> {
    const query = `
      SELECT
        message.ROWID,
        CASE WHEN (message.is_from_me = 1) THEN NULL
        ELSE handle.id
        END AS handle_id,
        ${parseTimestamp('message.date')} AS date,
        message.is_from_me,
        message.text,
        message.service
      FROM message
      JOIN chat_message_join
        ON message.ROWID = chat_message_join.message_id
      JOIN chat
        ON chat.ROWID = chat_message_join.chat_id
      LEFT JOIN handle
        ON message.handle_id = handle.ROWID
      WHERE chat.chat_identifier = '${this.conversation.id}'
      ORDER BY message.date DESC
      LIMIT ${Data.limit} OFFSET ${Data.limit * page}
    `
    const messagesTemp = this.db.exec(query)?.[0]?.values

    if (!messagesTemp) return this.messages

    this.messages = await Promise.all(
      messagesTemp.map(async (message) => {
        const index = parsePhoneNumberFromString(
          message[1]?.toString() || ''
        )?.number.toString()
        const contact = index
          ? this.contacts[index] || (message[1] as string)
          : (message[1] as string)

        return new Message(
          message[0]?.toString() || '',
          contact,
          message[2]?.toString() || '',
          Boolean(parseInt(message[3]?.toString() || '0')),
          (message[5]?.toString() || 'SMS') as MessageService,
          message[4]?.toString() || ''
        )
      })
    )

    return this.messages
  }
}

export default MessageRepository
