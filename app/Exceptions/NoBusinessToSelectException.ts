import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NoBusinessToSelectException extends Exception {
  constructor() {
    super(
      'It looks like you have not yet created any business.',
      400,
      'E_NO_BUSINESS_TO_SELECT'
    )
  }

  public async handle(
    { status, code, message }: this,
    { response }: HttpContextContract
  ) {
    response.status(status).json({ code, message: message.split(': ')[1] })
  }
}
