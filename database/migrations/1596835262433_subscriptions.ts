import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Subscriptions extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id')
      table
        .integer('plan_id')
        .references('id')
        .inTable('plans')
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
        .unique()
      table.dateTime('start_time', { useTz: true }).notNullable()
      table.dateTime('end_time', { useTz: true }).nullable()
      table.boolean('is_active').defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
