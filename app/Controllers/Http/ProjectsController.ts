import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreProjectValidator from 'App/Validators/StoreProjectValidator'
import Project from 'App/Models/Project'
import {
  ProjectStatuses,
  CurrencyCode,
  BillingCycleTypes,
} from 'App/Utils/enums'
import { isBefore } from 'date-fns'
import { DateTime } from 'luxon'
import NoBusinessActiveException from 'App/Exceptions/NoBusinessActiveException'
import EntityNotFoundException from 'App/Exceptions/EntityNotFoundException'

export default class ProjectsController {
  public async index({ request }: HttpContextContract) {
    const { page, page_size } = request.get()

    if (!request.activeBusiness) {
      throw new NoBusinessActiveException()
    }

    const project = await Project.query()
      .where('business_id', request.activeBusiness)
      // .preload('client')
      // .preload('deposit')
      // .preload('reminder', (r) => r.preload('invoiceRemindersCustomDates'))
      .preload('services')
      .paginate(Number(page) || 1, Number(page_size) || 15)

    return project.toJSON()
  }

  public async store({ request }: HttpContextContract) {
    const {
      name,
      client_id,
      currency,
      start_time,
      end_time,
      deposit,
      invoice_reminder,
      services,
    } = await request.validate(StoreProjectValidator)

    const project = await Project.create({
      name,
      clientId: client_id,
      businessId: request.activeBusiness,
      status:
        start_time && isBefore(new Date(start_time.toString()), new Date())
          ? ProjectStatuses.RUNNING
          : ProjectStatuses.UPCOMING,
      currency: currency || CurrencyCode.BRL,
      startTime: start_time,
      endTime: end_time,
    })

    if (deposit) {
      await project
        .related('deposit')
        .create({ value: deposit.value, required: deposit?.required })
    }

    if (services) {
      await project.related('services').createMany(services)
    }

    if (invoice_reminder) {
      const {
        billing_cycle_type,
        first_invoice_reminder,
        last_invoice_reminder,
        custom_dates,
      } = invoice_reminder

      let nextReminder: DateTime | undefined
      let firstReminder: DateTime | undefined

      if (
        billing_cycle_type !== BillingCycleTypes.MILESTONE &&
        billing_cycle_type !== BillingCycleTypes.CUSTOM
      ) {
        firstReminder = first_invoice_reminder
      }

      if (billing_cycle_type === BillingCycleTypes.WEEKLY) {
        nextReminder = first_invoice_reminder?.plus({ days: 7 })
      }

      if (billing_cycle_type === BillingCycleTypes.MONTHLY) {
        nextReminder = first_invoice_reminder?.plus({ month: 1 })
      }

      const reminder = await project.related('reminder').create({
        billingCycleType: billing_cycle_type,
        firstInvoiceReminder: firstReminder,
        lastInvoiceReminder: firstReminder ? last_invoice_reminder : undefined,
        nextInvoiceReminder: nextReminder,
      })

      if (
        custom_dates &&
        (billing_cycle_type === BillingCycleTypes.CUSTOM ||
          billing_cycle_type === BillingCycleTypes.MILESTONE)
      ) {
        await reminder
          .related('invoiceRemindersCustomDates')
          .createMany(
            custom_dates.map(({ date, milestone }) => ({ date, milestone }))
          )
      }
    }
  }

  public async show({ params, request }: HttpContextContract) {
    const { id } = params

    if (!request.activeBusiness) {
      throw new NoBusinessActiveException()
    }

    const project = await Project.query()
      .where('id', id)
      .andWhere('business_id', request.activeBusiness)
      .preload('client')
      .preload('deposit')
      .preload('reminder')
      .preload('services')
      .first()

    if (!project) {
      throw new EntityNotFoundException()
    }

    return project.toJSON()
  }

  public async update(ctx: HttpContextContract) {}

  public async destroy(ctx: HttpContextContract) {}
}
