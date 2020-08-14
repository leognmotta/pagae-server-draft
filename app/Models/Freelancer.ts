import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, computed } from '@ioc:Adonis/Lucid/Orm'

export default class Freelancer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public firstName: string

  @column({ serializeAs: null })
  public lastName: string

  @computed()
  public get name() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      displayName: `${this.firstName} ${this.lastName}`,
    }
  }

  @column()
  public email: string

  @column({ serializeAs: 'isEmailConfirmed' })
  public isEmailConfirmed: boolean

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: 'updatedAt',
  })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: Freelancer) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
