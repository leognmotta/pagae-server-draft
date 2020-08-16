import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Invoices extends BaseSchema {
  protected tableName = 'invoices'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('client_id')
        .references('id')
        .inTable('clients')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('business_id')
        .references('id')
        .inTable('businesses')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('project_id')
        .references('id')
        .inTable('projects')
        .unsigned()
        .onDelete('SET NULL')
        .nullable()
      table.integer('status').notNullable()
      table.integer('payment_type').notNullable()
      table.dateTime('paid_at', { useTz: true }).nullable()
      table.dateTime('paid_value').nullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
