import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class StoreFreelancerValidator {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    first_name: schema.string({}, [rules.alpha()]),
    last_name: schema.string({}, [rules.alpha({ allow: ['space'] })]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: 'freelancers', column: 'email' }),
    ]),
    password: schema.string({}, [
      rules.minLength(8),
      rules.regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
      rules.confirmed(),
    ]),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {}
}
