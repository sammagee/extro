import { Contact } from '@/models/Contact'

export interface Conversation {
  id: string
  name: string
  date: string
  fromMe: boolean
  initials: string
  text: string
}
