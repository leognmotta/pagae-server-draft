import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Taxes extends BaseSchema {
  protected tableName = 'taxes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('client_id')
        .references('id')
        .inTable('clients')
        .unsigned()
        .onDelete('CASCADE')
        .nullable()
        .unique()
      table.string('label').nullable()
      table.string('value').nullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
