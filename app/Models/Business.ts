import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasOne,
  HasOne,
  manyToMany,
  ManyToMany
} from '@ioc:Adonis/Lucid/Orm'
import Freelancer from 'App/Models/Freelancer'
import Subscription from 'App/Models/Subscription'

export default class Business extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public business_owner: number

  @hasOne(() => Subscription)
  public subscription: HasOne<typeof Subscription>

  @belongsTo(() => Freelancer, { foreignKey: 'business_owner' })
  public owner: BelongsTo<typeof Freelancer>

  @manyToMany(() => Freelancer, { pivotTable: 'business_team_members' })
  public freelancers: ManyToMany<typeof Freelancer>

  @column()
  public isActive: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
