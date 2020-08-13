import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import BillingCycleType from 'App/Models/BillingCycleType'

const billingCycleTypes = [
  'once',
  'once_more',
  'weekly',
  'monthly',
  'milestone',
  'custom',
]

export default class DefaultBillingCycleTypeSeeder extends BaseSeeder {
  public async run() {
    BillingCycleType.createMany(
      billingCycleTypes.map((type) => ({ name: type.toUpperCase() }))
    )
  }
}
