import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PAGE_TITLES } from '@/config/routes'

// Hook to update page title based on current route
export const usePageTitle = () => {
  const location = useLocation()

  useEffect(() => {
    const currentPath = location.pathname as keyof typeof PAGE_TITLES
    const title = PAGE_TITLES[currentPath] || 'Twin MS'

    document.title = title
  }, [location.pathname])
}

// Hook to get current page type from route
export const useCurrentPageType = () => {
  const location = useLocation()

  // Map pathname to page type
  const getPageTypeFromPath = (pathname: string) => {
    switch (pathname) {
      case '/':
      case '/statistics':
        return 'statistics'
      case '/3d-model':
        return '3d-model'
      case '/system-control':
        return 'system-control'
      case '/alerts':
        return 'alerts'
      case '/camera-feed':
        return 'camera-feed'
      case '/asset-inventory':
        return 'asset-inventory'
      case '/admin/permissions':
        return 'permissions'
      default:
        return 'statistics'
    }
  }

  return getPageTypeFromPath(location.pathname)
}
