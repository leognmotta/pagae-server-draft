import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FreelancersSchema extends BaseSchema {
  protected tableName = 'freelancers'

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id').primary()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email', 255).notNullable()
      table.boolean('is_email_confirmed').nullable()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.boolean('is_active').defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
