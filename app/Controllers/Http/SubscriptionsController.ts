import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EntityNotFoundException from 'App/Exceptions/EntityNotFoundException'
import Subscription from 'App/Models/Subscription'
import UpdateSubscriptionValidator from 'App/Validators/UpdateSubscriptionValidator'
import Business from 'App/Models/Business'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import InvalidPlanException from 'App/Exceptions/InvalidPlanException'
import TrialExceededException from 'App/Exceptions/TrialExceededException'
import Plan from 'App/Models/Plan'
import BusinessServices from 'App/Services/BusinessServices'

export default class SubscriptionsController {
  public async show({ params, request }: HttpContextContract) {
    const { businessId } = params

    if (!request.isTeamMember) {
      throw new EntityNotFoundException()
    }

    const subscription = await Subscription.query()
      .where('business_id', businessId)
      .select([
        'id',
        'plan_id',
        'start_time',
        'end_time',
        'created_at',
        'updated_at',
      ])
      .preload('plan', (plan) =>
        plan.select([
          'id',
          'name',
          'description',
          'duration_days',
          'currency',
          'price',
          'created_at',
          'updated_at',
        ])
      )
      .first()

    if (!subscription) {
      throw new EntityNotFoundException()
    }

    return subscription.toJSON()
  }

  public async update({ params, auth, request }: HttpContextContract) {
    const { plan_id } = await request.validate(UpdateSubscriptionValidator)
    const { businessId } = params

    if (!request.isTeamMember) {
      throw new EntityNotFoundException()
    }

    const business = await Business.find(businessId)

    if (!business) {
      throw new EntityNotFoundException()
    }

    if (!BusinessServices.isOwner(business.business_owner, auth.user?.id)) {
      throw new ForbiddenException()
    }

    const subscription = await Subscription.query()
      .where('business_id', businessId)
      .first()

    if (!subscription) {
      throw new EntityNotFoundException()
    }

    const plan = await Plan.find(plan_id)

    if (!plan) {
      throw new InvalidPlanException()
    }

    if (plan.name.toLowerCase() === 'trial') {
      throw new TrialExceededException()
    }

    Object.assign(subscription, { planId: plan_id })

    await subscription.save()
  }

  public async delete({ params, auth, request }: HttpContextContract) {
    const { businessId } = params

    if (!request.isTeamMember) {
      throw new EntityNotFoundException()
    }

    const business = await Business.find(businessId)

    if (!business) {
      throw new EntityNotFoundException()
    }

    if (!BusinessServices.isOwner(business.business_owner, auth.user?.id)) {
      throw new ForbiddenException()
    }

    const subscription = await Subscription.query()
      .where('business_id', businessId)
      .first()

    if (!subscription) {
      throw new EntityNotFoundException()
    }

    await subscription.delete()
  }
}
