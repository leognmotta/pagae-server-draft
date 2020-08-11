import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BusinessTeamMember from 'App/Models/BusinessTeamMember'
import EntityNotFoundException from 'App/Exceptions/EntityNotFoundException'
import Subscription from 'App/Models/Subscription'
import UpdateSubscriptionValidator from 'App/Validators/UpdateSubscriptionValidator'
import Business from 'App/Models/Business'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import InvalidPlanException from 'App/Exceptions/InvalidPlanException'
import TrialExceededException from 'App/Exceptions/TrialExceededException'
import Plan from 'App/Models/Plan'

export default class SubscriptionsController {
  public async show({ params, auth }: HttpContextContract) {
    const { businessId } = params

    if (!auth.user) {
      return
    }

    const isTeamMember = await BusinessTeamMember.query()
      .where('business_id', businessId)
      .andWhere('freelancer_id', auth.user.id)
      .first()

    if (!isTeamMember) {
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

  public async update(ctx: HttpContextContract) {
    const { params, auth } = ctx
    const { businessId } = params

    if (!auth.user) {
      return
    }

    const business = await Business.find(businessId)

    if (!business) {
      throw new EntityNotFoundException()
    }

    const isTeamMember = await BusinessTeamMember.query()
      .where('business_id', businessId)
      .andWhere('freelancer_id', auth.user.id)
      .first()

    if (!isTeamMember) {
      throw new EntityNotFoundException()
    }

    if (isTeamMember && business.business_owner !== auth.user.id) {
      throw new ForbiddenException()
    }

    const subscription = await Subscription.query()
      .where('business_id', businessId)
      .first()

    if (!subscription) {
      throw new EntityNotFoundException()
    }

    const { plan_id } = await new UpdateSubscriptionValidator(ctx).validate()

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

  public async delete({ params, auth }: HttpContextContract) {
    const { businessId } = params

    if (!auth.user) {
      return
    }

    const isTeamMember = await BusinessTeamMember.query()
      .where('business_id', businessId)
      .andWhere('freelancer_id', auth.user.id)
      .first()

    if (!isTeamMember) {
      throw new EntityNotFoundException()
    }

    const business = await Business.find(businessId)

    if (!business) {
      throw new EntityNotFoundException()
    }

    if (isTeamMember && business.business_owner !== auth.user.id) {
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
