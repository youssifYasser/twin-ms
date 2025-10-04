import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'

// Types for asset popup system
export type AssetType = 'light' | 'hvac' | 'pump'

export interface AssetClickMessage {
  click: AssetType
  floor: string
  unit: string
}

export interface AssetData {
  id: string
  name: string
  type: AssetType
  status: 'operational' | 'warning' | 'error' | 'offline'
  location: string
  specifications: {
    [key: string]: string | number
  }
  metrics: {
    [key: string]: {
      value: string | number
      unit?: string
      icon?: string
      color?: string
    }
  }
  dimmerLevel?: number
}

interface AssetPopupContextType {
  isVisible: boolean
  currentAsset: AssetData | null
  showAssetPopup: (assetData: AssetData) => void
  hideAssetPopup: () => void
}

interface AssetPopupProviderProps {
  children: ReactNode
}

// Create context
const AssetPopupContext = createContext<AssetPopupContextType | undefined>(
  undefined
)

// Provider component
export const AssetPopupProvider: React.FC<AssetPopupProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [currentAsset, setCurrentAsset] = useState<AssetData | null>(null)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  // Show asset popup with 10-second auto-hide
  const showAssetPopup = useCallback(
    (assetData: AssetData) => {
      // Clear existing timeout if popup is already showing
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // Set new asset data and show popup
      setCurrentAsset(assetData)
      setIsVisible(true)

      // Set 10-second auto-hide timeout
      const newTimeoutId = setTimeout(() => {
        setIsVisible(false)
        setCurrentAsset(null)
        setTimeoutId(null)
      }, 100000) // 100 seconds just for testing

      setTimeoutId(newTimeoutId)
    },
    [timeoutId]
  )

  // Hide asset popup manually
  const hideAssetPopup = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
    setCurrentAsset(null)
  }, [timeoutId])

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        hideAssetPopup()
      }
    }

    if (isVisible) {
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isVisible, hideAssetPopup])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  const contextValue: AssetPopupContextType = {
    isVisible,
    currentAsset,
    showAssetPopup,
    hideAssetPopup,
  }

  return (
    <AssetPopupContext.Provider value={contextValue}>
      {children}
    </AssetPopupContext.Provider>
  )
}

// Custom hook to use the asset popup context
export const useAssetPopup = (): AssetPopupContextType => {
  const context = useContext(AssetPopupContext)
  if (context === undefined) {
    throw new Error('useAssetPopup must be used within an AssetPopupProvider')
  }
  return context
}

export default AssetPopupContext
