import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class StoreClientValidator {
  constructor(private ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string(),
    address: schema.object.optional().members({
      street: schema.string.optional(),
      unit: schema.string.optional(),
      city: schema.string.optional(),
      postalCode: schema.string.optional(),
      country: schema.string.optional(),
      state: schema.string.optional(),
    }),
    contacts: schema.array.optional().members(
      schema.object().members({
        name: schema.string({}, [rules.alpha({ allow: ['space'] })]),
        email: schema.string.optional({}, [rules.email()]),
        phone: schema.string.optional({}, [
          rules.mobile({ locales: ['pt-BR'], strict: true }),
        ]),
        role: schema.string.optional(),
      })
    ),
    tax: schema.object.optional().members({
      label: schema.string(),
      value: schema.string(),
    }),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {}
}
