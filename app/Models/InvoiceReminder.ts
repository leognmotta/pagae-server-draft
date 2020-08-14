import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import InvoiceReminderCustomDate from './InvoiceReminderCustomDate'

export default class InvoiceReminder extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public projectId: number

  @column()
  public billingCycleType: number

  @hasMany(() => InvoiceReminderCustomDate)
  public invoiceRemindersCustomDates: HasMany<typeof InvoiceReminderCustomDate>

  @column.dateTime()
  public firstInvoiceReminder: DateTime

  @column.dateTime()
  public lastInvoiceReminder: DateTime

  @column.dateTime()
  public nextInvoiceReminder: DateTime

  @column()
  public invoiceReminderEnabled: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
