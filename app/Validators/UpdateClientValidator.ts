import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UpdateClientValidator {
  public schema = schema.create({
    name: schema.string.optional(),
    address: schema.object.optional().members({
      id: schema.number([rules.range(1, 9999999999)]),
      street: schema.string.optional(),
      unit: schema.string.optional(),
      city: schema.string.optional(),
      postal_code: schema.string.optional(),
      country: schema.string.optional(),
      state: schema.string.optional(),
    }),
    contacts: schema.array.optional().members(
      schema.object().members({
        id: schema.number([rules.range(1, 9999999999)]),
        name: schema.string.optional({}, [rules.alpha({ allow: ['space'] })]),
        email: schema.string.optional({}, [rules.email()]),
        phone: schema.string.optional({}, [
          rules.mobile({ locales: ['pt-BR'], strict: true }),
        ]),
        role: schema.string.optional(),
      })
    ),
    tax: schema.object.optional().members({
      id: schema.number([rules.range(1, 9999999999)]),
      label: schema.string.optional(),
      value: schema.string.optional(),
    }),
  })

  public messages = {
    range: '{{ field }} should have max length of 10 and starts as 1',
  }
}
