import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EntityNotFoundException extends Exception {
  constructor() {
    super(
      'The entity you are trying to reach was not found.',
      404,
      'E_ENTITY_NOT_FOUND'
    )
  }

  public async handle(
    { status, code, message }: this,
    { response }: HttpContextContract
  ) {
    response.status(status).json({ code, message: message.split(': ')[1] })
  }
}
