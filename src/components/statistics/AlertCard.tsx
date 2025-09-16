import { AlertStatusType } from '@/types'

interface AlertCardProps {
  title: string
  desc: string
  status: AlertStatusType
  time: string
}

const AlertCard = ({ title, desc, status, time }: AlertCardProps) => {
  const statusColors: Record<AlertStatusType, { bg: string; text: string }> = {
    critical: { bg: '#ef444433', text: '#ef4444' },
    high: { bg: '#F8717133', text: '#F87171' },
    medium: { bg: '#f59e0b33', text: '#fbbf24' },
    low: { bg: '#3b82f633', text: '#3ba091' },
  }

  return (
    <div className='bg-[#1f293766] p-4 rounded-xl  flex items-start justify-between gap-4'>
      <div
        className={`w-3 h-3 rounded-full flex items-center justify-center mt-2`}
        style={{ backgroundColor: statusColors[status].text }}
      ></div>
      <div className='flex flex-col items-start gap-4 flex-1'>
        <div className='flex items-center justify-between w-full'>
          <h3 className='text-base font-medium text-white'>{title}</h3>
          <p className='text-xs text-[#9CA3AF] font-normal'>{time}</p>
        </div>
        <p className='text-lg font-normal text-[#9ca3af]'>{desc}</p>
        <div
          className={`rounded-[4px] px-2 py-1 uppercase font-medium`}
          style={{
            backgroundColor: statusColors[status].bg,
            color: statusColors[status].text,
          }}
        >
          {status}
        </div>
      </div>
    </div>
  )
}

export default AlertCard
