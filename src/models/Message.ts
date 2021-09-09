import Contact from './Contact'

export type MessageService = 'iMessage' | 'SMS'

export interface IMessage {
  id: string
  contact: Contact | string
  datetime: string
  fromMe: boolean
  service: MessageService
  text: string
}

export default class Message implements IMessage {
  public id: string
  public contact: Contact | string
  public datetime: string
  public fromMe: boolean
  public service: MessageService
  public text: string

  constructor(
    id: string,
    contact: Contact | string,
    datetime: string,
    fromMe: boolean,
    service: MessageService,
    text: string
  ) {
    this.id = id
    this.contact = contact
    this.datetime = datetime
    this.fromMe = fromMe
    this.service = service
    this.text = text
  }
}
