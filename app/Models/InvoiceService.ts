import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class InvoiceService extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: 'invoiceId' })
  public invoiceId: number

  @column({ serializeAs: 'serviceId' })
  public serviceId: number

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: 'updatedAt',
  })
  public updatedAt: DateTime
}
