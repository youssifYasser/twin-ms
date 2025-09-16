import { PageType } from '@/App'
import Logo from '@/components/Logo'
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
  const menuItems = [
    { id: 'statistics', label: 'Statistics', icon: StatisticsIcon },
    { id: '3d-model', label: '3D Model Control', icon: ModelControlIcon },
    { id: 'system-control', label: 'System Control', icon: SystemIcon },
    {
      id: 'alerts',
      label: 'Alerts & Maintenance',
      icon: AlertsMaintenanceIcon,
    },
    { id: 'camera-feed', label: 'Camera Feed', icon: CameraIcon },
  ] as const

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen transition-transform duration-400 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className='flex h-full w-64 flex-col bg-sidebar-gradient border-r border-primary-border backdrop-blur-24'>
        {/* Logo and System Name */}
        <div className='flex items-center justify-between p-6'>
          <div className='flex items-center '>
            <div className='flex items-center space-x-3'>
              <Logo className='w-8 h-8' width={32} height={32} />
              <h1 className='text-xl font-bold font-ibm-plex text-white'>
                Twin MS
              </h1>
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
                    onClick={() => onPageChange(item.id as PageType)}
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
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
