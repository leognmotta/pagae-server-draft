import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BusinessTeamMembers extends BaseSchema {
  protected tableName = 'business_team_members'

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id')
      table
        .integer('business_id')
        .references('id')
        .inTable('businesses')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('freelancer_id')
        .references('id')
        .inTable('freelancers')
        .unsigned()
        .onDelete('CASCADE')
        .notNullable()
        .unique()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
