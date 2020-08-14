import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import InvoiceReminderCustomDate from './InvoiceReminderCustomDate'

export default class InvoiceReminder extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'projectId' })
  public projectId: number

  @column({ serializeAs: 'billingCycleType' })
  public billingCycleType: number

  @hasMany(() => InvoiceReminderCustomDate, {
    serializeAs: 'invoiceRemindersCustomDates',
  })
  public invoiceRemindersCustomDates: HasMany<typeof InvoiceReminderCustomDate>

  @column.dateTime({ serializeAs: 'firstInvoiceReminder' })
  public firstInvoiceReminder: DateTime

  @column.dateTime({ serializeAs: 'lastInvoiceReminder' })
  public lastInvoiceReminder: DateTime

  @column.dateTime({ serializeAs: 'nextInvoiceReminder' })
  public nextInvoiceReminder: DateTime

  @column({ serializeAs: 'invoiceReminderEnabled' })
  public invoiceReminderEnabled: boolean

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: 'updatedAt',
  })
  public updatedAt: DateTime
}
