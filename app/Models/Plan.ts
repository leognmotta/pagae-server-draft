import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import formatCurrency from 'App/Utils/formatCurrency'

export default class Plan extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column({ serializeAs: 'durationDays' })
  public durationDays: number

  @column()
  public currency: string

  @column({
    serialize: (value) => ({
      displayValue: formatCurrency('pt_BR', 'BRL').format(value),
      value: Number(value),
      currency: 'BRL',
    }),
  })
  public price: number

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
