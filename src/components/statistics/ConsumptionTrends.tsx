import { useState, useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { ChevronDown } from 'lucide-react'
import { useFilter } from '@/context/FilterContext'
import { getFilteredConsumptionData } from '@/utils/dataFilters'

type TimeUnit = 'hours' | 'days' | 'weeks' | 'months'
type ConsumptionType = 'energy' | 'water'

const ConsumptionTrends = () => {
  const [activeTab, setActiveTab] = useState<ConsumptionType>('energy')
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('days')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { filterState } = useFilter()

  // Get filtered consumption data based on current floor/unit selection
  const consumptionData = useMemo(() => {
    const filtered = getFilteredConsumptionData({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })

    // Fallback to default data if no filtered data available
    if (!filtered) {
      return {
        energy: {
          splineData: [
            { x: 'Jan', y: 420 },
            { x: 'Feb', y: 378 },
            { x: 'Mar', y: 445 },
            { x: 'Apr', y: 398 },
            { x: 'May', y: 467 },
            { x: 'Jun', y: 489 },
            { x: 'Jul', y: 523 },
            { x: 'Aug', y: 498 },
            { x: 'Sep', y: 445 },
            { x: 'Oct', y: 423 },
            { x: 'Nov', y: 389 },
            { x: 'Dec', y: 412 },
          ],
          heatMapData: [
            {
              name: 'Mon',
              data: [12, 8, 78, 89, 95, 67, 54, 43, 38, 62, 71, 58],
            },
            {
              name: 'Tue',
              data: [42, 28, 82, 91, 88, 71, 59, 47, 41, 65, 74, 61],
            },
            {
              name: 'Wed',
              data: [5, 3, 75, 86, 92, 64, 52, 41, 36, 58, 68, 55],
            },
            {
              name: 'Thu',
              data: [44, 31, 79, 88, 94, 69, 57, 46, 40, 63, 72, 59],
            },
            {
              name: 'Fri',
              data: [47, 34, 81, 93, 97, 72, 60, 49, 43, 66, 75, 62],
            },
            {
              name: 'Sat',
              data: [11, 7, 68, 76, 82, 56, 45, 34, 29, 51, 60, 47],
            },
            {
              name: 'Sun',
              data: [32, 19, 65, 73, 79, 53, 42, 31, 26, 48, 57, 44],
            },
          ],
        },
        water: {
          splineData: [
            { x: 'Jan', y: 145 },
            { x: 'Feb', y: 132 },
            { x: 'Mar', y: 167 },
            { x: 'Apr', y: 156 },
            { x: 'May', y: 178 },
            { x: 'Jun', y: 189 },
            { x: 'Jul', y: 195 },
            { x: 'Aug', y: 184 },
            { x: 'Sep', y: 171 },
            { x: 'Oct', y: 158 },
            { x: 'Nov', y: 142 },
            { x: 'Dec', y: 149 },
          ],
          heatMapData: [
            {
              name: 'Mon',
              data: [12, 8, 24, 35, 42, 28, 18, 14, 10, 22, 31, 19],
            },
            {
              name: 'Tue',
              data: [6, 9, 26, 38, 45, 31, 21, 16, 12, 24, 33, 22],
            },
            {
              name: 'Wed',
              data: [11, 7, 22, 33, 40, 26, 16, 12, 8, 20, 29, 17],
            },
            {
              name: 'Thu',
              data: [14, 10, 25, 36, 43, 29, 19, 15, 11, 23, 32, 20],
            },
            {
              name: 'Fri',
              data: [17, 12, 28, 39, 46, 32, 22, 18, 14, 26, 35, 23],
            },
            { name: 'Sat', data: [9, 5, 18, 27, 34, 20, 12, 8, 4, 16, 23, 13] },
            { name: 'Sun', data: [1, 4, 16, 25, 32, 18, 10, 6, 2, 14, 21, 11] },
          ],
        },
      }
    }

    return filtered
  }, [filterState.selectedFloorId, filterState.selectedUnitId])

  // Static data for charts - now replaced with filtered data above
  // const consumptionData: ConsumptionData = { ... }

  const timeUnits = [
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
  ]

  // Spline chart configuration
  const splineOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 280,
      width: '100%',
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: true, speed: 800 },
    },
    theme: { mode: 'dark' },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#1F79AC'],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#125985'],
        shadeIntensity: 1,
        type: 'vertical',
        opacityFrom: 0.8,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: 'rgba(55, 65, 81, 0.3)',
      strokeDashArray: 3,
    },
    xaxis: {
      labels: { style: { colors: '#9CA3AF', fontSize: '12px' } },
      axisBorder: { color: 'rgba(55, 65, 81, 0.3)' },
      axisTicks: { color: 'rgba(55, 65, 81, 0.3)' },
    },
    yaxis: {
      labels: {
        style: { colors: '#9CA3AF', fontSize: '12px' },
        formatter: (val) => `${val}${activeTab === 'energy' ? ' kWh' : ' m³'}`,
      },
    },
    tooltip: {
      theme: 'dark',
      style: { fontSize: '12px' },
      y: {
        formatter: (val) => `${val} ${activeTab === 'energy' ? 'kWh' : 'm³'}`,
      },
    },
    markers: {
      size: 6,
      colors: ['#1F79AC'],
      strokeColors: '#ffffff',
      strokeWidth: 2,
      hover: { size: 8 },
    },
  }

  const currentData = consumptionData[activeTab]

  // Heat map chart configuration
  const heatMapOptions: ApexOptions = useMemo(() => {
    // Calculate dynamic color ranges based on the data
    const allValues = currentData.heatMapData.flatMap((day) => day.data)
    const minValue = Math.min(...allValues)
    const maxValue = Math.max(...allValues)
    const range = maxValue - minValue

    // Create 5 color ranges dynamically
    const step = range / 5
    const ranges = [
      {
        from: minValue,
        to: minValue + step,
        name: 'Very Low',
        color: '#0B243B',
      },
      {
        from: minValue + step,
        to: minValue + step * 2,
        name: 'Low',
        color: '#0C3455',
      },
      {
        from: minValue + step * 2,
        to: minValue + step * 3,
        name: 'Medium',
        color: '#0B4169',
      },
      {
        from: minValue + step * 3,
        to: minValue + step * 4,
        name: 'Medium-High',
        color: '#155F8D',
      },
      {
        from: minValue + step * 4,
        to: maxValue,
        name: 'High',
        color: '#1F79AC',
      },
    ]

    return {
      chart: {
        type: 'heatmap',
        height: 280,
        width: 500,
        background: 'rgba(8, 19, 29, 1)',
        toolbar: { show: false },
      },
      theme: { mode: 'dark' },
      plotOptions: {
        heatmap: {
          radius: 1,
          distributed: true,
          useFillColorAsStroke: false,
          enableShades: false,
          colorScale: {
            ranges: ranges,
          },
        },
      },
      stroke: {
        width: 2,
        colors: ['rgba(8, 19, 29, 1)'], // Background color to create separation
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        borderColor: 'rgba(55, 65, 81, 0.3)',
        padding: {
          top: 20,
          right: 30,
          bottom: 20,
          left: 20,
        },
      },
      xaxis: {
        type: 'category',
        categories: [
          '00:00',
          '02:00',
          '04:00',
          '06:00',
          '08:00',
          '10:00',
          '12:00',
          '14:00',
          '16:00',
          '18:00',
          '20:00',
          '22:00',
        ],
        labels: {
          style: { colors: '#9CA3AF', fontSize: '11px' },
          rotate: -45,
          rotateAlways: true,
        },
      },
      yaxis: {
        labels: { style: { colors: '#9CA3AF', fontSize: '11px' } },
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val) => `${val} ${activeTab === 'energy' ? 'kWh' : 'm³'}`,
        },
      },
    }
  }, [currentData.heatMapData, activeTab])

  const splineSeries = [
    {
      name: `${activeTab === 'energy' ? 'Energy' : 'Water'} Consumption`,
      data: currentData.splineData.map((item) => ({ x: item.x, y: item.y })),
    },
  ]

  const heatMapSeries = currentData.heatMapData

  return (
    <div className='space-y-4'>
      {/* Header with Tabs and Time Unit Dropdown */}
      <div className='flex items-center justify-between'>
        <div className='flex space-x-1 bg-gray-800/40 p-1 rounded-lg'>
          <button
            onClick={() => setActiveTab('energy')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'energy'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Energy
          </button>
          <button
            onClick={() => setActiveTab('water')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'water'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Water
          </button>
        </div>

        {/* Time Unit Dropdown */}
        <div className='relative'>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='flex items-center px-3 py-2 bg-gray-700/30 border border-gray-600/50 text-white text-sm font-inter hover:bg-gray-600/30 transition-colors'
          >
            <span>
              {timeUnits.find((unit) => unit.value === timeUnit)?.label}
            </span>
            <ChevronDown className='ml-2 h-4 w-4' />
          </button>
          {isDropdownOpen && (
            <div className='absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-600/50 shadow-lg z-10'>
              {timeUnits.map((unit) => (
                <button
                  key={unit.value}
                  onClick={() => {
                    setTimeUnit(unit.value as TimeUnit)
                    setIsDropdownOpen(false)
                  }}
                  className='w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors'
                >
                  {unit.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Spline Chart Card */}
      <div className='bg-bg-card p-6'>
        <h3 className='text-xl font-bold text-white mb-7'>
          {activeTab === 'energy' ? 'Energy' : 'Water'} Consumption Trend
        </h3>
        <ReactApexChart
          options={splineOptions}
          series={splineSeries}
          type='line'
          // height={280}
          width='100%'
        />
      </div>

      {/* Heat Map Chart Card */}
      <div className='bg-bg-card p-6'>
        <h3 className='text-xl font-bold text-white mb-7'>
          {activeTab === 'energy' ? 'Energy' : 'Water'} Consumption Heat Map
        </h3>
        <ReactApexChart
          options={heatMapOptions}
          series={heatMapSeries}
          type='heatmap'
          // height={280}
          width={'100%'}
        />
      </div>
    </div>
  )
}

export default ConsumptionTrends
