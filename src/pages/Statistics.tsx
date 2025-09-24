import StatisticsCard from '@/components/StatisticsCard'
import {
  AlertsCard,
  AnomaliesAlertsContainer,
  ConsumptionTrends,
  CostBreakdown,
  LastUpdate,
} from '@/components/statistics'
import { useFilter } from '@/context/FilterContext'
import { getFilteredStatistics } from '@/utils/dataFilters'
import { useMemo } from 'react'

const Statistics = () => {
  const { filterState } = useFilter()

  // Get filtered statistics data based on current floor/unit selection
  const statisticsData = useMemo(() => {
    return getFilteredStatistics({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })
  }, [filterState.selectedFloorId, filterState.selectedUnitId])

  return (
    <div className='space-y-6'>
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

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Filtered Statistics Cards */}
        {statisticsData.map((stat, index) => (
          <StatisticsCard
            key={`${stat.title}-${index}`}
            statisticsItem={stat}
          />
        ))}
      </div>

      <div className=' items-start gap-3 w-full grid grid-cols-1 lg:grid-cols-7'>
        <div className='lg:col-span-3'>
          <ConsumptionTrends />
        </div>
        <div className='lg:col-span-2'>
          <AnomaliesAlertsContainer />
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
      </div>
    </div>
  )
}

export default Statistics
