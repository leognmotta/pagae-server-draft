import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Tax extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'clientId' })
  public clientId: number

  @column()
  public label: string

  @column()
  public value: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: 'updatedAt',
  })
  public updatedAt: DateTime
}
