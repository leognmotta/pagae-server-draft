import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PriceUnits extends BaseSchema {
  protected tableName = 'price_units'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('business_id')
        .references('id')
        .inTable('businesses')
        .unsigned()
        .onDelete('CASCADE')
        .nullable()
      table.string('name').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
