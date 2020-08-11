import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class DeleteFreelancerValidator {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    confirmation: schema.string(),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {}

  public validate = async () =>
    await this.ctx.request.validate({
      schema: this.schema,
      cacheKey: this.cacheKey,
      messages: this.messages,
    })
}
