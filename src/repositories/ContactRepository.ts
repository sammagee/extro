import { findPhoneNumbersInText } from 'libphonenumber-js'
import isEmpty from 'lodash/isEmpty'
import { Database as SqlJsDatabase } from 'sql.js'
import Contact from '../models/Contact'
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

    results.forEach((result) => {
      if (result[0]) {
        const phoneNums = findPhoneNumbersInText(result?.[0].toString())

        phoneNums.forEach((phoneNum) => {
          const index = phoneNum.number.number.toString()

          this.contacts[index] = new Contact(
            result?.[1]?.toString() || '',
            result?.[2]?.toString() || ''
          )
        })
      }
    })

    return this.contacts
  }
}

export default ContactRepository
