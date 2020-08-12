import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import geoip from 'geoip-lite'

export default class DetectRequestCountry {
  public async handle(
    { request }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const ip = request.ip()

    const country = geoip.lookup(ip)
    request.country = country?.country

    await next()
  }
}
