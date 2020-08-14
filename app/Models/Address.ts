import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'clientId' })
  public clientId: number

  @column()
  public street?: string

  @column()
  public unit?: string

  @column()
  public city?: string

  @column({ serializeAs: 'postalCode' })
  public postalCode?: string

  @column()
  public state?: string

  @column()
  public country?: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: 'updatedAt',
  })
  public updatedAt: DateTime
}
