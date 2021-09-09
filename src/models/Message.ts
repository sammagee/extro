import isEqual from 'lodash/isEqual'
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

  public isFirst(index: number): boolean {
    return index === 0
  }

  public isLast(index: number, length: number): boolean {
    return index === length - 1
  }

  public isFromSameContact(message: Message): boolean {
    return isEqual(this.contact, message.contact)
  }
}
