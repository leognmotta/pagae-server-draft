import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InvoiceReminders extends BaseSchema {
  protected tableName = 'invoice_reminders'

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
      table
        .integer('billing_cycle_type_id')
        .references('id')
        .inTable('billing_cycle_types')
        .unsigned()
        .onDelete('SET NULL')
        .notNullable()
      table.date('first_invoice_reminder').nullable()
      table.date('last_invoice_reminder').nullable()
      table.boolean('invoice_reminder_enabled').notNullable().defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
