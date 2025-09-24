import {
  AlertStatsCard,
  ActiveAlertCard,
  MaintenanceTaskCard,
} from '@/components/alerts'
import { Dropdown } from '@/components'
import { PlusIcon, RefreshIcon } from '@/icons'
import { useState, useMemo } from 'react'
import { useFilter } from '@/context/FilterContext'
import {
  getFilteredAlerts,
  getFilteredMaintenanceTasks,
  getFilteredAlertStats,
} from '@/utils/dataFilters'

const AlertsMaintenance = () => {
  const [severityFilter, setSeverityFilter] = useState<string>('All')
  const { filterState } = useFilter()

  // Get filtered data based on current floor/unit selection
  const alertsStats = useMemo(() => {
    return getFilteredAlertStats({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })
  }, [filterState.selectedFloorId, filterState.selectedUnitId])

  const filteredAlerts = useMemo(() => {
    return getFilteredAlerts(
      {
        selectedFloorId: filterState.selectedFloorId,
        selectedUnitId: filterState.selectedUnitId,
      },
      severityFilter
    )
  }, [filterState.selectedFloorId, filterState.selectedUnitId, severityFilter])

  const maintenanceTasks = useMemo(() => {
    return getFilteredMaintenanceTasks({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })
  }, [filterState.selectedFloorId, filterState.selectedUnitId])

  // Dropdown options for severity filter
  const severityOptions = ['All', 'Critical', 'High', 'Medium', 'Low']

  return (
    <div className='space-y-6'>
      {/* Display current filter information */}
      {filterState.selectedFloor !== 'All Floors' && (
        <div className='bg-bg-card backdrop-blur-24 p-4 rounded-lg border border-primary-border'>
          <p className='text-white text-center text-lg'>
            Showing alerts for:{' '}
            <span className='font-bold text-active-page'>
              {filterState.selectedFloor}
              {filterState.selectedUnit !== 'All Units' &&
                ` - ${filterState.selectedUnit}`}
            </span>
          </p>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {alertsStats.map((stat, index) => {
          return <AlertStatsCard key={index} statisticsItem={stat} />
        })}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 font-roboto'>
        <div className='col-span-2 bg-bg-card backdrop-blur-24 p-6 rounded-none flex flex-col gap-6 h-fit'>
          <div className='flex items-center justify-between'>
            <h3 className='text-xl font-bold text-white'>Active Alerts</h3>
            {/* Severity (alert status) dropdown Filter and Refresh button */}
            <div className='flex items-stretch gap-2'>
              <Dropdown
                options={severityOptions}
                value={severityFilter}
                onChange={(value) => setSeverityFilter(value)}
                placeholder='Filter by severity'
                className='rounded-lg border border-[#4B5563] bg-[#1F2937]'
              />
              <button
                onClick={() => setSeverityFilter('All')}
                className='flex items-center justify-center p-2 bg-[#1F2937] rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1F2937BB] transition-colors duration-200'
                title='Refresh alerts'
              >
                <RefreshIcon width={16} height={16} fill='currentColor' />
              </button>
            </div>
          </div>
          <div className='flex flex-col items-start gap-4 w-full '>
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, index) => (
                <ActiveAlertCard key={index} alert={alert} />
              ))
            ) : (
              <div className='flex items-center justify-center py-8 text-[#9CA3AF]'>
                <p>No alerts found for the selected criteria.</p>
              </div>
            )}
          </div>
        </div>

        <div className='bg-bg-card backdrop-blur-24 p-6 rounded-none flex flex-col gap-6 h-fit'>
          <div className='flex items-center justify-between'>
            <h3 className='font-bold text-white text-lg'>Maintenance Tasks</h3>
            <button className='flex items-center justify-center bg-[#37988A] hover:bg-[#37988ABB] p-2 rounded-lg transition-colors duration-200'>
              <PlusIcon width={16} height={16} />
            </button>
          </div>
          <div className='flex flex-col gap-4 items-start w-full'>
            {maintenanceTasks.map((task, index) => (
              <MaintenanceTaskCard key={index} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertsMaintenance
