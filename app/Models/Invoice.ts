import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Business from 'App/Models/Business'
import Project from 'App/Models/Project'
import Client from 'App/Models/Client'
import Service from 'App/Models/Service'

export default class Invoice extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'clientId' })
  public clientId: number

  @belongsTo(() => Client)
  public client: BelongsTo<typeof Client>

  @column({ serializeAs: 'businessId' })
  public businessId: number

  @belongsTo(() => Business)
  public business: BelongsTo<typeof Business>

  @column({ serializeAs: 'projectId' })
  public projectId: number

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @column()
  public status: number

  @column({ serializeAs: 'paymentType' })
  public paymentType: number

  @column({ serializeAs: 'paidValue' })
  public paidValue: number

  @manyToMany(() => Service, {
    pivotTable: 'invoice_services',
  })
  public services: ManyToMany<typeof Service>

  @column.dateTime({ serializeAs: 'paidAt' })
  public paidAt: DateTime

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: 'updatedAt',
  })
  public updatedAt: DateTime
}
