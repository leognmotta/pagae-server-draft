import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProjectServices extends BaseSchema {
  protected tableName = 'project_services'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('project_id')
        .references('id')
        .inTable('projects')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('service_id')
        .references('id')
        .inTable('services')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
