import { ArrowUpIcon } from '@/icons'
import { StatisticsType } from '@/types'

interface StatisticsCardProps {
  statisticsItem: StatisticsType
}

const StatisticsCard = ({
  statisticsItem: {
    title,
    value,
    measurementUnit,
    trendGraph,
    percentageChange,
  },
}: StatisticsCardProps) => {
  return (
    <div
      className={`bg-bg-card p-4 backdrop-blur-24 flex flex-col items-start justify-between gap-2 rounded-none w-full`}
    >
      <div className='flex items-center gap-2'>
        <h3 className='text-base font-bold text-[#aeb0b3] uppercase'>
          {title}
        </h3>
        {measurementUnit && (
          <span className='text-sm font-normal text-[#6b757c]'>
            {measurementUnit}
          </span>
        )}
      </div>
      <div className='flex items-baseline gap-2'>
        <span className='text-4xl font-bold text-[#e3e5e7]'>{value}</span>
        {measurementUnit && (
          <span className='text-xl font-normal text-[#519a96]'>
            {measurementUnit}
          </span>
        )}
      </div>
      <div className='flex items-center gap-1'>
        <ArrowUpIcon fill='#53B8BE' />

        <span className='text-[#37988a] font-normal text-xl'>
          {percentageChange}%
        </span>
        {trendGraph && (
          <img
            src={trendGraph}
            alt='Trend graph'
            className='mb-5 ml-8'
            width={109}
            height={22}
          />
        )}
      </div>
    </div>
  )
}

export default StatisticsCard
