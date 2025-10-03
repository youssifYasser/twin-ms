import { useMemo } from 'react'
import { useFilter } from '@/context/FilterContext'
import { getFilteredStatistics } from '@/utils/dataFilters'
import LinearProgress from './LinearProgress'

const CostBreakdown = () => {
  const { filterState } = useFilter()

  // Calculate costs based on filtered statistics data
  const costItems = useMemo(() => {
    const stats = getFilteredStatistics({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })

    // Extract values from filtered statistics
    const waterStat = stats.find((s) => s.title === 'water')
    const demandStat = stats.find((s) => s.title === 'demand')
    const waterPriceStat = stats.find((s) => s.title === 'water price')

    const waterUsage = waterStat ? parseFloat(waterStat.value) : 50
    const demandUsage = demandStat ? parseFloat(demandStat.value) : 25
    const waterPrice = waterPriceStat ? parseFloat(waterPriceStat.value) : 25

    // Calculate costs based on actual consumption data
    const energyCost = Math.floor(demandUsage * 15 * 30) // Demand * rate * days
    const demandCharges = Math.floor(demandUsage * 8 * 30) // Demand charges
    const waterCost = Math.floor(waterUsage * waterPrice) // Water usage * price
    const taxesFees = Math.floor(
      (energyCost + demandCharges + waterCost) * 0.05
    ) // 5% tax

    const totalCost = energyCost + demandCharges + waterCost + taxesFees

    return [
      {
        label: 'Energy Charges',
        value: `${energyCost.toLocaleString()} SAR`,
        progress: parseFloat(((energyCost / totalCost) * 100).toFixed(1)),
        color: '#3B82F6',
      },
      {
        label: 'Demand Charges',
        value: `${demandCharges.toLocaleString()} SAR`,
        progress: parseFloat(((demandCharges / totalCost) * 100).toFixed(1)),
        color: '#A855F7',
      },
      {
        label: 'Water & Utilities',
        value: `${waterCost.toLocaleString()} SAR`,
        progress: parseFloat(((waterCost / totalCost) * 100).toFixed(1)),
        color: '#06B6D4',
      },
      {
        label: 'Taxes & Fees',
        value: `${taxesFees.toLocaleString()} SAR`,
        progress: parseFloat(((taxesFees / totalCost) * 100).toFixed(1)),
        color: '#F59E0B',
      },
    ]
  }, [filterState.selectedFloorId, filterState.selectedUnitId])

  const totalCost = costItems.reduce((sum, item) => {
    const value = parseInt(item.value.replace(/[^0-9]/g, ''))
    return sum + value
  }, 0)

  return (
    <div className='bg-bg-card p-6 rounded-none backdrop-blur-24'>
      <h3 className='text-xl font-bold text-white mb-7'>Cost Breakdown</h3>
      <div className='flex flex-col gap-4 mb-6'>
        {costItems.map((item, index) => (
          <LinearProgress
            key={index}
            title={item.label}
            value={item.value}
            progress={item.progress}
            color={item.color}
          />
        ))}
      </div>
      <div className='border-t border-[#37415180] pt-6 flex items-baseline justify-between'>
        <span className='text-lg font-bold text-white'>Total</span>
        <span className='text-lg font-bold text-[#3BA091]'>
          {totalCost.toLocaleString()} SAR
        </span>
      </div>
    </div>
  )
}

export default CostBreakdown
