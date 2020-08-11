import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Plans extends BaseSchema {
  protected tableName = 'plans'

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('description').notNullable()
      table.integer('duration_days').nullable()
      table.string('currency').notNullable()
      table.decimal('price').notNullable()
      table.boolean('is_active').defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
