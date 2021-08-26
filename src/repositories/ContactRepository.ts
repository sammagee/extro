import { Database as SqlJsDatabase } from 'sql.js'
import isEmpty from 'lodash/isEmpty'
import { Contact } from '../models/Contact'
import { Repository } from './Repository'

export type ContactEntries = Record<string, Contact>

class ContactRepository implements Repository<ContactEntries> {
  private contacts: ContactEntries = {}
  private db: SqlJsDatabase

  constructor(db: SqlJsDatabase) {
    this.db = db
  }

  public async getAll(): Promise<ContactEntries> {
    if (!isEmpty(this.contacts)) return this.contacts

    const query = `
      SELECT
        c16Phone as phoneNum,
        c0First as firstName,
        c1Last as lastName
      FROM ABPersonFullTextSearch_content
    `
    const results = this.db.exec(query)?.[0]?.values

    results.forEach(result => {
      if (result[0]) {
        const phoneNums = result?.[0].toString().trim().split(/(?<!\))\s+/)
        phoneNums.forEach(phoneNum => {
          this.contacts[phoneNum] = {
            firstName: result?.[1]?.toString(),
            lastName: result?.[2]?.toString(),
          }
        })
      }
    })

    return this.contacts
  }
}

export default ContactRepository
