import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import Subscription from 'App/Models/Subscription'
import BusinessTeamMember from 'App/Models/BusinessTeamMember'
import PlanFeatureLimitException from 'App/Exceptions/PlanFeatureLimitException'
import NoBusinessToSelectException from 'App/Exceptions/NoBusinessToSelectException'
import EntityNotFoundException from 'App/Exceptions/EntityNotFoundException'
import Client from 'App/Models/Client'
import Project from 'App/Models/Project'

const businessIdCookieKey = 'active-business'

class WithBusinessFk extends BaseModel {
  @column()
  public businessId: number
}

type EntitiesObject = {
  [key: string]: typeof WithBusinessFk
}

export default class Sentinel {
  private topLevelEntityWithBusinessFK: EntitiesObject = {
    clients: Client,
    projects: Project,
  }

  private getTopLevelId(url: string): number | null {
    const topLevelId = url.split('/').length >= 3 ? url.split('/')[2] : null

    if (Number(topLevelId)) {
      return Number(topLevelId)
    } else {
      return null
    }
  }

  private getTopLevelEntity(url: string): string {
    const split = url.split('/')

    if (split.length > 0) {
      return split[1]
    } else {
      return ''
    }
  }

  private hasFKwithBusiness(entity: string): boolean {
    return Object.keys(this.topLevelEntityWithBusinessFK).includes(entity)
  }
  public async handle(
    { request, auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    if (!auth.user) {
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS'
      )
    }

    const activeBusiness = request.cookie(businessIdCookieKey)
    const url = request.url()
    const topLevelEntityKey = this.getTopLevelEntity(url)
    const topLevelEntityId = this.getTopLevelId(url)
    const hasFKwithBusiness = this.hasFKwithBusiness(topLevelEntityKey)
    const method = request.method()
    const teams = await BusinessTeamMember.query()
      .where('freelancer_id', auth.user.id)
      .orderBy('created_at', 'asc')
      .select('business_id')

    const allowedBusiness = (teams || []).map((b) => b.businessId)

    /**
     * Trying to ser a business_id
     */
    if (
      activeBusiness &&
      Number(activeBusiness) &&
      allowedBusiness.includes(activeBusiness)
    ) {
      request.activeBusiness = activeBusiness
    } else if (hasFKwithBusiness && topLevelEntityId) {
      const entity = await this.topLevelEntityWithBusinessFK[topLevelEntityKey]
        .query()
        .where('id', topLevelEntityId)
        .first()

      if (!entity || allowedBusiness.length < 1) {
        throw new NoBusinessToSelectException()
      }

      if (!allowedBusiness.includes(entity.businessId)) {
        throw new EntityNotFoundException()
      }

      request.activeBusiness = entity.businessId

      response.cookie(businessIdCookieKey, entity.businessId, {
        httpOnly: false,
      })
    } else {
      if (!teams || allowedBusiness.length < 1) {
        throw new NoBusinessToSelectException()
      }

      request.activeBusiness = allowedBusiness[0]

      response.cookie(businessIdCookieKey, allowedBusiness[0], {
        httpOnly: false,
      })
    }

    /**
     * Here we have a business_id and are trying to create a top level entity
     * which has a FK with Businesses
     */

    if (
      method === 'POST' &&
      !topLevelEntityId &&
      hasFKwithBusiness &&
      request.activeBusiness &&
      topLevelEntityKey.toLowerCase() === 'clients'
    ) {
      const subscription = await Subscription.query()
        .where('business_id', request.activeBusiness)
        .preload('plan')
        .first()

      if (!subscription) {
        throw new NoBusinessToSelectException()
      }

      if (subscription.plan.name.toLowerCase() === 'trial') {
        const count = await this.topLevelEntityWithBusinessFK[topLevelEntityKey]
          .query()
          .where('business_id', request.activeBusiness)
          .count('* as total')

        if (count[0].total >= 1) {
          throw new PlanFeatureLimitException(topLevelEntityKey)
        }
      }
    }

    await next()
  }
}
