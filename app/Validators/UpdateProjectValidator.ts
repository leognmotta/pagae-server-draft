import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UpdateProjectValidator {
  public schema = schema.create({
    name: schema.string.optional(),
    startTime: schema.date.optional(),
    endTime: schema.date.optional({}, [rules.afterField('startTime')]),
    currency: schema.string.optional(),

    deposit: schema.object.optional().members({
      id: schema.number([rules.range(1, 9999999999)]),
      value: schema.number.optional(),
      required: schema.boolean.optional(),
    }),

    invoiceReminder: schema.object.optional().members({
      id: schema.number([rules.range(1, 9999999999)]),
      billingCycleType: schema.number.optional([
        rules.unsigned(),
        rules.range(1, 6),
      ]),
      firstInvoiceReminder: schema.date.optional(),
      lastInvoiceReminder: schema.date.optional({}, [
        rules.afterField('firstInvoiceReminder'),
      ]),
      customDates: schema.array.optional().members(
        schema.object().members({
          id: schema.number([rules.range(1, 9999999999)]),
          date: schema.date.optional({}, [rules.after('today')]),
          milestone: schema.string.optional(),
        })
      ),
    }),

    services: schema.array.optional([rules.minLength(1)]).members(
      schema.object().members({
        id: schema.number([rules.range(1, 9999999999)]),
        name: schema.string(),
        description: schema.string.optional(),
        price: schema.number([rules.range(1, 999999999999999)]),
        quantity: schema.number.optional([rules.range(1, 999999999999999)]),
        priceUnitId: schema.number([
          rules.exists({
            table: 'price_units',
            column: 'id',
          }),
        ]),
      })
    ),
  })

  public messages = {}
}
