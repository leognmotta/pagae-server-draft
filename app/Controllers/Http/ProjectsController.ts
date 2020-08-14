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
      .preload('client')
      .preload('deposit')
      .preload('reminder', (r) => r.preload('invoiceRemindersCustomDates'))
      .preload('services')
      .paginate(Number(page) || 1, Number(page_size) || 15)

    return project.toJSON()
  }

  public async store({ request }: HttpContextContract) {
    const {
      name,
      clientId,
      currency,
      startTime,
      endTime,
      deposit,
      invoiceReminder,
      services,
    } = await request.validate(StoreProjectValidator)

    const project = await Project.create({
      name,
      clientId,
      businessId: request.activeBusiness,
      status:
        startTime && isBefore(new Date(startTime.toString()), new Date())
          ? ProjectStatuses.RUNNING
          : ProjectStatuses.UPCOMING,
      currency: currency || CurrencyCode.BRL,
      startTime,
      endTime,
    })

    if (deposit) {
      await project
        .related('deposit')
        .create({ value: deposit.value, required: deposit?.required })
    }

    if (services) {
      await project.related('services').createMany(services)
    }

    if (invoiceReminder) {
      const {
        billingCycleType,
        firstInvoiceReminder,
        lastInvoiceReminder,
        customDates,
      } = invoiceReminder

      let nextReminder: DateTime | undefined
      let firstReminder: DateTime | undefined

      if (
        billingCycleType !== BillingCycleTypes.MILESTONE &&
        billingCycleType !== BillingCycleTypes.CUSTOM
      ) {
        firstReminder = firstInvoiceReminder
      }

      if (billingCycleType === BillingCycleTypes.WEEKLY) {
        nextReminder = firstInvoiceReminder?.plus({ days: 7 })
      }

      if (billingCycleType === BillingCycleTypes.MONTHLY) {
        nextReminder = firstInvoiceReminder?.plus({ month: 1 })
      }

      const reminder = await project.related('reminder').create({
        billingCycleType,
        firstInvoiceReminder: firstReminder,
        lastInvoiceReminder: firstReminder ? lastInvoiceReminder : undefined,
        nextInvoiceReminder: nextReminder,
      })

      if (
        customDates &&
        (billingCycleType === BillingCycleTypes.CUSTOM ||
          billingCycleType === BillingCycleTypes.MILESTONE)
      ) {
        await reminder
          .related('invoiceRemindersCustomDates')
          .createMany(
            customDates.map(({ date, milestone }) => ({ date, milestone }))
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
