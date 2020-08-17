import Project from 'App/Models/Project'
import { DateTime } from 'luxon'
import { CurrencyCode, ProjectStatuses } from 'App/Utils/enums'
import EntityNotFoundException from 'App/Exceptions/EntityNotFoundException'
import { isBefore } from 'date-fns'

export type DepositDTO = {
  id?: number
  value: number
  required?: boolean
}

export type ProjectDTO = {
  id?: number
  clientId?: number
  name?: string
  status?: number
  startTime?: DateTime
  endTime?: DateTime
  currency?: string
  deposit?: DepositDTO
}

class ProjectServices {
  public async createProject(
    businessId: number,
    { clientId, currency, endTime, name, startTime, deposit }: ProjectDTO
  ): Promise<Project> {
    const project = await Project.create({
      businessId: businessId,
      clientId,
      currency: currency || CurrencyCode.BRL,
      endTime,
      name,
      status:
        startTime && isBefore(new Date(startTime.toString()), new Date())
          ? ProjectStatuses.RUNNING
          : ProjectStatuses.UPCOMING,
      startTime,
    })

    if (deposit) {
      delete deposit.id

      await project.related('deposit').create(deposit)
    }

    return project
  }

  public async updateProject(
    id: number,
    businessId: number,
    { clientId, startTime, status, name, endTime, currency }: ProjectDTO
  ): Promise<Project> {
    if (!businessId) {
      throw new EntityNotFoundException()
    }

    const project = await Project.query()
      .where('id', id)
      .andWhere('business_id', businessId)
      .first()

    if (!project) {
      throw new EntityNotFoundException()
    }

    Object.assign(project, {
      clientId,
      startTime,
      status,
      name,
      endTime,
      currency,
    })

    await project.save()

    return project
  }
}

export default new ProjectServices()
