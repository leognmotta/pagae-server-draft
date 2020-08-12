import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreClientValidator from 'App/Validators/StoreClientValidator'
import UpdateClientValidator from 'App/Validators/UpdateClientValidator'
import Client from 'App/Models/Client'
import EntityNotFoundException from 'App/Exceptions/EntityNotFoundException'
import NoBusinessActiveException from 'App/Exceptions/NoBusinessActiveException'

export default class ClientsController {
  public async index({ request }: HttpContextContract) {
    const { page, page_size } = request.get()

    if (!request.activeBusiness) {
      throw new NoBusinessActiveException()
    }

    const clients = Client.query()
      .where('business_id', request.activeBusiness)
      .preload('address')
      .preload('contacts')
      .preload('tax')

    return await clients.paginate(Number(page) || 1, Number(page_size) || 15)
  }

  public async store({ request }: HttpContextContract) {
    const { name, address, tax, contacts } = await request.validate(
      StoreClientValidator
    )

    if (!request.activeBusiness) {
      throw new NoBusinessActiveException()
    }

    const client = await Client.create({
      businessId: request.activeBusiness,
      name,
    })

    if (address) {
      await client.related('address').create(address)
    }

    if (tax) {
      await client.related('tax').create(tax)
    }

    if (contacts) {
      await client.related('contacts').createMany(contacts)
    }
  }

  public async show({ params, request }: HttpContextContract) {
    const { id } = params

    if (!request.activeBusiness) {
      throw new NoBusinessActiveException()
    }

    const client = await Client.query()
      .where('id', id)
      .andWhere('business_id', request.activeBusiness)
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
    const { id } = params
    const { name, address, tax, contacts } = await request.validate(
      UpdateClientValidator
    )

    if (!request.activeBusiness) {
      throw new NoBusinessActiveException()
    }

    const client = await Client.query()
      .where('id', id)
      .andWhere('business_id', request.activeBusiness)
      .first()

    if (!client) {
      throw new EntityNotFoundException()
    }

    if (address) {
      const addressInstance = await client
        .related('address')
        .query()
        .where('client_id', client.id)
        .first()

      if (addressInstance && addressInstance.id !== address.id) {
        throw new EntityNotFoundException()
      }

      if (!addressInstance) {
        delete address.id

        await client.related('address').create({
          postalCode: address.postal_code,
          ...address,
        })
      } else {
        Object.assign(addressInstance, {
          postalCode: address.postal_code,
          ...address,
        })

        await addressInstance.save()
      }
    }

    if (tax) {
      const taxInstance = await client
        .related('tax')
        .query()
        .andWhere('client_id', client.id)
        .first()

      if (taxInstance && taxInstance.id !== tax.id) {
        throw new EntityNotFoundException()
      }

      if (!taxInstance) {
        delete tax.id

        await client.related('tax').create({ ...tax })
      } else {
        Object.assign(taxInstance, { ...tax })

        await taxInstance.save()
      }
    }

    if (contacts) {
      contacts.forEach(async ({ id: contactId, email, name, phone, role }) => {
        const instance = await client
          .related('contacts')
          .query()
          .where('id', contactId)
          .andWhere('client_id', id)
          .first()

        if (!instance) {
          await client.related('contacts').create({ email, name, phone, role })
        } else {
          Object.assign(instance, { email, name, phone, role })

          await instance.save()
        }
      })
    }

    Object.assign(client, { name })

    await client.save()
  }

  public async destroy({ params, request }: HttpContextContract) {
    const { id } = params

    if (!request.activeBusiness) {
      throw new NoBusinessActiveException()
    }

    const client = await Client.query()
      .where('id', id)
      .andWhere('business_id', request.activeBusiness)
      .first()

    if (!client) {
      throw new EntityNotFoundException()
    }

    await client.delete()
  }
}
