import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Plan from 'App/Models/Plan'

export default class DefaultPlanSeeder extends BaseSeeder {
  public async run() {
    await Plan.createMany([
      {
        currency: 'BRL',
        description: 'Plano gratuito',
        name: 'trial',
        price: 0,
        durationDays: 15
      }
    ])
  }
}
