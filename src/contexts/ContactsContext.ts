import { createContext } from 'react'
import { ContactEntries } from '../repositories/ContactRepository'

const ContactsContext = createContext<ContactEntries | null>(null)

export default ContactsContext
