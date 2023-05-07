export default {
  hasOneOfDeepProperty(obj: any, keys: string[]): boolean {
    let returnValue = false
    for (const key of keys) {
      if (this.hasDeepProperty(obj, key)) {
        returnValue = true
        break
      }
    }
    return returnValue
  },
  hasManyDeepProperty(obj: any, keys: string[]): boolean {
    let returnValue = true
    for (const key of keys) {
      if (!this.hasDeepProperty(obj, key)) {
        returnValue = false
        break
      }
    }
    return returnValue
  },
  hasDeepProperty(obj: any, key: string): boolean {
    // do recursive on each string separate by . So we can check if an object has a nested property (ex key: 'contacts.information.data')
    return key.split('.').every((x: any) => {
      if (typeof obj !== 'object' || obj === null || !obj[x]) {
        return false
      }
      obj = obj[x]
      return true
    })
  },
  getKeyFromValue(obj: Record<string, any>, value: string): string {
    const currentObj = Object.entries(obj).find(([_key, currentValue]) => value === currentValue)

    // return empty string if undefined
    return currentObj ? currentObj[0] : ''
  },
  objectsEqual(o1: Record<string, any>, o2: Record<string, any>): boolean {
    return typeof o1 === 'object' && Object.keys(o1).length > 0
      ? Object.keys(o1).length === Object.keys(o2).length &&
          Object.keys(o1).every(p => this.objectsEqual(o1[p], o2[p]))
      : o1 === o2
  },
  // obj1 && obj2 must have the same props
  hasAtLeastOneDifference(obj1: any, obj2: any): boolean {
    return Object.keys(obj1).every(key => {
      if (obj1 && obj2) {
        if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
          return obj1[key].length === obj2[key].length
        }

        if (obj1[key] && obj2[key] && typeof obj1[key] === 'object') {
          return Object.keys(obj1[key]).length === Object.keys((obj2 as any)[key]).length
        }

        // leave ==, null and undefined need to be equal
        return obj1[key] == (obj2 as any)[key]
      }
      return false
    })
  },
}
