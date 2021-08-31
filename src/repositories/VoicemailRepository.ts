import { Database as SqlJsDatabase } from 'sql.js'
import Voicemail from '../models/Voicemail'
import { ContactEntries } from './ContactRepository'
import { Repository } from './Repository'

class VoicemailRepository implements Repository<Voicemail[]> {
  private LIMIT: number = 20
  private voicemails: Voicemail[] = []
  private db: SqlJsDatabase
  private contacts: ContactEntries

  constructor(db: SqlJsDatabase, contacts: ContactEntries) {
    this.db = db
    this.contacts = contacts
  }

  public async getAll(page: number = 0): Promise<Voicemail[]> {
    const query = `
      SELECT
        ROWID,
        sender,
        datetime(date, 'unixepoch') AS datetime,
        duration,
        trashed_date
      FROM voicemail
      ORDER BY date DESC
      LIMIT ${this.LIMIT} OFFSET ${this.LIMIT * page}
    `
    const voicemailsTemp = this.db.exec(query)?.[0]?.values

    if (!voicemailsTemp) return this.voicemails

    this.voicemails = await Promise.all(
      voicemailsTemp.map(async (voicemail) => {
        const contact = this.contacts[(voicemail[1] as string)]
        const name = (contact && contact.firstName
          ? contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.firstName
          : voicemail[1])?.toString() || ''
        const initials = name?.replace(/[^a-zA-Z\s]/g, '').match(/\b\w/g)?.join('').toUpperCase() || ''

        return new Voicemail(
          voicemail[0]?.toString() || '',
          name,
          voicemail[2]?.toString() || '',
          parseInt(voicemail[3]?.toString() || '0'),
          initials,
          Boolean(voicemail[4])
        )
      })
    )

    return this.voicemails
  }
}

export default VoicemailRepository
