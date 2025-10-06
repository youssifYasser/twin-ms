import { PageType } from '@/App'
import Logo from '@/components/Logo'
import { RealtimeIcon } from '@/icons'
import FloorUnitFilter from '@/components/FloorUnitFilter'
import PageStats from '@/components/PageStats'
import GlobalSearch from '@/components/GlobalSearch'
import { useRealtimeData } from '@/context/RealtimeDataContext'
import { MenuIcon, ChevronDownIcon, MoreHorizontalIcon } from 'lucide-react'
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
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const tabletDropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Handle time period dropdowns (both desktop and tablet)
      const isOutsideDesktopDropdown =
        dropdownRef.current && !dropdownRef.current.contains(target)
      const isOutsideTabletDropdown =
        tabletDropdownRef.current && !tabletDropdownRef.current.contains(target)

      if (isOutsideDesktopDropdown || isOutsideTabletDropdown) {
        // Only close if the click is not inside the mobile menu
        if (!mobileMenuRef.current || !mobileMenuRef.current.contains(target)) {
          setShowTimePeriodDropdown(false)
        }
      }

      // Handle mobile menu
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        // Don't close mobile menu if clicking on time period dropdowns
        (!dropdownRef.current || !dropdownRef.current.contains(target)) &&
        (!tabletDropdownRef.current ||
          !tabletDropdownRef.current.contains(target))
      ) {
        setShowMobileMenu(false)
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
      <div className='flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 shadow-lg'>
        {/* Left Section */}
        <div className='flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1'>
          {showLogo && (
            <div className='flex items-center'>
              <MenuIcon
                className='mr-2 sm:mr-4 cursor-pointer active:scale-90 transition-transform duration-200 flex-shrink-0'
                onClick={toggleSidebar}
                size={20}
              />
              <Logo
                className='h-5 sm:h-6 mr-2 sm:mr-4 hidden sm:block'
                width={75}
                height={20}
              />
              <div className='w-px h-4 sm:h-6 bg-primary-border mr-2 sm:mr-4 hidden sm:block' />
            </div>
          )}
          <h2 className='text-lg sm:text-xl lg:text-2xl font-bold font-roboto text-white truncate'>
            {getPageTitle(currentPage)}
          </h2>
        </div>

        {/* Right Section - Desktop */}
        <div className='hidden xl:flex items-center space-x-4'>
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

            {/* Time Period Dropdown */}
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
        </div>

        {/* Right Section - Mobile */}
        <div className='flex xl:hidden items-center space-x-2'>
          {/* Real-time Data Toggle - Icon Only */}
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm font-roboto transition-all duration-200 rounded-lg ${
              isRealtimeEnabled
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg '
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
            onClick={toggleRealtime}
            title={
              isRealtimeEnabled
                ? 'Disable Real-time Data'
                : 'Enable Real-time Data'
            }
          >
            <RealtimeIcon
              width={16}
              height={16}
              className={`${isRealtimeEnabled ? 'animate-pulse' : ''}`}
            />
            <span className='hidden lg:inline'>Live Data</span>
          </button>

          {/* Floor & Unit Filter */}
          <FloorUnitFilter />

          {/* Mobile Menu Button */}
          <div className='relative' ref={mobileMenuRef}>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className='p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200'
              title='More options'
            >
              <MoreHorizontalIcon size={18} />
            </button>

            {/* Mobile Menu Dropdown */}
            {showMobileMenu && (
              <div className='absolute top-full mt-1 right-0 transform -translate-x-0 bg-[#1F2937] border border-[#374151] rounded-lg shadow-lg z-50 w-80 max-w-[calc(100vw-1rem)]'>
                {/* Time Period Selection */}
                {!isRealtimeEnabled && (
                  <div className='p-3 border-b border-[#374151]'>
                    <div className='text-xs text-gray-400 mb-2'>
                      Time Period
                    </div>
                    <div className='flex gap-2'>
                      {timePeriodOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setTimePeriod(option)
                            setShowMobileMenu(false)
                          }}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            timePeriod === option
                              ? 'bg-[#3BA091] text-white'
                              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Page Statistics */}
                <div className='p-3 border-b border-[#374151]'>
                  <div className='text-xs text-gray-400 mb-2'>Statistics</div>
                  <PageStats currentPage={currentPage} />
                </div>

                {/* Global Search */}
                <div className='p-3 border-b border-[#374151]'>
                  <div className='text-xs text-gray-400 mb-2'>Search</div>
                  <GlobalSearch className='w-full' />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppBar
