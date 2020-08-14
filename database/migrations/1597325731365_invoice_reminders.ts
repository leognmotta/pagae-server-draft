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
      table.integer('billing_cycle_type').unsigned().notNullable()
      table.dateTime('first_invoice_reminder', { useTz: true }).nullable()
      table.dateTime('last_invoice_reminder', { useTz: true }).nullable()
      table.dateTime('next_invoice_reminder', { useTz: true }).nullable()
      table.boolean('invoice_reminder_enabled').notNullable().defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
