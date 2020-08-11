import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PlanFeatureLimitException extends Exception {
  constructor(entity = 'entity') {
    super(
      `You have reached the maximum amount of ${entity}, upgrade to PRO to unlock your limits.`,
      400,
      'E_PLAN_FEATURE_LIMIT_EXCEEDED'
    )
  }

  public async handle(
    { status, code, message }: this,
    { response }: HttpContextContract
  ) {
    response.status(status).json({ code, message: message.split(': ')[1] })
  }
}
