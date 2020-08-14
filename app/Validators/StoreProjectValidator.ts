import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'
import { BillingCycleTypes } from 'App/Utils/enums'

export default class StoreProjectValidator {
  constructor(private ctx: HttpContextContract) {}

  private minBillingTypeNumber = (() => {
    const { deposit } = this.ctx.request.all()

    return deposit ? BillingCycleTypes.ONCE_MORE : BillingCycleTypes.ONCE
  })()

  private custom_date_rules = (() => {
    const { invoice_reminder } = this.ctx.request.all()

    if (invoice_reminder && invoice_reminder.billing_cycle_type) {
      const { billing_cycle_type } = invoice_reminder

      if (
        billing_cycle_type === BillingCycleTypes.CUSTOM ||
        billing_cycle_type === BillingCycleTypes.MILESTONE
      ) {
        return [rules.minLength(1), rules.required()]
      }
    }

    return []
  })()

  private milestone_name_rule = (() => {
    const { invoice_reminder } = this.ctx.request.all()

    if (invoice_reminder && invoice_reminder.billing_cycle_type) {
      const { billing_cycle_type } = invoice_reminder

      if (billing_cycle_type === BillingCycleTypes.MILESTONE) {
        return [rules.required()]
      }
    }

    return []
  })()

  private first_invoice_reminder_rules = (() => {
    const { invoice_reminder } = this.ctx.request.all()

    if (invoice_reminder && invoice_reminder.billing_cycle_type) {
      const { billing_cycle_type } = invoice_reminder

      if (
        billing_cycle_type !== BillingCycleTypes.CUSTOM &&
        billing_cycle_type !== BillingCycleTypes.MILESTONE
      ) {
        return [rules.after('today'), rules.required()]
      }
    }

    return []
  })()

  public refs = schema.refs({
    allowedDate: DateTime.local().plus({ days: 2 }),
  })

  public schema = schema.create({
    client_id: schema.number([
      rules.exists({
        table: 'clients',
        column: 'id',
        where: { business_id: this.ctx.request.activeBusiness },
      }),
    ]),

    name: schema.string(),
    start_time: schema.date.optional(),
    end_time: schema.date.optional({}, [rules.afterField('start_time')]),
    currency: schema.string.optional(),

    deposit: schema.object.optional().members({
      value: schema.number(),
      required: schema.boolean.optional(),
    }),

    invoice_reminder: schema.object.optional().members({
      billing_cycle_type: schema.number([
        rules.unsigned(),
        rules.range(this.minBillingTypeNumber, 6),
      ]),
      first_invoice_reminder: schema.date.optional(
        {},
        this.first_invoice_reminder_rules
      ),
      last_invoice_reminder: schema.date.optional({}, [
        rules.afterField('first_invoice_reminder'),
      ]),
      custom_dates: schema.array.optional(this.custom_date_rules).members(
        schema.object().members({
          date: schema.date({}, [rules.after('today')]),
          milestone: schema.string.optional({}, this.milestone_name_rule),
        })
      ),
    }),

    services: schema.array.optional([rules.minLength(1)]).members(
      schema.object().members({
        name: schema.string(),
        description: schema.string.optional(),
        price: schema.number([rules.range(1, 999999999999999)]),
        quantity: schema.number([rules.range(1, 999999999999999)]),
        price_unit_id: schema.number([
          rules.exists({
            table: 'price_units',
            column: 'id',
          }),
        ]),
      })
    ),
  })

  public messages = {
    'invoice_reminder.billing_cycle_type.range':
      'If you require a deposit, you need at least one more invoice.',
  }
}
