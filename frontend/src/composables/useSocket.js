import { io } from 'socket.io-client'
import { ref } from 'vue'

const socket = ref(null)

export function useSocket() {
  const connect = () => {
    if (!socket.value) {
      socket.value = io('http://localhost:8080')
      
      socket.value.on('connect', () => {
        console.log('Socket connected')
      })
      
      socket.value.on('disconnect', () => {
        console.log('Socket disconnected')
      })
    }
    return socket.value
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
  }

  const on = (event, callback) => {
    if (socket.value) {
      socket.value.on(event, callback)
    }
  }

  const off = (event, callback) => {
    if (socket.value) {
      socket.value.off(event, callback)
    }
  }

  return {
    socket,
    connect,
    disconnect,
    on,
    off
  }
}

export default useSocket
