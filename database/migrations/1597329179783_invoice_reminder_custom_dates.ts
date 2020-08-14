import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InvoiceReminderCustomDates extends BaseSchema {
  protected tableName = 'invoice_reminder_custom_dates'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('invoice_reminder_id')
        .references('id')
        .inTable('invoice_reminders')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
      table.string('milestone').nullable
      table.dateTime('date', { useTz: true }).notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
