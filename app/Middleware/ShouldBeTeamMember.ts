import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TeamMemberServices from 'App/Services/TeamMemberServices'

export default class ShouldBeTeamMember {
  public async handle(
    { auth, params, request }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const { businessId } = params

    if (!businessId) {
      return await next()
    }

    if (!auth.user) {
      return await next()
    }

    request.isTeamMember = await TeamMemberServices.isTeamMember(
      businessId,
      auth.user.id
    )

    await next()
  }
}
