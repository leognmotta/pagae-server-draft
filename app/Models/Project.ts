import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasOne,
  HasOne,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import InvoiceReminder from './InvoiceReminder'
import Deposit from './Deposit'
import Service from './Service'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public currency: string

  @column({ serializeAs: 'businessId' })
  public businessId: number

  @hasOne(() => InvoiceReminder)
  public reminder: HasOne<typeof InvoiceReminder>

  @hasOne(() => Deposit)
  public deposit: HasOne<typeof Deposit>

  @manyToMany(() => Service, { pivotTable: 'project_services' })
  public services: ManyToMany<typeof Service>

  @column({ serializeAs: null })
  public clientId: number

  @belongsTo(() => Client)
  public client: BelongsTo<typeof Client>

  @column()
  public status: number

  @column.dateTime({ serializeAs: 'startTime' })
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
