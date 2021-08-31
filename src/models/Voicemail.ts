import dayjs from "dayjs"

export interface IVoicemail {
  id: string
  name: string
  datetime: string
  duration: number
  initials: string
  trashed: boolean
}

export default class Voicemail implements IVoicemail {
  public id: string
  public name: string
  public datetime: string
  public duration: number
  public initials: string
  public trashed: boolean

  constructor(
    id: string,
    name: string,
    datetime: string,
    duration: number,
    initials: string,
    trashed: boolean
  ) {
    this.id = id
    this.name = name
    this.datetime = datetime
    this.duration = duration
    this.initials = initials
    this.trashed = trashed
  }

  public getDuration(format: string = 'mm:ss'): string {
    const minutes: number = Math.floor(this.duration / 60)

    return dayjs
      .duration({ minutes, seconds: this.duration - minutes * 60 })
      .format(format)
  }
}
