import { useMemo } from 'react'
import { useFilter } from '@/context/FilterContext'
import { getFilteredAlerts } from '@/utils/dataFilters'

const AlertsCard = () => {
  const { filterState } = useFilter()

  // Get filtered alerts for the current location
  const alerts = useMemo(() => {
    const filteredAlerts = getFilteredAlerts({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })

    // Return short alert summaries
    return filteredAlerts.slice(0, 2).map((alert) => ({
      text: `${alert.title}: ${alert.description}`,
    }))
  }, [filterState.selectedFloorId, filterState.selectedUnitId])

  return (
    <div className='bg-[#07131D] p-4 flex flex-col items-start gap-3'>
      <h4 className='text-base font-bold text-[#B0B3B5] uppercase'>Alerts</h4>
      <hr className='border-[#37415180] color-[#37415180] w-[90%] self-center' />

      {alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <p key={index} className='text-[#8F9295] font-normal text-sm'>
            {alert.text}
          </p>
        ))
      ) : (
        <p className='text-[#8F9295] font-normal text-sm italic'>
          No alerts for this location
        </p>
      )}
    </div>
  )
}

export default AlertsCard
