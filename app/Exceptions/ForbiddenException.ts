import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ForbiddenException extends Exception {
  constructor() {
    super('Not authorized.', 403, 'E_UNAUTHORIZED')
  }

  public async handle(
    { status, code, message }: this,
    { response }: HttpContextContract
  ) {
    response.status(status).json({ code, message: message.split(': ')[1] })
  }
}
