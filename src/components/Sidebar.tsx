import { PageType } from '@/App'
import Logo from '@/components/Logo'
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import {
  StatisticsIcon,
  AlertsMaintenanceIcon,
  ModelControlIcon,
  CameraIcon,
  SystemIcon,
  SidebarArrowsIcon,
} from '@/icons'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  currentPage: PageType
  onPageChange: (page: PageType) => void
}

const Sidebar = ({
  isOpen,
  currentPage,
  onPageChange,
  onToggle,
}: SidebarProps) => {
  const [isAdminExpanded, setIsAdminExpanded] = useState(false)

  const menuItems = [
    { id: 'statistics', label: 'Statistics', icon: StatisticsIcon },
    // { id: '3d-model', label: '3D Model Control', icon: ModelControlIcon },
    { id: 'system-control', label: 'System Control', icon: SystemIcon },
    {
      id: 'alerts',
      label: 'Alerts & Maintenance',
      icon: AlertsMaintenanceIcon,
    },
    { id: 'camera-feed', label: 'Camera Feed', icon: CameraIcon },
  ] as const

  const adminItems = [
    { id: 'permissions', label: 'Permissions', icon: 'ri-shield-user-line' },
    {
      id: 'asset-inventory',
      label: 'Asset Inventory',
      icon: 'ri-archive-line',
    },
  ] as const

  const isAdminPageActive =
    currentPage === 'permissions' || currentPage === 'asset-inventory'

  // Auto-expand admin panel when one of its pages is active
  const shouldExpandAdmin = isAdminExpanded || isAdminPageActive

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen transition-transform duration-400 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className='flex h-full w-64 flex-col bg-sidebar-gradient border-r border-primary-border backdrop-blur-24'>
        {/* Logo */}
        <div className='flex items-center justify-between p-6'>
          <div className='flex items-center '>
            <div className='flex items-center'>
              <Logo className='h-8' width={120} height={32} />
            </div>
          </div>
          <SidebarArrowsIcon
            width={22}
            height={22}
            className={`cursor-pointer ${isOpen ? '' : 'hover:rotate-180'}`}
            onClick={onToggle}
          />
        </div>

        {/* Navigation Menu */}
        <nav className='flex-1 p-6'>
          <ul className='space-y-2'>
            {menuItems.map((item) => {
              const IconComponent = item.icon
              const isActive = currentPage === item.id

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onPageChange(item.id as PageType)
                      onToggle()
                    }}
                    className='w-full flex items-center p-3 text-left rounded-lg transition-all duration-200 group'
                  >
                    <IconComponent
                      fill={isActive ? 'rgba(59, 160, 145, 1)' : 'white'}
                      className='mr-3 h-5 w-5 transition-colors'
                    />
                    <span
                      className={`font-inter text-sm transition-colors ${
                        isActive
                          ? 'text-active-page font-semibold'
                          : 'text-white font-medium'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              )
            })}

            {/* Admin Panel with Sub-items */}
            <li>
              <button
                onClick={() => setIsAdminExpanded(!isAdminExpanded)}
                className={`w-full flex items-center justify-between p-3 text-left rounded-lg transition-all duration-200 group hover:bg-slate-700/50 ${
                  isAdminPageActive || shouldExpandAdmin
                    ? 'bg-slate-700/30'
                    : ''
                }`}
              >
                <div className='flex items-center'>
                  <i
                    className={`ri-admin-line mr-3 text-lg transition-all duration-200 ${
                      isAdminPageActive
                        ? 'text-active-page'
                        : 'text-white group-hover:text-active-page'
                    } ${shouldExpandAdmin ? 'transform scale-110' : ''}`}
                  />
                  <span
                    className={`font-inter text-sm transition-colors ${
                      isAdminPageActive
                        ? 'text-active-page font-semibold'
                        : 'text-white font-medium group-hover:text-active-page'
                    }`}
                  >
                    Admin Panel
                  </span>
                </div>
                <div className='transition-transform duration-300 ease-in-out'>
                  {shouldExpandAdmin ? (
                    <ChevronDown className='w-4 h-4 text-white' />
                  ) : (
                    <ChevronRight className='w-4 h-4 text-white' />
                  )}
                </div>
              </button>

              {/* Sub-menu items */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  shouldExpandAdmin
                    ? 'max-h-96 opacity-100 mt-2'
                    : 'max-h-0 opacity-0 mt-0'
                }`}
              >
                <div className='ml-6 bg-slate-700/30 rounded-lg p-2 backdrop-blur-sm border border-slate-600/20 shadow-lg'>
                  <ul className='space-y-1'>
                    {adminItems.map((item, index) => {
                      const isSubActive = currentPage === item.id

                      return (
                        <li
                          key={item.id}
                          className={`transform transition-all duration-200 ease-out ${
                            shouldExpandAdmin
                              ? 'translate-x-0 opacity-100'
                              : '-translate-x-2 opacity-0'
                          }`}
                          style={{
                            transitionDelay: shouldExpandAdmin
                              ? `${index * 50}ms`
                              : '0ms',
                          }}
                        >
                          <button
                            onClick={() => {
                              onPageChange(item.id as PageType)
                              onToggle()
                            }}
                            className={`w-full flex items-center p-2 text-left rounded-lg transition-all duration-200 group hover:bg-slate-600/50 ${
                              isSubActive ? 'bg-slate-600/70' : ''
                            }`}
                          >
                            <i
                              className={`${
                                item.icon
                              } mr-3 text-base transition-colors ${
                                isSubActive
                                  ? 'text-active-page'
                                  : 'text-slate-300 group-hover:text-white'
                              }`}
                            />
                            <span
                              className={`font-inter text-sm transition-colors ${
                                isSubActive
                                  ? 'text-active-page font-semibold'
                                  : 'text-slate-300 font-medium group-hover:text-white'
                              }`}
                            >
                              {item.label}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
