import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BillingCycleTypes extends BaseSchema {
  protected tableName = 'billing_cycle_types'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
