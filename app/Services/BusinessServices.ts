import Business from 'App/Models/Business'
import BusinessTeamMember from 'App/Models/BusinessTeamMember'
import Subscription from 'App/Models/Subscription'
import Plan from 'App/Models/Plan'
import TrialExceededException from 'App/Exceptions/TrialExceededException'
import InvalidPlanException from 'App/Exceptions/InvalidPlanException'
import { DateTime } from 'luxon'

type StoreDTO = {
  planId?: number
  name: string
  freelancerId: number
}

export default class BusinessServices {
  public async store({ planId, freelancerId, name }: StoreDTO) {
    const hasOtherBusiness = await Business.query()
      .where('business_owner', freelancerId)
      .first()

    if (hasOtherBusiness && !planId) {
      throw new TrialExceededException()
    }

    let plan: Plan | null

    if (!planId) {
      plan = await Plan.query()
        .where('name', 'Free')
        .andWhere('currency', 'BRL')
        .andWhere('is_active', true)
        .first()
    } else {
      plan = await Plan.find(planId)
    }

    if (!plan || !plan.isActive) {
      throw new InvalidPlanException()
    }

    if (plan.name.toLowerCase() === 'trial' && hasOtherBusiness) {
      throw new TrialExceededException()
    }

    const { id: businessId } = await Business.create({
      business_owner: freelancerId,
      name,
    })

    await BusinessTeamMember.create({
      businessId,
      freelancerId,
    })

    await Subscription.create({
      businessId,
      planId: plan.id,
      endTime: plan.durationDays
        ? DateTime.local().plus({ days: plan.durationDays })
        : undefined,
    })
  }
}
