// Route definitions and configuration
export const ROUTES = {
  HOME: '/',
  STATISTICS: '/statistics',
  MODEL_3D: '/3d-model',
  SYSTEM_CONTROL: '/system-control',
  ALERTS: '/alerts',
  CAMERA_FEED: '/camera-feed',
  ASSET_INVENTORY: '/asset-inventory',
  ADMIN: '/admin',
  ADMIN_PERMISSIONS: '/admin/permissions',
} as const

// Page titles for browser tab updates
export const PAGE_TITLES = {
  [ROUTES.HOME]: 'Statistics - Twin MS',
  [ROUTES.STATISTICS]: 'Statistics - Twin MS',
  [ROUTES.MODEL_3D]: '3D Model Control - Twin MS',
  [ROUTES.SYSTEM_CONTROL]: 'System Control - Twin MS',
  [ROUTES.ALERTS]: 'Alerts & Maintenance - Twin MS',
  [ROUTES.CAMERA_FEED]: 'Camera Feed - Twin MS',
  [ROUTES.ASSET_INVENTORY]: 'Asset Inventory - Twin MS',
  [ROUTES.ADMIN_PERMISSIONS]: 'Permissions Management - Twin MS',
} as const

// Route to PageType mapping
export const ROUTE_TO_PAGE_TYPE = {
  [ROUTES.HOME]: 'statistics',
  [ROUTES.STATISTICS]: 'statistics',
  [ROUTES.MODEL_3D]: '3d-model',
  [ROUTES.SYSTEM_CONTROL]: 'system-control',
  [ROUTES.ALERTS]: 'alerts',
  [ROUTES.CAMERA_FEED]: 'camera-feed',
  [ROUTES.ASSET_INVENTORY]: 'asset-inventory',
  [ROUTES.ADMIN_PERMISSIONS]: 'permissions',
} as const

// PageType to Route mapping (for navigation)
export const PAGE_TYPE_TO_ROUTE = {
  statistics: ROUTES.STATISTICS,
  '3d-model': ROUTES.MODEL_3D,
  'system-control': ROUTES.SYSTEM_CONTROL,
  alerts: ROUTES.ALERTS,
  'camera-feed': ROUTES.CAMERA_FEED,
  'asset-inventory': ROUTES.ASSET_INVENTORY,
  permissions: ROUTES.ADMIN_PERMISSIONS,
} as const
