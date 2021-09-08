import { Database as SqlJsDatabase } from 'sql.js'
import Conversation from '../models/Conversation'
import { ContactEntries } from './ContactRepository'
import { Repository } from './Repository'
import Data from '../config/data'

class ConversationRepository implements Repository<Conversation[]> {
  private conversations: Conversation[] = []
  private db: SqlJsDatabase
  private contacts: ContactEntries

  constructor(db: SqlJsDatabase, contacts: ContactEntries) {
    this.db = db
    this.contacts = contacts
  }

  public async getAll(page: number = 0): Promise<Conversation[]> {
    const query = `
      SELECT
        messages.chat_identifier,
        messages.is_from_me,
        messages.date,
        messages.text
      FROM (
        SELECT
          chat.chat_identifier,
          message.ROWID,
          message.is_from_me,
          message.date,
          message.text
        FROM message
        JOIN chat_message_join
          ON message.ROWID = chat_message_join.message_id
        JOIN chat
          ON chat.ROWID = chat_message_join.chat_id
        ORDER BY message.date DESC
      ) AS messages
      GROUP BY messages.chat_identifier
      ORDER BY messages.date DESC
      LIMIT ${Data.limit} OFFSET ${Data.limit * page}
    `
    const conversationsTemp = this.db.exec(query)?.[0]?.values

    this.conversations = await Promise.all(
      conversationsTemp.map(async(conversation) => {
        const contact = this.contacts[(conversation[0] as string)]
        const name = (contact && contact.firstName
          ? contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.firstName
          : conversation[0])?.toString() || ''
        const initials = name?.replace(/[^a-zA-Z\s]/g, '').match(/\b\w/g)?.join('').toUpperCase() || ''

        return new Conversation(
          conversation[0]?.toString() || '',
          name,
          conversation[2]?.toString() || '',
          Boolean(conversation[1]),
          initials,
          conversation[3]?.toString() || '',
         )
      })
    )

    return this.conversations
  }
}

export default ConversationRepository
