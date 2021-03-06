import { filehash } from "../utils/file"

export type Locations = Record<string, string>

const Locations: Locations = {
  AddressBook: filehash('Library/AddressBook/AddressBook.sqlitedb'),
  SMS: filehash('Library/SMS/sms.db'),
  Voicemails: filehash('Library/Voicemail/voicemail.db')
}

export default Locations
