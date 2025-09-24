import React from 'react'
import { useWebSocket } from '@/context/WebSocketContext'

const WebSocketStatus: React.FC = () => {
  const { connectionState, isConnected, reconnectAttempts } = useWebSocket()

  const getStatusColor = () => {
    switch (connectionState) {
      case 'CONNECTED':
        return 'bg-green-500'
      case 'RECONNECTING':
        return 'bg-yellow-500'
      case 'DISCONNECTED':
      case 'ERROR':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = () => {
    switch (connectionState) {
      case 'CONNECTED':
        return 'Connected'
      case 'RECONNECTING':
        return `Reconnecting (${reconnectAttempts})`
      case 'DISCONNECTED':
        return 'Disconnected'
      case 'ERROR':
        return 'Connection Error'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className='flex items-center space-x-2 text-xs text-gray-300'>
      <div
        className={`w-2 h-2 rounded-full ${getStatusColor()} ${
          isConnected ? 'animate-pulse' : ''
        }`}
      />
      <span>WebSocket: {getStatusText()}</span>
    </div>
  )
}

export default WebSocketStatus
