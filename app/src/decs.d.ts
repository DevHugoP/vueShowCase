export {}

declare global {
  interface Window {
    popStateDetected: boolean
    AttachmentUtils: {
      toBase64(file: File): Promise<any>
      isDataURI(url: string): boolean
      isDataURIWithoutBase64Marker(url: string): boolean
      dataURItoFile(dataURI: string): File | false
    }
  }
}
