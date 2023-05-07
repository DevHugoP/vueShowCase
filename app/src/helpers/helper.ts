export function wait(ms: number): any {
  return new Promise(res => setTimeout(res, ms))
}

window.AttachmentUtils = (() => {
  const BASE64_MARKER = ';base64,'

  return {
    // Does the given URL (string) look like a base64-encoded URL?
    // data:image/gif;base64,R0lGODlhyAAiALM...DfD0QAADs
    isDataURI(url: string) {
      return url.split(BASE64_MARKER).length === 2
    },

    isDataURIWithoutBase64Marker(url: string) {
      const BASE64_ENCODE_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gim
      return BASE64_ENCODE_REGEX.test(url)
    },

    async toBase64(file: File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },

    // Converts a data URI string into a File object.
    dataURItoFile(dataURI: string) {
      if (window.AttachmentUtils.isDataURIWithoutBase64Marker(dataURI)) {
        dataURI = `data:image/jpg;base64,${dataURI}`
      }

      if (!window.AttachmentUtils.isDataURI(dataURI)) {
        return false
      }

      // Format of a base64-encoded URL:
      // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAAEOCAIAAAAPH1dAAAAK
      const mime = dataURI.split(BASE64_MARKER)[0].split(':')[1]
      const filename = `dataURI-file-${new Date().getTime()}.${mime.split('/')[1]}`
      const bytes = atob(dataURI.split(BASE64_MARKER)[1])
      const writer = new Uint8Array(new ArrayBuffer(bytes.length))

      for (let i = 0; i < bytes.length; i++) {
        writer[i] = bytes.charCodeAt(i)
      }

      return new File([writer.buffer], filename, { type: mime })
    },
  }
})()
