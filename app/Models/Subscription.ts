import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Plan from 'App/Models/Plan'
import Business from 'App/Models/Business'

export default class Subscription extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public planId: number

  @belongsTo(() => Plan)
  public plan: BelongsTo<typeof Plan>

  @column()
  public businessId: number

  @belongsTo(() => Business)
  public business: BelongsTo<typeof Business>

  @column.dateTime({ autoCreate: true })
  public startTime: DateTime

  @column.dateTime()
  public endTime: DateTime

  @column()
  public isActive: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
