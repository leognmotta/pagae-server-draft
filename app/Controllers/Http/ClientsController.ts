import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreClientValidator from 'App/Validators/StoreClientValidator'
import UpdateClientValidator from 'App/Validators/UpdateClientValidator'
import Client from 'App/Models/Client'
import EntityNotFoundException from 'App/Exceptions/EntityNotFoundException'
import PlanFeatureLimitException from 'App/Exceptions/PlanFeatureLimitException'

export default class ClientsController {
  public async index({ params, request }: HttpContextContract) {
    const { businessId } = params
    const { page, page_size } = request.get()

    if (!request.isTeamMember) {
      throw new EntityNotFoundException()
    }

    const clients = Client.query()
      .where('business_id', businessId)
      .preload('address')
      .preload('contacts')
      .preload('tax')

    return await clients.paginate(Number(page) || 1, Number(page_size) || 15)
  }

  public async store({ request, params }: HttpContextContract) {
    const { businessId } = params
    const { name, address, tax, contacts } = await request.validate(
      StoreClientValidator
    )

    if (!request.isTeamMember) {
      throw new EntityNotFoundException()
    }

    if (!request.canCreateEntity) {
      throw new PlanFeatureLimitException('clients')
    }

    const client = await Client.create({ businessId, name })

    await client.related('address').create(address || {})

    await client.related('tax').create(tax || {})

    if (contacts) {
      await client.related('contacts').createMany(contacts)
    }
  }

  public async show({ params, request }: HttpContextContract) {
    const { businessId, id } = params

    if (!request.isTeamMember) {
      throw new EntityNotFoundException()
    }

    const client = await Client.query()
      .where('id', id)
      .andWhere('business_id', businessId)
      .preload('address')
      .preload('contacts')
      .preload('tax')
      .first()

    if (!client) {
      throw new EntityNotFoundException()
    }

    return client.toJSON()
  }

  public async update({ params, request }: HttpContextContract) {
    const { businessId, id } = params
    const { name, address, tax, contacts } = await request.validate(
      UpdateClientValidator
    )

    if (!request.isTeamMember) {
      throw new EntityNotFoundException()
    }

    const client = await Client.query()
      .where('id', id)
      .andWhere('business_id', businessId)
      .first()

    if (!client) {
      throw new EntityNotFoundException()
    }

    Object.assign(client, { name })

    if (address) {
      const addressInstance = await client
        .related('address')
        .query()
        .andWhere('client_id', client.id)
        .first()

      if (!addressInstance) {
        throw new EntityNotFoundException()
      }

      Object.assign(addressInstance, {
        postalCode: address.postal_code,
        ...address,
      })

      await addressInstance.save()
    }

    if (tax) {
      const taxInstance = await client
        .related('tax')
        .query()
        .andWhere('client_id', client.id)
        .first()

      if (!taxInstance) {
        throw new EntityNotFoundException()
      }

      Object.assign(taxInstance, { ...tax })

      await taxInstance.save()
    }

    if (contacts) {
      contacts.forEach(async (contact) => {
        await client
          .related('contacts')
          .updateOrCreate({ id: contact.id }, contact)
      })
    }

    await client.save()
  }

  public async destroy({ params, request }: HttpContextContract) {
    const { businessId, id } = params

    if (!request.isTeamMember) {
      throw new EntityNotFoundException()
    }

    const client = await Client.query()
      .where('id', id)
      .andWhere('business_id', businessId)
      .first()

    if (!client) {
      throw new EntityNotFoundException()
    }

    await client.delete()
  }
}
