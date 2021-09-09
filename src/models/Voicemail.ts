import dayjs from 'dayjs'
import Contact from './Contact'

export interface IVoicemail {
  id: string
  contact: Contact | string
  datetime: string
  duration: number
  trashed: boolean
}

export default class Voicemail implements IVoicemail {
  public id: string
  public contact: Contact | string
  public datetime: string
  public duration: number
  public trashed: boolean

  constructor(
    id: string,
    contact: Contact | string,
    datetime: string,
    duration: number,
    trashed: boolean
  ) {
    this.id = id
    this.contact = contact
    this.datetime = datetime
    this.duration = duration
    this.trashed = trashed
  }

  public getDuration(format: string = 'mm:ss'): string {
    const minutes: number = Math.floor(this.duration / 60)

    return dayjs
      .duration({ minutes, seconds: this.duration - minutes * 60 })
      .format(format)
  }
}
