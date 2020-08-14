import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Freelancer from 'App/Models/Freelancer'
import StoreFreelancerValidator from 'App/Validators/StoreFreelancerValidator'
import UpdateFreelancerValidator from 'App/Validators/UpdateFreelancerValidator'
import EntityNotFoundException from 'App/Exceptions/EntityNotFoundException'
import DeleteFreelancerValidator from 'App/Validators/DeleteFreelancerValidator'
import BusinessTeamMember from 'App/Models/BusinessTeamMember'

export default class FreelancersController {
  public async index({ request }: HttpContextContract) {
    const { page, page_size } = request.get()

    if (!request.activeBusiness) {
      throw new EntityNotFoundException()
    }

    const teamMembers = await BusinessTeamMember.query()
      .where('business_id', request.activeBusiness)
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

  public async store({ request }: HttpContextContract) {
    const { firstName, lastName, email, password } = await request.validate(
      StoreFreelancerValidator
    )

    await Freelancer.create({
      firstName,
      lastName,
      email,
      password,
    })
  }

  public async show({ params, request }: HttpContextContract) {
    const { id } = params

    if (!request.activeBusiness) {
      throw new EntityNotFoundException()
    }

    const isPartOfTeam = await BusinessTeamMember.query()
      .where('business_id', request.activeBusiness)
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
    const { id } = params
    const { email, firstName, lastName } = await request.validate(
      UpdateFreelancerValidator
    )

    if (auth.user && auth.user.id !== Number(id)) {
      throw new EntityNotFoundException()
    }

    const freelancer = await Freelancer.find(id)

    if (!freelancer) {
      throw new EntityNotFoundException()
    }

    Object.assign(freelancer, { firstName, lastName, email })

    await freelancer.save()
  }

  public async destroy({ params, auth, request }: HttpContextContract) {
    const { id } = params

    if (auth.user && auth.user.id !== Number(id)) {
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
