import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TrialExceededException extends Exception {
  constructor() {
    super(
      'You already exceeded the limits of trial account, please provide another plan.',
      400,
      'E_TRIAL_EXCEEDED'
    )
  }

  public async handle(
    { status, code, message }: this,
    { response }: HttpContextContract
  ) {
    response.status(status).json({ code, message: message.split(': ')[1] })
  }
}
