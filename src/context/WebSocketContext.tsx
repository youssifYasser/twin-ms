// WebSocket Context Provider
// Manages WebSocket connection and integrates with the filter system

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import WebSocketService, {
  WebSocketMessage,
  WebSocketEventCallbacks,
} from '@/services/websocket'

interface WebSocketContextType {
  connectionState: string
  isConnected: boolean
  sendFilterUpdate: (floor: string, unit: string) => void
  sendConfirmation: (floor: string, unit: string) => void
  sendDeviceControl: (asset: string, status: string, value?: string) => void
  reconnectAttempts: number
  lastMessage: WebSocketMessage | null
}

interface WebSocketProviderProps {
  children: React.ReactNode
  url?: string
}

// WebSocket configuration
const WS_CONFIG = {
  url: 'wss://4b4f1621-81a5-4f2c-9f4c-b7064b5fce2e-00-4u2a0cmw6vx0.kirk.replit.dev/',
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 120000, // 2 minutes = 120,000 milliseconds
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
)

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  url = WS_CONFIG.url,
}) => {
  const [wsService] = useState(() => {
    console.log('[WebSocket Context] Creating new WebSocket service instance')
    return new WebSocketService({ ...WS_CONFIG, url })
  })
  const [connectionState, setConnectionState] = useState<string>('DISCONNECTED')
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)

  // WebSocket event callbacks
  const callbacks: WebSocketEventCallbacks = {
    onOpen: () => {
      console.log('[WebSocket Context] Connection established')
      setConnectionState('CONNECTED')
      setIsConnected(true)
      setReconnectAttempts(0)
    },

    onClose: (event) => {
      console.log('[WebSocket Context] Connection closed', event.code)
      setConnectionState('DISCONNECTED')
      setIsConnected(false)
    },

    onError: (error) => {
      console.error('[WebSocket Context] Connection error:', error)
      setConnectionState('ERROR')
      setIsConnected(false)
    },

    onMessage: (message) => {
      if (message.origin === 'server') {
        setLastMessage(message)
        console.log('Received floor:', message.floor, 'unit:', message.unit)
      }

      // Here you can add logic to handle incoming filter updates
      // For example, updating the UI based on server messages
    },

    onReconnecting: (attempt) => {
      console.log(`[WebSocket Context] Reconnecting... attempt ${attempt}`)
      setConnectionState('RECONNECTING')
      setReconnectAttempts(attempt)
    },
  }

  // Initialize WebSocket connection
  useEffect(() => {
    wsService.on(callbacks)

    // Connect on mount
    wsService.connect().catch((error) => {
      console.error('[WebSocket Context] Initial connection failed:', error)
      setConnectionState('ERROR')
    })

    // Update connection state periodically
    const stateUpdateInterval = setInterval(() => {
      const currentState = wsService.getConnectionState()
      setConnectionState(currentState)
      setIsConnected(wsService.isConnected())
    }, 1000)

    // Cleanup on unmount
    return () => {
      clearInterval(stateUpdateInterval)
      wsService.disconnect()
    }
  }, [])

  // Send filter update function
  const sendFilterUpdate = useCallback(
    (floor: string, unit: string) => {
      console.log(
        `[WebSocket Context] Sending filter update: floor=${floor}, unit=${unit}`
      )
      wsService.sendFilterUpdate(floor, unit)
    },
    [wsService]
  )

  // Send confirmation function
  const sendConfirmation = useCallback(
    (floor: string, unit: string) => {
      console.log(
        `[WebSocket Context] Sending confirmation: floor=${floor}, unit=${unit}`
      )
      wsService.sendConfirmation(floor, unit)
    },
    [wsService]
  )

  // Send device control function
  const sendDeviceControl = useCallback(
    (asset: string, status: string, value?: string) => {
      console.log(
        `[WebSocket Context] Sending device control: asset=${asset}, status=${status}, value=${value}`
      )
      wsService.sendDeviceControl(asset, status, value)
    },
    [wsService]
  )

  const contextValue: WebSocketContextType = {
    connectionState,
    isConnected,
    sendFilterUpdate,
    sendConfirmation,
    sendDeviceControl,
    reconnectAttempts,
    lastMessage,
  }

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  )
}

// Custom hook to use WebSocket context
export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}

export default WebSocketProvider
