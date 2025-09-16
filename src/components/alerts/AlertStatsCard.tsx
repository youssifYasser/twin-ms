import { ArrowDownIcon, ArrowUpIcon } from '@/icons'
import { StatisticsType } from '@/types'

interface AlertStatsCardProps {
  statisticsItem: StatisticsType & { color: string }
  className?: string
}
const AlertStatsCard = ({
  statisticsItem: { title, value, percentageChange, color },
  className = '',
}: AlertStatsCardProps) => {
  return (
    <div
      className={`p-4 backdrop-blur-24 flex flex-col items-start justify-between gap-2 rounded-none border border-[#040E16] ${className}`}
      style={{ backgroundColor: color }}
    >
      <div className='flex items-center gap-2'>
        <h3 className='text-base font-bold text-[#aeb0b3] capitalize'>
          {title}
        </h3>
      </div>
      <p className='text-4xl font-bold text-[#e3e5e7]'>{value}</p>
      <div className='flex items-center gap-2'>
        {percentageChange < 0 ? (
          <ArrowDownIcon fill='#EF4444' />
        ) : (
          <ArrowUpIcon fill='#4ADE80' />
        )}
        <span
          className={`${
            percentageChange < 0 ? 'text-[#EF4444]' : 'text-[#4ADE80]'
          } font-normal text-xl`}
        >
          {percentageChange}%
        </span>
      </div>
    </div>
  )
}

export default AlertStatsCard
