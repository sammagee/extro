import { Database as SqlJsDatabase } from 'sql.js'
import Data from '../config/data'
import Voicemail from '../models/Voicemail'
import { ContactEntries } from './ContactRepository'
import { Repository } from './Repository'

class VoicemailRepository implements Repository<Voicemail[]> {
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
      LIMIT ${Data.limit} OFFSET ${Data.limit * page}
    `
    const voicemailsTemp = this.db.exec(query)?.[0]?.values

    if (!voicemailsTemp) return this.voicemails

    this.voicemails = await Promise.all(
      voicemailsTemp.map(async (voicemail) => {
        const contact = this.contacts[voicemail[1] as string] || voicemail[1]

        return new Voicemail(
          voicemail[0]?.toString() || '',
          contact,
          voicemail[2]?.toString() || '',
          parseInt(voicemail[3]?.toString() || '0'),
          Boolean(voicemail[4])
        )
      })
    )

    return this.voicemails
  }
}

export default VoicemailRepository
