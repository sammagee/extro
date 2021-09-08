import { Database as SqlJsDatabase } from 'sql.js'
import Conversation from '../models/Conversation'
import Message, { MessageService } from '../models/Message'
import parseTimestamp from '../utils/datetime'
import { ContactEntries } from './ContactRepository'
import { Repository } from './Repository'
import Data from '../config/data'

class MessageRepository implements Repository<Message[]> {
  private messages: Message[] = []
  private db: SqlJsDatabase
  private contacts: ContactEntries
  private conversation: Conversation

  constructor(db: SqlJsDatabase, contacts: ContactEntries, conversation: Conversation) {
    this.db = db
    this.contacts = contacts
    this.conversation = conversation
  }

  public async getAll(page: number = 0): Promise<Message[]> {
    const query = `
      SELECT
        chat.chat_identifier,
        message.is_from_me,
        ${parseTimestamp('message.date')} AS date,
        message.text,
        message.service
      FROM message
      JOIN chat_message_join
        ON message.ROWID = chat_message_join.message_id
      JOIN chat
        ON chat.ROWID = chat_message_join.chat_id
      WHERE chat.chat_identifier = '${this.conversation.id}'
      ORDER BY message.date DESC
      LIMIT ${Data.limit} OFFSET ${Data.limit * page}
    `
    const messagesTemp = this.db.exec(query)?.[0]?.values

    if (!messagesTemp) return this.messages

    this.messages = await Promise.all(
      messagesTemp.map(async(message) => {
        const contact = this.contacts[(message[0] as string)]
        const name = (contact && contact.firstName
          ? contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.firstName
          : message[0])?.toString() || ''
        const initials = name?.replace(/[^a-zA-Z\s]/g, '').match(/\b\w/g)?.join('').toUpperCase() || ''

        return new Message(
          message[0]?.toString() || '',
          name,
          message[2]?.toString() || '',
          Boolean(parseInt(message[1]?.toString() || '0')),
          initials,
          (message[4]?.toString() || 'SMS') as MessageService,
          message[3]?.toString() || '',
        )
      })
    )

    return this.messages
  }
}

export default MessageRepository
