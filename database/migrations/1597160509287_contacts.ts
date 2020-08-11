import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Contacts extends BaseSchema {
  protected tableName = 'contacts'

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
      table.string('name').notNullable()
      table.string('email').nullable()
      table.string('role').nullable()
      table.string('phone').nullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
