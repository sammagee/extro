export interface IContact {
  firstName?: string
  lastName?: string
}

export default class Contact implements IContact {
  public firstName?: string
  public lastName?: string

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName
    this.lastName = lastName
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`.trim()
  }

  public getInitials(): string {
    return (
      this.getFullName()
        .replace(/[^a-zA-Z\s]/g, '')
        .match(/\b\w/g)
        ?.join('')
        .toUpperCase() || ''
    )
  }
}
