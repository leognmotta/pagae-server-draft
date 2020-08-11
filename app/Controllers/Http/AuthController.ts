import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login({ auth, request, routeKey }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    if (routeKey === 'POST-/session/login') {
      const rememberUser = !!request.input('remember_me')

      await auth.attempt(email, password, rememberUser)
    } else if (routeKey === 'POST-/api/login') {
      const token = await auth.use('api').attempt(email, password)

      return token.toJSON()
    }
  }

  public async logout({ auth, routeKey }: HttpContextContract) {
    if (routeKey === 'POST-/session/logout') {
      await auth.logout()
    } else if (routeKey === 'POST-/api/logout') {
      await auth.use('api').logout()
    }
  }
}
