import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Freelancer from 'App/Models/Freelancer'
import StoreFreelancerValidator from 'App/Validators/StoreFreelancerValidator'
import UpdateFreelancerValidator from 'App/Validators/UpdateFreelancerValidator'
import EntityNotFoundException from 'App/Exceptions/EntityNotFoundException'
import DeleteFreelancerValidator from 'App/Validators/DeleteFreelancerValidator'
import BusinessTeamMember from 'App/Models/BusinessTeamMember'

export default class FreelancersController {
  public async index({ request, params }: HttpContextContract) {
    const { businessId } = params
    const { page, page_size } = request.get()

    if (!request.isTeamMember) {
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

  public async show({ params, request }: HttpContextContract) {
    const { id, businessId } = params

    if (!request.isTeamMember) {
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

  public async update({ auth, params, request }: HttpContextContract) {
    const { email, first_name, last_name } = await request.validate(
      UpdateFreelancerValidator
    )
    const { id } = params

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

  public async destroy({ params, auth, request }: HttpContextContract) {
    const { id } = params

    if (!auth.user) {
      return
    }

    if (auth.user.id !== Number(id)) {
      throw new EntityNotFoundException()
    }

    await request.validate(DeleteFreelancerValidator)

    const freelancer = await Freelancer.find(id)

    if (!freelancer) {
      throw new EntityNotFoundException()
    }

    await freelancer.delete()
  }
}
