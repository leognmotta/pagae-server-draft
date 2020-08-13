import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PriceUnit from 'App/Models/PriceUnit'

const units = ['flat_fee', 'per_hour', 'per_day', 'per_item', 'per_word']

export default class DefaultPriceUnitSeeder extends BaseSeeder {
  public async run() {
    await PriceUnit.createMany(
      units.map((unit) => ({ name: unit.toUpperCase() }))
    )
  }
}
