import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TrialEndedException extends Exception {
  constructor() {
    super('Your trial period has ended.', 400, 'E_TRIAL_ENDED')
  }

  public async handle(
    { status, code, message }: this,
    { response }: HttpContextContract
  ) {
    response.status(status).json({ code, message: message.split(': ')[1] })
  }
}
