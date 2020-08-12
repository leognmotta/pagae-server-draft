import BusinessTeamMember from 'App/Models/BusinessTeamMember'
import EntityNotFoundException from 'App/Exceptions/EntityNotFoundException'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'

export default class TeamMemberServices {
  public static async isTeamMemberOrFail(
    businessId: number,
    auth: AuthContract
  ): Promise<void> {
    if (!auth.user) {
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS'
      )
    }

    const isTeamMember = await BusinessTeamMember.query()
      .where('business_id', businessId)
      .andWhere('freelancer_id', auth.user.id)
      .select(['id'])
      .first()

    if (!isTeamMember) {
      throw new EntityNotFoundException()
    }
  }
}
