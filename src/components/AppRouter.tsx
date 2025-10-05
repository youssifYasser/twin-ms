import { Routes, Route, Navigate } from 'react-router-dom'
import Statistics from '@/pages/Statistics'
import Model3DControl from '@/pages/Model3DControl'
import SystemControl from '@/pages/SystemControl'
import AlertsMaintenance from '@/pages/AlertsMaintenance'
import CameraFeed from '@/pages/CameraFeed'
import Permissions from '@/pages/Permissions'
import AssetInventory from '@/pages/AssetInventory'
import NotFound from '@/pages/NotFound'
import { ROUTES } from '@/config/routes'

const AppRouter = () => {
  return (
    <Routes>
      {/* Home route - redirect to statistics */}
      <Route path={ROUTES.HOME} element={<Statistics />} />

      {/* Main pages */}
      <Route path={ROUTES.STATISTICS} element={<Statistics />} />
      <Route path={ROUTES.MODEL_3D} element={<Model3DControl />} />
      <Route path={ROUTES.SYSTEM_CONTROL} element={<SystemControl />} />
      <Route path={ROUTES.ALERTS} element={<AlertsMaintenance />} />
      <Route path={ROUTES.CAMERA_FEED} element={<CameraFeed />} />
      <Route path={ROUTES.ASSET_INVENTORY} element={<AssetInventory />} />

      {/* Admin routes */}
      <Route
        path={ROUTES.ADMIN}
        element={<Navigate to={ROUTES.HOME} replace />}
      />
      <Route path={ROUTES.ADMIN_PERMISSIONS} element={<Permissions />} />

      {/* 404 - Catch all unmatched routes */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
