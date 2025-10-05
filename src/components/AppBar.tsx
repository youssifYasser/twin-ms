import { PageType } from '@/App'
import Logo from '@/components/Logo'
import { RealtimeIcon } from '@/icons'
import FloorUnitFilter from '@/components/FloorUnitFilter'
import PageStats from '@/components/PageStats'
import GlobalSearch from '@/components/GlobalSearch'
import { useRealtimeData } from '@/context/RealtimeDataContext'
import { MenuIcon, ChevronDownIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface AppBarProps {
  currentPage: PageType
  showLogo: boolean
  toggleSidebar: () => void
}

const AppBar = ({ currentPage, showLogo, toggleSidebar }: AppBarProps) => {
  const { isRealtimeEnabled, toggleRealtime, timePeriod, setTimePeriod } =
    useRealtimeData()
  const [showTimePeriodDropdown, setShowTimePeriodDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowTimePeriodDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const timePeriodOptions = ['1 Week', '1 Month', '1 Year']

  const getPageTitle = (page: PageType): string => {
    switch (page) {
      case 'statistics':
        return 'Statistics'
      case '3d-model':
        return '3D Model Control'
      case 'system-control':
        return 'System Control'
      case 'alerts':
        return 'Alerts & Maintenance'
      case 'camera-feed':
        return 'Camera Feed'
      case 'permissions':
        return 'Permissions Management'
      case 'asset-inventory':
        return 'Asset Inventory'
      default:
        return 'Dashboard'
    }
  }

  return (
    <header className='bg-appbar-gradient border-b border-primary-border backdrop-blur-24 shadow-appbar z-50'>
      <div className='flex items-center justify-between px-6 py-4 shadow-lg'>
        <div className='flex items-center space-x-4'>
          {showLogo && (
            <div className='flex items-center '>
              <MenuIcon
                className='mr-4 cursor-pointer active:scale-90 transition-transform duration-200'
                onClick={toggleSidebar}
              />
              <Logo className='h-6 mr-4' width={90} height={24} />
              <div className='w-px h-6 bg-primary-border mr-4' />
            </div>
          )}
          <h2 className='text-2xl font-bold font-roboto text-white'>
            {getPageTitle(currentPage)}
          </h2>
        </div>

        <div className='flex items-center space-x-4'>
          {/* Real-time Data Toggle */}
          <div className='flex items-center gap-0'>
            <button
              className={`flex items-center px-4 py-2 text-sm font-roboto transition-all duration-200 ${
                isRealtimeEnabled
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg rounded-lg'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500 rounded-s-lg'
              }`}
              onClick={toggleRealtime}
              title={
                isRealtimeEnabled
                  ? 'Disable Real-time Data'
                  : 'Enable Real-time Data'
              }
            >
              <RealtimeIcon
                className={`mr-2 ${isRealtimeEnabled ? 'animate-pulse' : ''}`}
              />
              <span>Live Data</span>
            </button>

            {/* Time Period Dropdown - Only show on Statistics page when real-time is disabled */}
            {!isRealtimeEnabled && (
              <div className='relative' ref={dropdownRef}>
                <button
                  onClick={() =>
                    setShowTimePeriodDropdown(!showTimePeriodDropdown)
                  }
                  className='flex items-center gap-2 px-3 py-2 text-sm font-roboto bg-gray-600 text-gray-300 hover:bg-gray-500 rounded-e-lg transition-colors duration-200'
                >
                  <span>{timePeriod}</span>
                  <ChevronDownIcon className='w-4 h-4' />
                </button>

                {/* Dropdown Menu */}
                {showTimePeriodDropdown && (
                  <div className='absolute top-full mt-1 right-0 bg-[#1F2937] border border-[#374151] rounded-lg shadow-lg z-50 min-w-[120px]'>
                    {timePeriodOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setTimePeriod(option)
                          setShowTimePeriodDropdown(false)
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-[#374151] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          timePeriod === option
                            ? 'bg-[#3BA091] text-white'
                            : 'text-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Global Search */}
          <GlobalSearch className='w-96' />

          {/* Page Statistics */}
          <PageStats currentPage={currentPage} />

          {/* Floor & Unit Filter */}
          <FloorUnitFilter />

          {/* WebSocket Connection Status */}
          {/* <WebSocketStatus /> */}
        </div>
      </div>
    </header>
  )
}

export default AppBar
