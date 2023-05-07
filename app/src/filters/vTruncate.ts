import Vue from 'vue'

export default Vue.filter('truncate', (text = '', length = 30, clamp = '...') => {
  if (text.length <= length) {
    return text
  }

  let truncated = text.slice(0, length - clamp.length)
  let last = truncated.length - 1

  while (last > 0 && truncated[last] !== ' ') {
    last -= 1
  }

  // In case text has no space
  last = last || length - clamp.length
  truncated = truncated.slice(0, last)

  return `${truncated}${clamp}`
})
