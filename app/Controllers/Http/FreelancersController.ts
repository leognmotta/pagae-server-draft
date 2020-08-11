import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Freelancer from 'App/Models/Freelancer'
import StoreFreelancerValidator from 'App/Validators/StoreFreelancerValidator'
import UpdateFreelancerValidator from 'App/Validators/UpdateFreelancerValidator'
import EntityNotFoundException from 'App/Exceptions/EntityNotFoundException'
import DeleteFreelancerValidator from 'App/Validators/DeleteFreelancerValidator'
import BusinessTeamMember from 'App/Models/BusinessTeamMember'

export default class FreelancersController {
  public async index({ request, params, auth }: HttpContextContract) {
    const { businessId } = params
    const { page, page_size } = request.get()

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

    const teamMembers = await BusinessTeamMember.query()
      .where('business_id', businessId)
      .select(['freelancer_id'])

    const freelancers = Freelancer.query()
      .where('is_active', true)
      .whereIn(
        'id',
        teamMembers.map((t) => t.freelancerId)
      )

    return await freelancers.paginate(
      Number(page) || 1,
      Number(page_size) || 15
    )
  }

  public async store(ctx: HttpContextContract) {
    const { cacheKey, messages, schema } = new StoreFreelancerValidator(ctx)

    const {
      first_name,
      last_name,
      email,
      password,
    } = await ctx.request.validate({
      schema,
      messages,
      cacheKey,
    })

    await Freelancer.create({
      firstName: first_name,
      lastName: last_name,
      email,
      password,
    })
  }

  public async show({ params, auth }: HttpContextContract) {
    const { id, businessId } = params

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

    const isPartOfTeam = await BusinessTeamMember.query()
      .where('business_id', businessId)
      .andWhere('freelancer_id', id)
      .first()

    if (!isPartOfTeam) {
      throw new EntityNotFoundException()
    }

    const freelancer = await Freelancer.find(id)

    if (!freelancer) {
      throw new EntityNotFoundException()
    }

    return freelancer.toJSON()
  }

  public async update(ctx: HttpContextContract) {
    const { auth, params } = ctx
    const { id } = params
    const {
      email,
      first_name,
      last_name,
    } = await new UpdateFreelancerValidator(ctx).validate()

    if (!auth.user) {
      return
    }

    if (auth.user.id !== Number(id)) {
      throw new EntityNotFoundException()
    }

    const freelancer = await Freelancer.find(id)

    if (!freelancer) {
      throw new EntityNotFoundException()
    }

    Object.assign(freelancer, { first_name, last_name, email })

    await freelancer.save()
  }

  public async destroy(ctx: HttpContextContract) {
    const { params, auth } = ctx
    const { id } = params

    if (!auth.user) {
      return
    }

    if (auth.user.id !== Number(id)) {
      throw new EntityNotFoundException()
    }

    await new DeleteFreelancerValidator(ctx).validate()

    const freelancer = await Freelancer.find(id)

    if (!freelancer) {
      throw new EntityNotFoundException()
    }

    await freelancer.delete()
  }
}
