export interface IContact {
  firstName?: string,
  lastName?: string
}

export default class Contact implements IContact {
  public firstName?: string
  public lastName ?: string

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
