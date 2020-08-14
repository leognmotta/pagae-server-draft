import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasOne,
  HasOne,
  hasMany,
  HasMany,
  computed,
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

  @column()
  public businessId: number

  @computed()
  public get balance() {
    if (!this.services) {
      return {}
    }

    return {
      total: Number(
        this.services
          .reduce((a, { price, priceUnitId, quantity }) => {
            if (priceUnitId === 1) {
              return a + price
            }

            return a + price * quantity
          }, 0)
          .toFixed(2)
      ),
    }
  }

  @hasOne(() => InvoiceReminder)
  public reminder: HasOne<typeof InvoiceReminder>

  @hasOne(() => Deposit)
  public deposit: HasOne<typeof Deposit>

  @hasMany(() => Service)
  public services: HasMany<typeof Service>

  @column({ serializeAs: null })
  public clientId: number

  @belongsTo(() => Client)
  public client: BelongsTo<typeof Client>

  @column()
  public status: number

  @column.dateTime()
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
