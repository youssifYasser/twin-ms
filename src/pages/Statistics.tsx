import StatisticsCard from '@/components/StatisticsCard'
import {
  AlertsCard,
  AnomaliesAlertsContainer,
  ConsumptionTrends,
  CostBreakdown,
  LastUpdate,
} from '@/components/statistics'
import { useFilter } from '@/context/FilterContext'
import { useWebSocket } from '@/context/WebSocketContext'
import { useRealtimeData } from '@/context/RealtimeDataContext'
import {
  getFilteredStatistics,
  getFilteredOccupancy,
} from '@/utils/dataFilters'
import { useMemo } from 'react'

const Statistics = () => {
  const { filterState } = useFilter()
  const { unit501Occupancy } = useWebSocket()
  const { getModifiedStatistics, isRealtimeEnabled, timePeriod } =
    useRealtimeData()

  // Get filtered statistics data based on current floor/unit selection
  const statisticsData = useMemo(() => {
    const baseStats = getFilteredStatistics({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })
    return getModifiedStatistics(baseStats)
  }, [
    filterState.selectedFloorId,
    filterState.selectedUnitId,
    getModifiedStatistics,
  ])

  // Get occupancy data (refresh when Unit 501 occupancy changes)
  const occupancyData = useMemo(() => {
    const baseOccupancy = getFilteredOccupancy({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })

    // Check if we're viewing Unit 501 specifically
    const isUnit501 =
      filterState.selectedFloorId === 'floor_5' &&
      filterState.selectedUnitId === 'floor_5_unit_1'

    if (isUnit501) {
      // For Unit 501, don't apply real-time modifications - keep static and only respond to WebSocket
      return baseOccupancy
    } else {
      // Apply real-time modifications to other occupancy data
      const modifiedData = getModifiedStatistics([baseOccupancy])
      return modifiedData[0]
    }
  }, [
    filterState.selectedFloorId,
    filterState.selectedUnitId,
    unit501Occupancy,
    getModifiedStatistics,
  ])

  return (
    <div className='space-y-4 md:space-y-6'>
      {/* Time Period Indicator - Only show when real-time is disabled */}
      {!isRealtimeEnabled && (
        <div className='bg-blue-500/20 border border-blue-500/30 backdrop-blur-24 p-4 rounded-lg'>
          <p className='text-blue-400 text-center text-sm'>
            📊 <strong>Historical Data View</strong> - Showing data for the last{' '}
            <span className='font-bold text-blue-300'>
              {timePeriod.toLowerCase()}
            </span>
          </p>
        </div>
      )}

      {/* Display current filter information */}
      {filterState.selectedFloor !== 'All Floors' && (
        <div className='bg-bg-card backdrop-blur-24 p-4 rounded-lg border border-primary-border'>
          <p className='text-white text-center text-lg'>
            Showing statistics for:{' '}
            <span className='font-bold text-active-page'>
              {filterState.selectedFloor}
              {filterState.selectedUnit !== 'All Units' &&
                ` - ${filterState.selectedUnit}`}
            </span>
          </p>
        </div>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6'>
        {/* Filtered Statistics Cards */}
        {statisticsData.map((stat, index) => (
          <StatisticsCard
            key={`${stat.title}-${index}`}
            statisticsItem={stat}
          />
        ))}
        {/* Occupancy Monitoring Card */}
        <StatisticsCard
          key='occupancy-monitoring'
          statisticsItem={occupancyData}
        />
      </div>

      <div className=' items-start gap-3 w-full grid grid-cols-1 lg:grid-cols-7'>
        <div className='lg:col-span-3'>
          <ConsumptionTrends />
        </div>
        <div className='col-span-2 flex flex-col gap-3'>
          <CostBreakdown />
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-3'>
            <div className='lg:col-span-3'>
              <AlertsCard />
            </div>
            <div className='lg:col-span-2'>
              <LastUpdate />
            </div>
          </div>
        </div>
        <div className='lg:col-span-2'>
          <AnomaliesAlertsContainer />
        </div>
      </div>
    </div>
  )
}

export default Statistics
