import { useState, useCallback } from 'react'
import Layout from '@/components/Layout'
import Statistics from '@/pages/Statistics'
import Model3DControl from '@/pages/Model3DControl'
import SystemControl from '@/pages/SystemControl'
import AlertsMaintenance from '@/pages/AlertsMaintenance'
import CameraFeed from '@/pages/CameraFeed'
import Permissions from '@/pages/Permissions'
import AssetInventory from '@/pages/AssetInventory'
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
  const [currentPage, setCurrentPage] = useState<PageType>('statistics')
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

  const renderPage = () => {
    switch (currentPage) {
      case 'statistics':
        return <Statistics />
      case '3d-model':
        return <Model3DControl />
      case 'system-control':
        return <SystemControl />
      case 'alerts':
        return <AlertsMaintenance />
      case 'camera-feed':
        return <CameraFeed />
      case 'permissions':
        return <Permissions />
      case 'asset-inventory':
        return <AssetInventory />
      default:
        return <Statistics />
    }
  }

  return (
    <WebSocketProvider onAssetClick={handleAssetClick}>
      <RealtimeDataProvider>
        <FilterProvider>
          <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
            {renderPage()}
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
