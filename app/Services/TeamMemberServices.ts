import BusinessTeamMember from 'App/Models/BusinessTeamMember'

export default class TeamMemberServices {
  public static async isTeamMember(
    businessId: number,
    freelancerId: number
  ): Promise<boolean> {
    const isTeamMember = await BusinessTeamMember.query()
      .where('business_id', businessId)
      .andWhere('freelancer_id', freelancerId)
      .select(['id'])
      .first()

    return isTeamMember !== null
  }
}
