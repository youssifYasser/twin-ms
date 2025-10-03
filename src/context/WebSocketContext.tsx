// WebSocket Context Provider
// Manages WebSocket connection and integrates with the filter system

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react'
import WebSocketService, {
  WebSocketMessage,
  WebSocketEventCallbacks,
} from '@/services/websocket'
import { updateUnit501Occupancy } from '@/data/statisticsData'

interface WebSocketContextType {
  connectionState: string
  isConnected: boolean
  sendFilterUpdate: (floor: string, unit: string) => void
  sendConfirmation: (floor: string, unit: string) => void
  sendDeviceControl: (asset: string, status: string, value?: string) => void
  reconnectAttempts: number
  lastMessage: WebSocketMessage | null
  unit501Occupancy: number
}

interface WebSocketProviderProps {
  children: React.ReactNode
  url?: string
}

// WebSocket configuration
const WS_CONFIG = {
  url: 'wss://4b4f1621-81a5-4f2c-9f4c-b7064b5fce2e-00-4u2a0cmw6vx0.kirk.replit.dev/',
  // url: 'ws://localhost:5000',
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
  const [lastSentMessage, setLastSentMessage] =
    useState<WebSocketMessage | null>(null)
  const [unit501Occupancy, setUnit501Occupancy] = useState<number>(0)

  // Add ref to track last occupancy update to prevent rapid toggling
  const lastOccupancyUpdateRef = useRef<number>(0)

  // WebSocket event callbacks with useCallback to prevent re-registration
  const onOpen = useCallback(() => {
    console.log('[WebSocket Context] Connection established')
    setConnectionState('CONNECTED')
    setIsConnected(true)
    setReconnectAttempts(0)
  }, [])

  const onClose = useCallback((event: CloseEvent) => {
    console.log('[WebSocket Context] Connection closed', event.code)
    setConnectionState('DISCONNECTED')
    setIsConnected(false)
  }, [])

  const onError = useCallback((error: Event) => {
    console.error('[WebSocket Context] Connection error:', error)
    setConnectionState('ERROR')
    setIsConnected(false)
  }, [])

  const onMessage = useCallback(
    (message: WebSocketMessage) => {
      console.log(
        '[WebSocket Context] Processing message:',
        JSON.stringify(message)
      )

      // Handle occupancy messages for Unit 501 separately
      if (message.occupancy && message.occupancy === '1') {
        // Debounce occupancy updates to prevent rapid toggling
        const now = Date.now()
        if (now - lastOccupancyUpdateRef.current < 1000) {
          console.log('[WebSocket Context] Ignoring rapid occupancy update')
          return
        }
        lastOccupancyUpdateRef.current = now

        console.log(
          '[WebSocket Context] Occupancy message received for Unit 501'
        )
        const newOccupancy = updateUnit501Occupancy()
        setUnit501Occupancy(newOccupancy)
        console.log(
          `[WebSocket Context] Unit 501 occupancy updated to: ${newOccupancy}`
        )
        return // Don't process as filter message
      }

      // Handle filter messages (only if they have floor and unit)
      if (message.floor && message.unit) {
        setLastMessage((prevLastMessage) => {
          // Check for duplicates using previous state
          if (
            prevLastMessage &&
            prevLastMessage.floor === message.floor &&
            prevLastMessage.unit === message.unit &&
            prevLastMessage.origin === message.origin
          ) {
            console.log('[WebSocket Context] Ignoring duplicate filter message')
            return prevLastMessage // Don't update if duplicate
          }
          console.log('Received floor:', message.floor, 'unit:', message.unit)
          return message // Update with new message
        })
      }

      // Here you can add logic to handle incoming filter updates
      // For example, updating the UI based on server messages
    },
    [] // Remove lastMessage dependency to prevent callback recreation
  )

  const onReconnecting = useCallback((attempt: number) => {
    console.log(`[WebSocket Context] Reconnecting... attempt ${attempt}`)
    setConnectionState('RECONNECTING')
    setReconnectAttempts(attempt)
  }, [])

  const callbacks: WebSocketEventCallbacks = {
    onOpen,
    onClose,
    onError,
    onMessage,
    onReconnecting,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsService]) // Only depend on wsService, callbacks are stable with useCallback

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
      if (
        lastSentMessage &&
        lastSentMessage.floor === floor &&
        lastSentMessage.unit === unit
      ) {
        console.log('[WebSocket Context] Duplicate confirmation ignored')
        return // Ignore duplicate confirmations
      }
      setLastSentMessage({ floor, unit, origin: 'client' })
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
    unit501Occupancy,
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
