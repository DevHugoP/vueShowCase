import { i18n } from '@/plugins/i18n'
import HttpRepository from '@/services/HttpRepository'
import { OrderDocument, OrderEntity, OrderHistory, OrderHistoryLight } from '@/types'
import { AxiosResponse } from 'axios'
import Repository from '../Repository'

export interface MergePayload {
  from: number
  to: number[]
}

export interface IOrderRepository {
  getAll: (params: Record<string, any>) => Promise<{ orders: OrderEntity[] }>
  get: (id: number, params: Record<string, any>) => Promise<{ order: OrderEntity }>
  confirm: (id: number) => Promise<void>
  create: (order: Partial<OrderEntity>) => Promise<{ order: OrderEntity }>
  getSlip: (id: number) => Promise<AxiosResponse>
  getLabel: (id: number) => Promise<AxiosResponse>
  getLabels: (params: Record<string, any>) => Promise<AxiosResponse>
  update: (id: number | string, payload: Partial<OrderEntity>) => Promise<{ order: OrderEntity }>
  merge: (payload: MergePayload) => Promise<{ order: OrderEntity }>
  delete: (id: number | string) => Promise<AxiosResponse>
  validate: (id: number | string) => Promise<AxiosResponse>
  retry: (id: number | string) => Promise<AxiosResponse>
  getHistory: (id: number | string) => Promise<{ histories: OrderHistoryLight[] }>
  getHistoryDetail: (
    id: number | string,
    historyId: number | string,
  ) => Promise<{ history: OrderHistory }>
  createQuote: (id: number | string, quote: Record<string, any>) => Promise<AxiosResponse>
  getDocuments: (id: number) => Promise<{ documents: OrderDocument[] }>
  downloadDocument: (orderId: number, documentId: string) => Promise<AxiosResponse>
}

export default class OrderRepository extends HttpRepository {
  async confirm(id: number): Promise<any> {
    return Repository.post(`${this.endpoint}/${id}/confirm`)
  }

  async validate(id: number | string): Promise<any> {
    return Repository.post(`${this.endpoint}/${id}/validate`)
  }

  async getSlip(id: number): Promise<any> {
    return Repository.post(
      `${this.endpoint}/${id}/slip`,
      {},
      {
        headers: {
          'accept-language': i18n.getCurrentLanguage(),
        },
      },
    )
  }

  async getLabel(id: number): Promise<any> {
    return Repository.get(`${this.endpoint}/${id}/label`, { responseType: 'arraybuffer' })
  }

  async getLabels(params: Record<string, any>): Promise<any> {
    return Repository.post(`${this.endpoint}/labels`, params, { responseType: 'arraybuffer' })
  }

  async merge(payload: MergePayload): Promise<any> {
    const { data } = await Repository.post(`${this.endpoint}/merge`, payload)
    return data
  }

  async retry(id: number | string): Promise<any> {
    return Repository.post(`${this.endpoint}/${id}/retry`)
  }

  async getHistory(id: number | string): Promise<any> {
    const { data } = await Repository.get(`${this.endpoint}/${id}/history`)
    return data
  }

  async getHistoryDetail(id: number | string, historyId: number | string): Promise<any> {
    const { data } = await Repository.get(`${this.endpoint}/${id}/history/${historyId}`)
    return data
  }

  async downloadLabels(params: Record<string, any>): Promise<any> {
    return Repository.get(`${this.endpoint}/labels`, {
      params: this.adaptParams(params),
      responseType: 'arraybuffer',
    })
  }

  async createQuote(id: number | string, quote: Record<string, any>): Promise<any> {
    return Repository.post(`${this.endpoint}/${id}/quote`, quote)
  }

  async getDocuments(id: number): Promise<any> {
    const { data } = await Repository.get(`${this.endpoint}/${id}/documents`)
    return data
  }

  async downloadDocument(orderId: number, documentId: string): Promise<any> {
    return Repository.get(`${this.endpoint}/${orderId}/documents/${documentId}/download`, {
      responseType: 'arraybuffer',
    })
  }
}
