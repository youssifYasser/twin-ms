import { PageType } from '@/App'
import Logo from '@/components/Logo'
import { RefreshIcon } from '@/icons'
import Dropdown from '@/components/Dropdown'
import { useFilter } from '@/context/FilterContext'
import { MenuIcon } from 'lucide-react'

interface AppBarProps {
  currentPage: PageType
  showLogo: boolean
  toggleSidebar: () => void
}

const AppBar = ({ currentPage, showLogo, toggleSidebar }: AppBarProps) => {
  const {
    filterState,
    setFloor,
    setUnit,
    getFloorOptions,
    getUnitOptions,
    resetFilters,
  } = useFilter()

  const handleFloorChange = (floor: string) => {
    setFloor(floor)
  }

  const handleUnitChange = (unit: string) => {
    setUnit(unit)
  }

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
      default:
        return 'Dashboard'
    }
  }

  console.log('floors: ', getFloorOptions())
  console.log('units: ', getUnitOptions())

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
              <Logo className='w-6 h-6 mr-2' width={24} height={24} />
              <h1 className='text-xl font-bold font-ibm-plex text-white mr-4'>
                Twin MS
              </h1>
              <div className='w-px h-6 bg-primary-border mr-4' />
            </div>
          )}
          <h2 className='text-2xl font-bold font-roboto text-white'>
            {getPageTitle(currentPage)}
          </h2>
        </div>

        <div className='flex items-center space-x-4'>
          {/* Floor Dropdown */}
          <Dropdown
            options={getFloorOptions()}
            value={filterState.selectedFloor}
            onChange={handleFloorChange}
            placeholder='Select Floor'
            buttonClassName='rounded-none'
          />

          {/* Unit Dropdown - Only show if a specific floor is selected */}
          {filterState.selectedFloor !== 'All Floors' && (
            <Dropdown
              options={getUnitOptions()}
              value={filterState.selectedUnit}
              onChange={handleUnitChange}
              placeholder='Select Unit'
              buttonClassName='rounded-none'
            />
          )}

          {/* WebSocket Connection Status */}
          {/* <WebSocketStatus /> */}

          {/* Refresh Status Button */}
          <button
            className='flex items-center px-4 py-2 bg-active-page text-white text-sm font-roboto hover:bg-[#278372] transition-colors rounded-none'
            onClick={resetFilters}
          >
            <RefreshIcon className='mr-2' />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default AppBar
