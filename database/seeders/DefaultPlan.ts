import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Plan from 'App/Models/Plan'

export default class DefaultPlanSeeder extends BaseSeeder {
  public async run() {
    await Plan.createMany([
      {
        currency: 'BRL',
        description: 'plano gratuito',
        name: 'trial',
        price: 0,
        durationDays: 15,
      },
      {
        currency: 'BRL',
        description: 'plano pro',
        name: 'pro',
        price: 45,
      },
      {
        currency: 'BRL',
        description: 'plano empresa',
        name: 'enterprise',
        price: 99,
      },
    ])
  }
}
