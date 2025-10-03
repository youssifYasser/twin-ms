import { useMemo } from 'react'
import { PageType } from '@/App'
import { useFilter } from '@/context/FilterContext'
import {
  getFilteredDevices,
  getFilteredCameraStats,
  // getFilteredAlertStats,
  getFilteredAlerts,
} from '@/utils/dataFilters'

interface PageStatsProps {
  currentPage: PageType
}

interface StatItem {
  value: number
  label: string
  icon: JSX.Element
  color: string
}

const PageStats = ({ currentPage }: PageStatsProps) => {
  const { filterState } = useFilter()

  const stats = useMemo(() => {
    const filterParams = {
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    }

    switch (currentPage) {
      case 'system-control': {
        const devices = getFilteredDevices(filterParams)
        return [
          {
            value: devices.length,
            label: 'Devices',
            icon: (
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            ),
            color: 'text-blue-400',
          },
        ]
      }

      case 'camera-feed': {
        const cameraStats = getFilteredCameraStats(filterParams)
        return [
          {
            value: cameraStats.total || 0,
            label: 'Cameras',
            icon: (
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
            ),
            color: 'text-purple-400',
          },
        ]
      }

      case 'alerts': {
        // const alertStats = getFilteredAlertStats(filterParams)
        const alerts = getFilteredAlerts(filterParams)
        // const maintenanceTasksData = alertStats.find(
        //   (stat) => stat.title === 'Maintenance Tasks'
        // )

        return [
          {
            value: alerts.length,
            label: 'Alerts',
            icon: (
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            ),
            color: 'text-red-400',
          },
          // {
          //   value: parseInt(maintenanceTasksData?.value || '0'),
          //   label: 'Maintenance Tasks',
          //   icon: (
          //     <svg
          //       className='w-4 h-4'
          //       fill='none'
          //       stroke='currentColor'
          //       viewBox='0 0 24 24'
          //     >
          //       <path
          //         strokeLinecap='round'
          //         strokeLinejoin='round'
          //         strokeWidth={2}
          //         d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
          //       />
          //       <path
          //         strokeLinecap='round'
          //         strokeLinejoin='round'
          //         strokeWidth={2}
          //         d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
          //       />
          //     </svg>
          //   ),
          //   color: 'text-orange-400',
          // },
        ]
      }

      case 'statistics':
      default:
        return [] // Hide for statistics and other pages
    }
  }, [currentPage, filterState.selectedFloorId, filterState.selectedUnitId])

  if (stats.length === 0) {
    return null
  }

  return (
    <div className='flex items-center gap-3'>
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} />
      ))}
    </div>
  )
}

const StatCard = ({ stat }: { stat: StatItem }) => {
  return (
    <div className='flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-2 border border-slate-600/50'>
      <div className='w-6 h-6 flex items-center justify-center bg-slate-600 rounded'>
        <div className={stat.color}>{stat.icon}</div>
      </div>
      <div className='text-sm'>
        <div className='text-white font-semibold'>
          {stat.value.toLocaleString()}
        </div>
        <div className='text-slate-400 text-xs'>{stat.label}</div>
      </div>
    </div>
  )
}

export default PageStats
