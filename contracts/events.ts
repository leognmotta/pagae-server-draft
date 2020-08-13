declare module '@ioc:Adonis/Core/Event' {
  interface EventsList {
    'new:freelancer': { freelancer_id: number }
    'destroy:freelancer': {
      email: string
      first_name: string
      last_name: string
    }
    'new:business': {
      business_id: number
      freelancer_id: number
    }
  }
}
