import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Projects extends BaseSchema {
  protected tableName = 'projects'

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
      table.integer('status').unsigned().notNullable()
      table.string('name').notNullable()
      table.dateTime('start_time', { useTz: true }).nullable()
      table.dateTime('end_time', { useTz: true }).nullable()
      table.string('currency').notNullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
