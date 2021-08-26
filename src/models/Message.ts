export interface Message {
  id: string
  name: string
  datetime: string
  fromMe: 0 | 1
  initials: string
  service: 'iMessage' | 'SMS'
  text: string
}
