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

  private customDateRules = (() => {
    const { invoiceReminder } = this.ctx.request.all()

    if (invoiceReminder && invoiceReminder.billingCycleType) {
      const { billingCycleType } = invoiceReminder

      if (
        billingCycleType === BillingCycleTypes.CUSTOM ||
        billingCycleType === BillingCycleTypes.MILESTONE
      ) {
        return [rules.minLength(1), rules.required()]
      }
    }

    return []
  })()

  private milestoneNameRule = (() => {
    const { invoiceReminder } = this.ctx.request.all()

    if (invoiceReminder && invoiceReminder.billingCycleType) {
      const { billingCycleType } = invoiceReminder

      if (billingCycleType === BillingCycleTypes.MILESTONE) {
        return [rules.required()]
      }
    }

    return []
  })()

  private firstInvoiceReminderRules = (() => {
    const { invoiceReminder } = this.ctx.request.all()

    if (invoiceReminder && invoiceReminder.billingCycleType) {
      const { billingCycleType } = invoiceReminder

      if (
        billingCycleType !== BillingCycleTypes.CUSTOM &&
        billingCycleType !== BillingCycleTypes.MILESTONE
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
    project: schema.object().members({
      name: schema.string(),
      startTime: schema.date.optional(),
      endTime: schema.date.optional({}, [rules.afterField('startTime')]),
      currency: schema.string.optional(),
      clientId: schema.number([
        rules.exists({
          table: 'clients',
          column: 'id',
          where: {
            business_id: this.ctx.request.activeBusiness,
          },
        }),
      ]),

      deposit: schema.object.optional().members({
        value: schema.number(),
        required: schema.boolean.optional(),
      }),
    }),

    reminder: schema.object.optional().members({
      billingCycleType: schema.number([
        rules.unsigned(),
        rules.range(this.minBillingTypeNumber, 6),
      ]),
      firstInvoiceReminder: schema.date.optional(
        {},
        this.firstInvoiceReminderRules
      ),
      lastInvoiceReminder: schema.date.optional({}, [
        rules.afterField('firstInvoiceReminder'),
      ]),
      customDates: schema.array.optional(this.customDateRules).members(
        schema.object().members({
          date: schema.date({}, [rules.after('today')]),
          milestone: schema.string.optional({}, this.milestoneNameRule),
        })
      ),
    }),

    services: schema.array.optional([rules.minLength(1)]).members(
      schema.object().members({
        service: schema.object().members({
          name: schema.string(),
        }),

        term: schema.object().members({
          description: schema.string.optional(),
          price: schema.number([rules.range(1, 999999999999999)]),
          quantity: schema.number([rules.range(1, 999999999999999)]),
          priceUnitId: schema.number([
            rules.exists({
              table: 'price_units',
              column: 'id',
            }),
          ]),
        }),
      })
    ),
  })

  public messages = {
    'invoiceReminder.billingCycleType.range':
      'If you require a deposit, you need at least one more invoice.',
  }
}
