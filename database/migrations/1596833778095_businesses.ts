import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Businesses extends BaseSchema {
  protected tableName = 'businesses'

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id')
      table.string('name').notNullable()
      table
        .integer('business_owner')
        .references('id')
        .inTable('freelancers')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
      table.boolean('is_active').defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
