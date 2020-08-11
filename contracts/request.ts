declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    isTeamMember?: boolean
    canCreateEntity?: boolean
    isTrialExpired?: boolean
  }
}
