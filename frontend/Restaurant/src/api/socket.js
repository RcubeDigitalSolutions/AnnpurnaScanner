import { io } from 'socket.io-client'

let socketInstance = null

const getSocketBaseUrl = () => {
  const envSocketUrl = import.meta.env.VITE_SOCKET_URL
  if (envSocketUrl) return envSocketUrl

  const envApiUrl = import.meta.env.VITE_API_URL
  if (envApiUrl && /^https?:\/\//i.test(envApiUrl)) {
    return envApiUrl.replace(/\/api\/?$/i, '')
  }

  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:5000`
  }

  return 'http://localhost:5000'
}

export const getSocket = () => {
  if (socketInstance) return socketInstance

  socketInstance = io(getSocketBaseUrl(), {
    transports: ['websocket', 'polling'],
    withCredentials: true,
  })

  return socketInstance
}
