import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class InvoiceReminderCustomDate extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'invoiceReminderId' })
  public invoiceReminderId: number

  @column()
  public milestone: string

  @column.dateTime()
  public date: DateTime

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: 'updatedAt',
  })
  public updatedAt: DateTime
}
