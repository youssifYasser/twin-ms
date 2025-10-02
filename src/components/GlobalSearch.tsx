import { useState, useEffect, useRef, useMemo } from 'react'
import {
  SearchIcon,
  FilterIcon,
  ArrowRightIcon,
  Settings,
  Camera,
  Building,
  AlertTriangle,
  Wrench,
  FileText,
} from 'lucide-react'
import {
  getFilteredDevices,
  getFilteredCameras,
  getFilteredAlerts,
  getFilteredMaintenanceTasks,
} from '@/utils/dataFilters'
import { BUILDING_DATA } from '@/data/buildingData'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'device' | 'camera' | 'unit' | 'alert' | 'maintenance' | 'system'
  category: string
  location?: string
  status: string
  statusColor: string
}

interface GlobalSearchProps {
  className?: string
}

const GlobalSearch = ({ className = '' }: GlobalSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setShowFilters(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Open dropdown when typing
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [searchQuery])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []

    const filterParams = {
      selectedFloorId: null, // Search across all floors
      selectedUnitId: null,
    }

    // Search devices
    const devices = getFilteredDevices(filterParams)
    devices.forEach((device) => {
      if (
        device.name?.toLowerCase().includes(query) ||
        device.deviceType?.toLowerCase().includes(query) ||
        device.floor?.toLowerCase().includes(query)
      ) {
        results.push({
          id: `device-${device.id}`,
          title: device.name || 'Unknown Device',
          description: `${device.deviceType} - Smart device control system`,
          type: 'device',
          category: device.deviceType || 'Device',
          location: device.floor,
          status: device.isOn ? 'Online' : 'Offline',
          statusColor: device.isOn ? 'text-teal-400' : 'text-red-400',
        })
      }
    })

    // Search cameras
    const cameras = getFilteredCameras(filterParams)
    cameras.forEach((camera) => {
      if (
        camera.name?.toLowerCase().includes(query) ||
        camera.location?.toLowerCase().includes(query)
      ) {
        results.push({
          id: `camera-${camera.id}`,
          title: camera.name || 'Unknown Camera',
          description: `${camera.quality?.resolution || 'HD'} camera - ${
            camera.isOnline ? 'monitoring active' : 'currently offline'
          }`,
          type: 'camera',
          category: 'Security',
          location: camera.location,
          status: camera.isOnline ? 'Online' : 'Offline',
          statusColor: camera.isOnline ? 'text-teal-400' : 'text-red-400',
        })
      }
    })

    // Search units
    BUILDING_DATA.forEach((floor) => {
      floor.units.forEach((unit) => {
        if (
          unit.displayName?.toLowerCase().includes(query) ||
          unit.number?.toLowerCase().includes(query) ||
          floor.displayName?.toLowerCase().includes(query)
        ) {
          results.push({
            id: `unit-${unit.id}`,
            title: unit.displayName || 'Unknown Unit',
            description: `Building unit space - ${unit.number}`,
            type: 'unit',
            category: 'Zone',
            location: `${floor.displayName}`,
            status: 'Available',
            statusColor: 'text-teal-400',
          })
        }
      })
    })

    // Search alerts
    const alerts = getFilteredAlerts(filterParams)
    alerts.forEach((alert) => {
      if (
        alert.title?.toLowerCase().includes(query) ||
        alert.description?.toLowerCase().includes(query) ||
        alert.location?.toLowerCase().includes(query)
      ) {
        results.push({
          id: `alert-${alert.title}`,
          title: alert.title || 'Alert',
          description: alert.description || 'System alert notification',
          type: 'alert',
          category: 'Alert',
          location: alert.location,
          status: alert.severity || 'Unknown',
          statusColor:
            alert.severity === 'critical'
              ? 'text-red-400'
              : alert.severity === 'high'
              ? 'text-red-400'
              : alert.severity === 'medium'
              ? 'text-yellow-400'
              : 'text-blue-400',
        })
      }
    })

    // Search maintenance tasks
    const maintenanceTasks = getFilteredMaintenanceTasks(filterParams)
    maintenanceTasks.forEach((task) => {
      if (
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      ) {
        results.push({
          id: `maintenance-${task.title}`,
          title: task.title || 'Maintenance Task',
          description: task.description || 'Scheduled maintenance task',
          type: 'maintenance',
          category: 'Maintenance',
          location: 'Building System',
          status: task.currentStatus || 'Pending',
          statusColor:
            task.currentStatus === 'completed'
              ? 'text-teal-400'
              : task.currentStatus === 'in-progress'
              ? 'text-yellow-400'
              : 'text-blue-400',
        })
      }
    })

    // Limit results and sort by relevance
    return results.slice(0, 20).sort((a, b) => {
      const aRelevance = a.title.toLowerCase().indexOf(query)
      const bRelevance = b.title.toLowerCase().indexOf(query)
      return aRelevance - bRelevance
    })
  }, [searchQuery])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'device':
        return Settings
      case 'camera':
        return Camera
      case 'unit':
        return Building
      case 'alert':
        return AlertTriangle
      case 'maintenance':
        return Wrench
      default:
        return FileText
    }
  }

  const handleResultClick = (result: SearchResult) => {
    // Here you could implement navigation logic based on result type
    console.log('Navigate to:', result)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className='relative'>
        <input
          type='text'
          placeholder='Search units, devices, cameras...'
          className='w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-16 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim() && setIsOpen(true)}
        />

        {/* Search Icon */}
        <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />

        {/* Filter Button */}
        <div className='absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1'>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='w-7 h-7 flex items-center justify-center rounded cursor-pointer transition-all bg-slate-600 hover:bg-slate-500 text-slate-400'
            title='Search Filters'
          >
            <FilterIcon className='w-3 h-3' />
          </button>
        </div>
      </div>

      {/* Search Results */}
      {isOpen && searchQuery.trim() && (
        <div className='absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden'>
          <div className='overflow-y-auto' style={{ maxHeight: '360px' }}>
            <div className='p-2'>
              {/* Results Count */}
              <div className='text-xs text-slate-400 mb-2 px-2'>
                {searchResults.length} result
                {searchResults.length !== 1 ? 's' : ''} found
              </div>

              {/* Results List */}
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className='w-full text-left p-3 rounded-lg cursor-pointer transition-colors hover:bg-slate-700/50'
                  >
                    <div className='flex items-start gap-3'>
                      {/* Icon */}
                      <div className='w-8 h-8 flex items-center justify-center bg-slate-700 rounded-lg flex-shrink-0 mt-0.5'>
                        {(() => {
                          const IconComponent = getTypeIcon(result.type)
                          return (
                            <IconComponent className='text-teal-400 w-4 h-4' />
                          )
                        })()}
                      </div>

                      {/* Content */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='font-medium text-white truncate'>
                            {result.title}
                          </span>
                          <span className='text-xs bg-slate-600 text-slate-300 px-2 py-0.5 rounded flex-shrink-0 capitalize'>
                            {result.type}
                          </span>
                        </div>
                        <div className='text-xs text-slate-400 mb-1 overflow-hidden text-ellipsis whitespace-nowrap'>
                          {result.description}
                        </div>
                        <div className='flex items-center gap-3 text-xs'>
                          <span className='text-slate-500'>
                            {result.category}
                          </span>
                          {result.location && (
                            <span className='text-slate-500'>
                              {result.location}
                            </span>
                          )}
                          <span className={result.statusColor}>
                            {result.status}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className='flex-shrink-0'>
                        <ArrowRightIcon className='text-slate-500 w-4 h-4' />
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className='p-4 text-center text-slate-400'>
                  <div className='text-sm'>No results found</div>
                  <div className='text-xs mt-1'>Try different keywords</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GlobalSearch
