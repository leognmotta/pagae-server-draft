declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    activeBusiness?: number
    country?: string
  }
}
