import Project from 'App/Models/Project'
import { DateTime } from 'luxon'
import { CurrencyCode } from 'App/Utils/enums'
import EntityNotFoundException from 'App/Exceptions/EntityNotFoundException'

export type ProjectDTO = {
  clientId: number
  name: string
  status: number
  startTime: DateTime
  endTime: DateTime
  currency: keyof typeof CurrencyCode
}

export default class ProjectServices {
  private businessId: number

  constructor(businessId: number) {
    this.businessId = businessId
  }

  public async createProject(dto: ProjectDTO): Promise<number> {
    const project = await Project.create({
      businessId: this.businessId,
      ...dto,
    })

    return project.id
  }

  public async updateProject(id: number, dto: ProjectDTO): Promise<number> {
    const project = await Project.query()
      .where('id', id)
      .andWhere('business_id', this.businessId)
      .first()

    if (!project) {
      throw new EntityNotFoundException()
    }

    Object.assign(project, dto)

    await project.save()

    return project.id
  }
}
