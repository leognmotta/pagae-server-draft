import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Service from './Service'

export default class Term extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'serviceId' })
  public serviceId: number

  @belongsTo(() => Service)
  public service: BelongsTo<typeof Service>

  @column()
  public description: string

  @column({ serializeAs: 'priceUnitId' })
  public priceUnitId: number

  @column()
  public price: number

  @column()
  public quantity: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
