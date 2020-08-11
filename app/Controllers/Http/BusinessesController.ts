import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreBusinessValidator from 'App/Validators/StoreBusinessValidator'
import BusinessServices from 'App/Services/BusinessServices'
import BusinessTeamMember from 'App/Models/BusinessTeamMember'
import Business from 'App/Models/Business'
import EntityNotFoundException from 'App/Exceptions/EntityNotFoundException'
import UpdateBusinessValidator from 'App/Validators/UpdateBusinessValidator'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import DeleteBusinessValidator from 'App/Validators/DeleteBusinessValidator'

export default class BusinessesController {
  public async index({ auth }: HttpContextContract) {
    if (!auth.user) {
      return
    }

    const teamMembers = await BusinessTeamMember.query()
      .where('freelancer_id', auth.user.id)
      .select(['business_id'])

    const query = Business.query()
      .where('is_active', true)
      .whereIn(
        'id',
        teamMembers.map((t) => t.businessId)
      )
      .select(['id', 'name', 'created_at', 'updated_at'])

    return query.paginate(1, 15)
  }

  public async store(ctx: HttpContextContract) {
    const { auth } = ctx
    const { name, plan_id } = await new StoreBusinessValidator(ctx).validate()

    if (!auth.user) {
      return
    }

    await new BusinessServices().store({
      freelancerId: auth.user.id,
      name,
      planId: plan_id,
    })
  }

  public async show({ params, auth }: HttpContextContract) {
    const { id } = params

    if (!auth.user) {
      return
    }

    const isTeamMember = await BusinessTeamMember.query()
      .where('business_id', id)
      .andWhere('freelancer_id', auth.user.id)
      .first()

    if (!isTeamMember) {
      throw new EntityNotFoundException()
    }

    const business = await Business.query()
      .where('id', id)
      .preload('owner')
      .first()

    if (!business) {
      throw new EntityNotFoundException()
    }

    return business.toJSON()
  }

  public async update(ctx: HttpContextContract) {
    const { params, auth } = ctx
    const { id } = params

    const business = await Business.find(id)

    if (!business) {
      throw new EntityNotFoundException()
    }

    if (business.business_owner !== auth.user?.id) {
      throw new EntityNotFoundException()
    }

    const { name } = await new UpdateBusinessValidator(ctx).validate()

    Object.assign(business, { name })

    await business.save()
  }

  public async destroy(ctx: HttpContextContract) {
    const { params, auth } = ctx
    const { id } = params

    if (!auth.user) {
      return
    }

    const isTeamMember = await BusinessTeamMember.query()
      .where('business_id', id)
      .andWhere('freelancer_id', auth.user.id)
      .first()

    if (!isTeamMember) {
      throw new EntityNotFoundException()
    }

    const business = await Business.find(id)

    if (!business) {
      throw new EntityNotFoundException()
    }

    if (business.business_owner !== auth.user?.id) {
      throw new ForbiddenException()
    }

    await new DeleteBusinessValidator(ctx).validate()

    await business.delete()
  }
}
