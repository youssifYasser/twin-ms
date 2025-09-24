import { useState } from 'react'
import Layout from '@/components/Layout'
import Statistics from '@/pages/Statistics'
import Model3DControl from '@/pages/Model3DControl'
import SystemControl from '@/pages/SystemControl'
import AlertsMaintenance from '@/pages/AlertsMaintenance'
import CameraFeed from '@/pages/CameraFeed'
import { FilterProvider } from '@/context/FilterContext'
import { WebSocketProvider } from '@/context/WebSocketContext'

export type PageType =
  | 'statistics'
  | '3d-model'
  | 'system-control'
  | 'alerts'
  | 'camera-feed'

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('statistics')

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
      default:
        return <Statistics />
    }
  }

  return (
    <WebSocketProvider>
      <FilterProvider>
        <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
          {renderPage()}
        </Layout>
      </FilterProvider>
    </WebSocketProvider>
  )
}

export default App
