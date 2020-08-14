import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'projectId' })
  public projectId: number

  @column({ serializeAs: 'priceUnitId' })
  public priceUnitId: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public price: number

  @column()
  public quantity: number

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: 'updatedAt',
  })
  public updatedAt: DateTime
}
