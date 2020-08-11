import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UpdateFreelancerValidator {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    first_name: schema.string.optional({}, [rules.alpha()]),
    last_name: schema.string.optional({}, [rules.alpha({ allow: ['space'] })]),
    email: schema.string.optional({}, [
      rules.email(),
      rules.unique({ table: 'auths', column: 'email' })
    ])
  })

  public cacheKey = this.ctx.routeKey

  public messages = {}

  public validate = async () =>
    await this.ctx.request.validate({
      schema: this.schema,
      cacheKey: this.cacheKey,
      messages: this.messages
    })
}
