import { AxiosRequestConfig } from 'axios'
import Repository from './Repository'

export default class HttpRepository {
  public endpoint: string
  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async create<T>(payload: Record<string, any>, options?: AxiosRequestConfig): Promise<T> {
    const { data } = await Repository.post<T>(this.endpoint, payload, options)
    return data
  }

  async getAll<T>(params: Record<string, any>): Promise<T> {
    const { data } = await Repository.get<T>(this.endpoint, { params: this.adaptParams(params) })
    return data
  }

  async get<T>(id: string, params?: Record<string, any>): Promise<T> {
    const { data } = await Repository.get<T>(`${this.endpoint}/${id}`, {
      params: this.adaptParams(params),
    })
    return data
  }

  async update<T>(id: string, payload: Record<string, any>): Promise<T> {
    const { data } = await Repository.put<T>(`${this.endpoint}/${id}`, payload)
    return data
  }

  async updateMany<T>(params: Record<string, any>, payload: Record<string, any>): Promise<T> {
    const { data } = await Repository.put<T>(this.endpoint, payload, { params })
    return data
  }

  async delete<T>(id: string): Promise<T> {
    const { data } = await Repository.delete<T>(`${this.endpoint}/${id}`)
    return data
  }

  async deleteMany<T>(params: Record<string, any>): Promise<T> {
    const { data } = await Repository.delete<T>(this.endpoint, { params })
    return data
  }

  adaptParams(params: Record<string, any> = {}): Record<string, any> | Record<string, never> {
    return Object.entries(params).reduce((acc, filter) => {
      const [key, value] = filter
      if (value || typeof value === 'boolean' || typeof value === 'number') {
        acc = { ...acc, [key]: value }
      }

      return acc
    }, {})
  }
}
