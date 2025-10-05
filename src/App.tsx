import { useCallback } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Layout from '@/components/Layout'
import AppRouter from '@/components/AppRouter'
import AssetPopup from '@/components/AssetPopup'
import { FilterProvider } from '@/context/FilterContext'
import { WebSocketProvider } from '@/context/WebSocketContext'
import { RealtimeDataProvider } from '@/context/RealtimeDataContext'
import {
  AssetPopupProvider,
  useAssetPopup,
  AssetClickMessage,
} from '@/context/AssetPopupContext'
import { getAssetDataFromClick } from '@/services/assetDataService'

export type PageType =
  | 'statistics'
  | '3d-model'
  | 'system-control'
  | 'alerts'
  | 'camera-feed'
  | 'permissions'
  | 'asset-inventory'

// Inner app component that has access to contexts
const AppContent = () => {
  const { showAssetPopup, isVisible, currentAsset, hideAssetPopup } =
    useAssetPopup()

  // Handle asset click from WebSocket
  const handleAssetClick = useCallback(
    (clickMessage: AssetClickMessage) => {
      console.log('[App] Handling asset click:', clickMessage)

      // Get asset data from real device data
      const assetData = getAssetDataFromClick(clickMessage)

      if (assetData) {
        console.log('[App] Showing asset popup for:', assetData.name)
        showAssetPopup(assetData)
      } else {
        console.warn('[App] Failed to get asset data for click:', clickMessage)
      }
    },
    [showAssetPopup]
  )

  return (
    <BrowserRouter>
      <WebSocketProvider onAssetClick={handleAssetClick}>
        <RealtimeDataProvider>
          <FilterProvider>
            <Layout>
              <AppRouter />
            </Layout>

            {/* Asset Popup */}
            {isVisible && currentAsset && (
              <AssetPopup
                asset={currentAsset}
                isVisible={isVisible}
                onClose={hideAssetPopup}
              />
            )}
          </FilterProvider>
        </RealtimeDataProvider>
      </WebSocketProvider>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AssetPopupProvider>
      <AppContent />
    </AssetPopupProvider>
  )
}

export default App
