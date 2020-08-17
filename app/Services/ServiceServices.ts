import Project from 'App/Models/Project'
import Service from 'App/Models/Service'

type CreateServicesDTO = {
  service: {
    name: string
  }
  term: {
    description: string | undefined
    price: number
    quantity: number
    priceUnitId: number
  }
}

class ServiceServices {
  public async createProjectServices(
    businessId: number,
    project: Project,
    dto: CreateServicesDTO[]
  ) {
    dto.forEach(async ({ service, term }) => {
      const instance = await Service.query()
        .where('name', 'like', service.name)
        .where('business_id', businessId)
        .first()

      if (instance) {
        instance.related('term').create(term)
      } else {
        const newInstance = await project
          .related('services')
          .create({ businessId, name: service.name })

        await newInstance.related('term').create(term)
      }
    })
  }
}

export default new ServiceServices()
