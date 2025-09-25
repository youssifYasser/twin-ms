// WebSocket Service for real-time communication
// Provides a clean interface for WebSocket operations with automatic reconnection

export interface WebSocketMessage {
  floor: string
  unit: string
  timestamp?: number
  messageId?: string
  origin?: 'client' | 'server'
}

export interface WebSocketConfig {
  url: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
}

export type WebSocketEventType =
  | 'open'
  | 'close'
  | 'error'
  | 'message'
  | 'reconnecting'

export interface WebSocketEventCallbacks {
  onOpen?: () => void
  onClose?: (event: CloseEvent) => void
  onError?: (error: Event) => void
  onMessage?: (message: WebSocketMessage) => void
  onReconnecting?: (attempt: number) => void
}

class WebSocketService {
  private ws: WebSocket | null = null
  private config: Required<WebSocketConfig>
  private callbacks: WebSocketEventCallbacks = {}
  private reconnectAttempts = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private isManualClose = false
  private connectionPromise: Promise<void> | null = null

  constructor(config: WebSocketConfig) {
    this.config = {
      url: config.url,
      reconnectInterval: config.reconnectInterval || 5000,
      maxReconnectAttempts: config.maxReconnectAttempts || 5,
      heartbeatInterval: config.heartbeatInterval || 30000,
    }
  }

  /**
   * Initialize WebSocket connection
   */
  async connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        this.isManualClose = false
        this.ws = new WebSocket(this.config.url)

        this.ws.onopen = () => {
          console.log('[WebSocket] Connected to server')
          this.reconnectAttempts = 0
          this.startHeartbeat()
          this.callbacks.onOpen?.()
          resolve()
        }

        this.ws.onclose = (event) => {
          console.log('[WebSocket] Connection closed', event.code, event.reason)
          this.cleanup()
          this.callbacks.onClose?.(event)

          if (!this.isManualClose) {
            this.scheduleReconnect()
          }
        }

        this.ws.onerror = (error) => {
          console.error('[WebSocket] Connection error:', error)
          this.callbacks.onError?.(error)
          reject(error)
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            console.log('[WebSocket] Message received:', message)
            if (message.floor && message.unit) {
              this.callbacks.onMessage?.({
                floor: message.floor,
                unit: message.unit,
              })
            }
            this.callbacks.onMessage?.(message)
          } catch (error) {
            console.error(
              '[WebSocket] Failed to parse message:',
              event.data,
              error
            )
          }
        }
      } catch (error) {
        console.error('[WebSocket] Failed to create connection:', error)
        reject(error)
      }
    })

    return this.connectionPromise
  }

  /**
   * Send a filter message to the server
   */
  sendFilterUpdate(floor: string, unit: string): void {
    if (!this.isConnected()) {
      console.warn('[WebSocket] Cannot send message - not connected')
      return
    }

    const message = {
      floor,
      unit,
      origin: 'client',
    }

    try {
      this.ws!.send(JSON.stringify(message))
      console.log('[WebSocket] Filter update sent:', message)
    } catch (error) {
      console.error('[WebSocket] Failed to send message:', error)
    }
  }

  /**
   * Send a simple confirmation message to the server
   */
  sendConfirmation(floor: string, unit: string): void {
    if (!this.isConnected()) {
      console.warn('[WebSocket] Cannot send confirmation - not connected')
      return
    }

    const confirmationText = `Floor ${floor} Unit ${unit} Received`

    try {
      this.ws!.send(confirmationText)
      console.log('[WebSocket] Confirmation sent:', confirmationText)
    } catch (error) {
      console.error('[WebSocket] Failed to send confirmation:', error)
    }
  }

  /**
   * Send a device control message to the server
   */
  sendDeviceControl(asset: string, status: string, value?: string): void {
    if (!this.isConnected()) {
      console.warn('[WebSocket] Cannot send device control - not connected')
      return
    }

    const message: any = {
      asset,
      status,
    }

    // Add value only if provided (for lighting and hvac)
    if (value !== undefined) {
      message.value = value
    }

    try {
      this.ws!.send(JSON.stringify(message))
      console.log('[WebSocket] Device control sent:', message)
    } catch (error) {
      console.error('[WebSocket] Failed to send device control:', error)
    }
  }

  /**
   * Register event callbacks
   */
  on(callbacks: WebSocketEventCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  /**
   * Get current connection state
   */
  getConnectionState(): string {
    if (!this.ws) return 'DISCONNECTED'

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING'
      case WebSocket.OPEN:
        return 'CONNECTED'
      case WebSocket.CLOSING:
        return 'CLOSING'
      case WebSocket.CLOSED:
        return 'DISCONNECTED'
      default:
        return 'UNKNOWN'
    }
  }

  /**
   * Manually close the connection
   */
  disconnect(): void {
    this.isManualClose = true
    this.cleanup()

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect')
      this.ws = null
    }

    this.connectionPromise = null
    console.log('[WebSocket] Disconnected manually')
  }

  /**
   * Clean up timers and resources
   */
  private cleanup(): void {
    if (this.heartbeatTimer) {
      console.log('[WebSocket] Clearing heartbeat timer')
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }

    if (this.reconnectTimer) {
      console.log('[WebSocket] Clearing reconnect timer')
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  /**
   * Start heartbeat mechanism
   */
  private startHeartbeat(): void {
    // Clear any existing heartbeat timer first
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }

    console.log(
      `[WebSocket] Starting heartbeat with ${this.config.heartbeatInterval}ms interval`
    )

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        // Send ping message to keep connection alive
        try {
          const pingMessage = { type: 'ping', timestamp: Date.now() }
          this.ws!.send(JSON.stringify(pingMessage))
          console.log('[WebSocket] Ping sent:', pingMessage.timestamp)
        } catch (error) {
          console.error('[WebSocket] Heartbeat failed:', error)
        }
      }
    }, this.config.heartbeatInterval)
  }

  /**
   * Schedule automatic reconnection
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    console.log(
      `[WebSocket] Scheduling reconnection attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}`
    )

    this.callbacks.onReconnecting?.(this.reconnectAttempts)

    this.reconnectTimer = setTimeout(() => {
      this.connectionPromise = null
      this.connect().catch((error) => {
        console.error('[WebSocket] Reconnection failed:', error)
      })
    }, this.config.reconnectInterval)
  }
}

export default WebSocketService
