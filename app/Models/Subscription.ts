import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Plan from 'App/Models/Plan'
import Business from 'App/Models/Business'

export default class Subscription extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'planId' })
  public planId: number

  @belongsTo(() => Plan)
  public plan: BelongsTo<typeof Plan>

  @column({ serializeAs: 'businessId' })
  public businessId: number

  @belongsTo(() => Business)
  public business: BelongsTo<typeof Business>

  @column.dateTime({ autoCreate: true, serializeAs: 'startTime' })
  public startTime: DateTime

  @column.dateTime({ serializeAs: 'endTime' })
  public endTime: DateTime

  @column({ serializeAs: 'isActive' })
  public isActive: boolean

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: 'updatedAt',
  })
  public updatedAt: DateTime
}
