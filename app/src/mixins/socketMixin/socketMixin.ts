import { LOCAL_STORAGE } from '@/constants'
import Vue from 'vue'
import { SocketMixinMethods } from './socketMixin.type'

export default Vue.extend({
  methods: {
    connectSocket() {
      const access_token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN)

      if (!access_token) {
        return
      }

      this.$socket.client.auth = { token: access_token }
      this.$socket.client.connect()
    },
    disconnectSocket() {
      this.$socket.client.disconnect()
    },
    socketEmit(eventName: string, payload?: Record<string, any>): void {
      if (payload) {
        this.$socket.client.emit(eventName, payload)
        return
      }
      this.$socket.client.emit(eventName)
    },
  } as SocketMixinMethods,
})
