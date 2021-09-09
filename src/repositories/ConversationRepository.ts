import { Database as SqlJsDatabase } from 'sql.js'
import Data from '../config/data'
import Contact from '../models/Contact'
import Conversation from '../models/Conversation'
import { ContactEntries } from './ContactRepository'
import { Repository } from './Repository'

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
        messages.handles,
        messages.date,
        messages.is_from_me,
        messages.text
      FROM (
        SELECT
          chat.chat_identifier,
          (SELECT GROUP_CONCAT(id)
            FROM handle
            JOIN chat_handle_join
              ON chat_handle_join.chat_id = chat.ROWID
            WHERE handle.ROWID = chat_handle_join.handle_id
          ) AS handles,
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
      conversationsTemp.map(async (conversation) => {
        const handles = (conversation[1] as string).split(',')
        const contacts = handles.map(
          (handle) => this.contacts[handle] || handle
        )
        const contactNames = contacts.map((contact) =>
          contact instanceof Contact
            ? `${contact.firstName} ${contact.lastName}`.trim()
            : contact
        )
        const displayName =
          contactNames.length > 1
            ? `${contactNames.slice(0, -1).join(', ')} & ${contactNames.slice(
                -1
              )}`
            : contactNames[0]

        return new Conversation(
          conversation[0]?.toString() || '',
          displayName,
          contacts,
          conversation[2]?.toString() || '',
          Boolean(conversation[3]),
          conversation[4]?.toString() || ''
        )
      })
    )

    return this.conversations
  }
}

export default ConversationRepository
