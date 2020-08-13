import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ProjectStatus from 'App/Models/ProjectStatus'

const statuses = ['running', 'upcoming', 'ended', 'archived']

export default class DefaultStatusSeeder extends BaseSeeder {
  public async run() {
    await ProjectStatus.createMany(
      statuses.map((status) => ({ name: status.toUpperCase() }))
    )
  }
}
