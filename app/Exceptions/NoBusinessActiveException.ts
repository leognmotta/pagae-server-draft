import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NoBusinessActiveException extends Exception {
  constructor() {
    super('You need to select a business.', 400, 'E_NO_BUSINESS_ACTIVE')
  }

  public async handle(
    { status, code, message }: this,
    { response }: HttpContextContract
  ) {
    response.status(status).json({ code, message: message.split(': ')[1] })
  }
}
