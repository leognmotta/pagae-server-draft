import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Deposits extends BaseSchema {
  protected tableName = 'deposits'

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
        .unique()
      table.integer('value').notNullable()
      table.boolean('required').notNullable().defaultTo(false)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
