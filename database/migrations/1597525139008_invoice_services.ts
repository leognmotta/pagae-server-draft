import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InvoiceServices extends BaseSchema {
  protected tableName = 'invoice_services'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('invoice_id')
        .references('id')
        .inTable('invoices')
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
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
