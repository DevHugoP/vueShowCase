import VueSocketIOExt from 'vue-socket.io-extended'

export interface SocketMixinMethods {
  connectSocket: (this: SocketMixin) => void
  disconnectSocket: (this: SocketMixin) => void
  socketEmit: (this: SocketMixin, eventName: string, payload?: Record<string, any>) => void
}

export type SocketMixin = Vue & VueSocketIOExt & SocketMixinMethods
