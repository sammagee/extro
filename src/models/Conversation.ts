export interface IConversation {
  id: string
  name: string
  date: string
  fromMe: boolean
  initials: string
  text: string
}

export default class Conversation implements IConversation {
  public id: string
  public name: string
  public date: string
  public fromMe: boolean
  public initials: string
  public text: string

  constructor(
    id: string,
    name: string,
    date: string,
    fromMe: boolean,
    initials: string,
    text: string
  ) {
    this.id = id
    this.name = name
    this.date = date
    this.fromMe = fromMe
    this.initials = initials
    this.text = text
  }
}
