import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InvalidPlanException extends Exception {
  constructor() {
    super('Invalid plan, please select a valid one.', 400, 'E_INVALID_PLAN')
  }

  public async handle(
    { status, code, message }: this,
    { response }: HttpContextContract
  ) {
    response.status(status).json({ code, message: message.split(': ')[1] })
  }
}
