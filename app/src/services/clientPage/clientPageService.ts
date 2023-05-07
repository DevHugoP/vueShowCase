import { IClientPageRepository } from '@/services/clientPage/clientPageRepository'
import RepositoryFactory from '@/services/RepositoryFactory'
import { ClientPage, ClientPageCreate, ClientPageUpdate } from '@/types'

export class ClientPageService {
  private clientPageRepository: IClientPageRepository

  constructor() {
    this.clientPageRepository = RepositoryFactory.get('clientPage')
  }

  public async getAll(params?: Record<string, any>): Promise<ClientPage[]> {
    const { clientPages } = await this.clientPageRepository.getAll(params)

    return clientPages
  }

  public async get(id: string, params?: Record<string, any>): Promise<ClientPage> {
    const { clientPage } = await this.clientPageRepository.get(id, params)

    return clientPage
  }

  public async update(id: string, payload: ClientPageUpdate): Promise<ClientPage> {
    const { clientPage } = await this.clientPageRepository.update(id, payload)

    return clientPage
  }

  public async create(payload: ClientPageCreate): Promise<ClientPage> {
    const { clientPage } = await this.clientPageRepository.create(payload)

    return clientPage
  }

  public async getLanguages(params: { retailerId: number; type: string }): Promise<any> {
    const { languages } = await this.clientPageRepository.getLanguages(params)

    return languages
  }

  public async delete(id: string): Promise<void> {
    return await this.clientPageRepository.delete(id)
  }

  public async activate(id: string, payload: { isActive: boolean }): Promise<void> {
    return await this.clientPageRepository.activate(id, payload)
  }
}

export default new ClientPageService()
