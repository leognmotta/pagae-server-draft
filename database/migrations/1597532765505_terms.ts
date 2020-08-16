import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Terms extends BaseSchema {
  protected tableName = 'terms'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('description').nullable()
      table.float('price').unsigned().notNullable()
      table.float('quantity').unsigned().nullable()
      table
        .integer('service_id')
        .references('id')
        .inTable('services')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
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
