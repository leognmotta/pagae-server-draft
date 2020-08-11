import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'
import Business from 'App/Models/Business'
import { differenceInCalendarDays } from 'date-fns'

const models = {
  clients: Client,
}

export default class PlanFeature {
  public async handle(
    { params, routeKey, request }: HttpContextContract,
    next: () => Promise<void>,
    features: ['clients']
  ) {
    const { businessId } = params

    if (!businessId) {
      return next()
    }

    const business = await Business.query()
      .where('id', businessId)
      .preload('subscription', (s) => s.preload('plan'))
      .first()

    if (!business) {
      return await next()
    }

    const isTrial = business.subscription.plan.name.toLowerCase() === 'trial'
    const endTime = business.subscription.endTime

    if (isTrial && endTime) {
      const remainingDays = differenceInCalendarDays(
        new Date(endTime.toString()),
        new Date()
      )

      request.isTrialExpired = remainingDays <= 0
    }

    let enabled = true

    if (isTrial && routeKey.includes('POST') && features.length >= 1) {
      const entity = await models[features[0]]
        .query()
        .where('business_id', businessId)
        .count('* as total')

      const total = entity[0].total

      enabled = total === 0
    }

    request.canCreateEntity = enabled

    await next()
  }
}
