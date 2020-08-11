import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses'

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
      table.string('street').nullable()
      table.string('unit').nullable()
      table.string('city').nullable()
      table.string('postal_code').nullable()
      table.string('country').nullable()
      table.string('state').nullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
