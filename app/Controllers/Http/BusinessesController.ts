import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreBusinessValidator from 'App/Validators/StoreBusinessValidator'
import BusinessServices from 'App/Services/BusinessServices'
import BusinessTeamMember from 'App/Models/BusinessTeamMember'
import Business from 'App/Models/Business'
import EntityNotFoundException from 'App/Exceptions/EntityNotFoundException'
import UpdateBusinessValidator from 'App/Validators/UpdateBusinessValidator'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import DeleteBusinessValidator from 'App/Validators/DeleteBusinessValidator'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { BUSINESS_ID_COOKIE_KEY } from 'App/Utils/Constants/cookies'

export default class BusinessesController {
  public async index({ auth, request }: HttpContextContract) {
    const { page, page_size } = request.get()

    if (!auth.user) {
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS'
      )
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

    return query.paginate(Number(page) || 1, Number(page_size) || 15)
  }

  public async store({ auth, request }: HttpContextContract) {
    const { name, plan_id } = await request.validate(StoreBusinessValidator)

    if (!auth.user) {
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS'
      )
    }

    await new BusinessServices().store({
      freelancerId: auth.user.id,
      name,
      planId: plan_id,
    })
  }

  public async show({ params, request }: HttpContextContract) {
    const { id } = params

    if (Number(id) !== request.activeBusiness) {
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

  public async update({ params, auth, request }: HttpContextContract) {
    const { name } = await request.validate(UpdateBusinessValidator)
    const { id } = params

    if (!auth.user) {
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS'
      )
    }

    const business = await Business.find(id)

    if (!business) {
      throw new EntityNotFoundException()
    }

    if (!BusinessServices.isOwner(business.business_owner, auth.user.id)) {
      throw new EntityNotFoundException()
    }

    Object.assign(business, { name })

    await business.save()
  }

  public async destroy({
    params,
    auth,
    request,
    response,
  }: HttpContextContract) {
    const { id } = params

    if (!auth.user) {
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS'
      )
    }

    if (id !== request.activeBusiness) {
      throw new EntityNotFoundException()
    }

    const business = await Business.find(id)

    if (!business) {
      throw new EntityNotFoundException()
    }

    if (!BusinessServices.isOwner(business.business_owner, auth.user.id)) {
      throw new ForbiddenException()
    }

    await request.validate(DeleteBusinessValidator)

    await business.delete()

    response.cookie(BUSINESS_ID_COOKIE_KEY, '', { httpOnly: false })
  }
}
