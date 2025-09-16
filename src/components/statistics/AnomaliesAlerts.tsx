import { useMemo } from 'react'
import { AlertStatusType } from '@/types'
import { useFilter } from '@/context/FilterContext'
import { getFilteredAlerts } from '@/utils/dataFilters'
import AlertCard from './AlertCard'

const AnomaliesAlerts = () => {
  const { filterState } = useFilter()

  // Get filtered alerts based on current floor/unit selection
  const alerts = useMemo(() => {
    const filteredAlerts = getFilteredAlerts(
      {
        selectedFloorId: filterState.selectedFloorId,
        selectedUnitId: filterState.selectedUnitId,
      },
      'high'
    ) // Only show high severity for anomalies

    // Convert to the format expected by AlertCard
    return filteredAlerts.map((alert) => ({
      title: alert.title,
      desc: alert.description,
      time: alert.time,
      status: alert.severity as AlertStatusType,
    }))
  }, [filterState.selectedFloorId, filterState.selectedUnitId])

  return (
    <div className='bg-bg-card p-6 rounded-none backdrop-blur-24'>
      <div className='flex items-baseline justify-between mb-7'>
        <h3 className='text-xl font-bold text-white'>Anomalies & Alerts</h3>
        <span className='font-normal text-sm text-[#9CA3AF]'>
          {alerts.length} active
        </span>
      </div>
      <div className='flex flex-col gap-4'>
        {alerts.length > 0 ? (
          alerts
            .slice(0, 4)
            .map((alert, index) => <AlertCard key={index} {...alert} />)
        ) : (
          <div className='text-center text-gray-400 py-8'>
            <p>No high-severity alerts for this location</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnomaliesAlerts
