import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Services extends BaseSchema {
  protected tableName = 'services'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('project_id')
        .references('id')
        .inTable('projects')
        .unsigned()
        .onDelete('CASCADE')
        .nullable()
      table.string('name').notNullable()
      table.string('description').nullable()
      table.float('price').unsigned().notNullable()
      table.float('quantity').unsigned().nullable()
      table
        .integer('price_unit_id')
        .references('id')
        .inTable('price_units')
        .unsigned()
        .onDelete('SET NULL')
        .notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
