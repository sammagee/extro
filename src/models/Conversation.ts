import Contact from './Contact'

export interface IConversation {
  id: string
  displayName: string
  contacts: (Contact | string)[]
  date: string
  fromMe: boolean
  text: string
}

export default class Conversation implements IConversation {
  public id: string
  public displayName: string
  public contacts: (Contact | string)[]
  public date: string
  public fromMe: boolean
  public text: string

  constructor(
    id: string,
    displayName: string,
    contacts: (Contact | string)[],
    date: string,
    fromMe: boolean,
    text: string
  ) {
    this.id = id
    this.displayName = displayName
    this.contacts = contacts
    this.date = date
    this.fromMe = fromMe
    this.text = text
  }
}
