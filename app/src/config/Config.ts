import axios from 'axios'

class Config {
  private values: Map<string, string>

  constructor() {
    this.values = new Map()
  }

  async load() {
    const response = await axios.get('/conf.json')
    this.values = new Map(Object.entries(response.data))
  }

  get(key: string, defaultValue = ''): string {
    return this.values.get(key) || defaultValue
  }
}

export default new Config()
