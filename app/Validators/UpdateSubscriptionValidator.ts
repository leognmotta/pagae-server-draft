import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class UpdateSubscriptionValidator {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({ plan_id: schema.number() })

  public cacheKey = this.ctx.routeKey

  public messages = {}
}
