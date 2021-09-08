export type MessageService = 'iMessage' | 'SMS'

export interface IMessage {
  id: string
  name: string
  datetime: string
  fromMe: boolean
  initials: string
  service: MessageService
  text: string
}

export default class Message implements IMessage {
  public id: string
  public name: string
  public datetime: string
  public fromMe: boolean
  public initials: string
  public service: MessageService
  public text: string

  constructor(
    id: string,
    name: string,
    datetime: string,
    fromMe: boolean,
    initials: string,
    service: MessageService,
    text: string
  ) {
    this.id = id
    this.name = name
    this.datetime = datetime
    this.fromMe = fromMe
    this.initials = initials
    this.service = service
    this.text = text
  }
}
