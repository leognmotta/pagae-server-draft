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
  public async show({ request }: HttpContextContract) {
    if (!request.activeBusiness) {
      throw new EntityNotFoundException()
    }

    const subscription = await Subscription.query()
      .where('business_id', request.activeBusiness)
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

  public async update({ auth, request }: HttpContextContract) {
    const { plan_id } = await request.validate(UpdateSubscriptionValidator)

    if (!request.activeBusiness || !auth.user) {
      throw new EntityNotFoundException()
    }

    const business = await Business.find(request.activeBusiness)

    if (!business) {
      throw new EntityNotFoundException()
    }

    if (!BusinessServices.isOwner(business.business_owner, auth.user?.id)) {
      throw new ForbiddenException()
    }

    const plan = await Plan.find(plan_id)

    if (!plan) {
      throw new InvalidPlanException()
    }

    const userBusiness = await Business.query()
      .where('business_owner', auth.user.id)
      .select('*')

    const ohterBusinessWithSubscription = await Subscription.query().whereIn(
      'id',
      (userBusiness || []).map((b) => b.id)
    )

    if (
      ohterBusinessWithSubscription.length > 0 &&
      plan.name.toLowerCase() === 'trial'
    ) {
      throw new TrialExceededException()
    }

    await Subscription.updateOrCreate(
      { businessId: request.activeBusiness },
      { businessId: request.activeBusiness, planId: plan.id }
    )
  }

  public async delete({ auth, request }: HttpContextContract) {
    if (!request.activeBusiness) {
      throw new EntityNotFoundException()
    }

    const business = await Business.find(request.activeBusiness)

    if (!business) {
      throw new EntityNotFoundException()
    }

    if (!BusinessServices.isOwner(business.business_owner, auth.user?.id)) {
      throw new ForbiddenException()
    }

    const subscription = await Subscription.query()
      .where('business_id', request.activeBusiness)
      .first()

    if (!subscription) {
      throw new EntityNotFoundException()
    }

    await subscription.delete()
  }
}
