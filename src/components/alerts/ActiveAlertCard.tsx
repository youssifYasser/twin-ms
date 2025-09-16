import { ClockIcon, LocationIcon, PersonIcon } from '@/icons'
import { ActiveAlertType } from '@/types'

interface ActiveAlertCardProps {
  alert: ActiveAlertType
}

const ActiveAlertCard = ({ alert }: ActiveAlertCardProps) => {
  return (
    <div className='bg-[#1F293766] border border-[#37415180] rounded-xl p-4 flex items-start gap-4 w-full'>
      <div
        className={`rounded-full w-4 h-4 mt-1`}
        style={{ backgroundColor: alert.color }}
      ></div>
      <div className='flex-1 flex items-start justify-between'>
        <div className='flex flex-col gap-1 items-start'>
          <div className='flex items-center gap-2'>
            <alert.icon fill={alert.color} width={16} height={16} />
            <h4 className='font-bold text-base text-white capitalize'>
              {alert.title}
            </h4>
            <span
              className='text-xs font-medium py-1 px-2 rounded-full uppercase'
              style={{
                backgroundColor: alert.color + '1A',
                color: alert.color,
              }}
            >
              {alert.severity}
            </span>
          </div>
          <p className='font-normal text-sm text-[#9CA3AF] mb-1'>
            {alert.description}
          </p>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-1'>
              <LocationIcon fill='#6B7280' width={12} height={12} />
              <span className='font-normal text-xs text-[#6B7280]'>
                {alert.location}
              </span>
            </div>
            <div className='flex items-center gap-1'>
              <ClockIcon fill='#6B7280' width={12} height={12} />
              <span className='font-normal text-xs text-[#6B7280]'>
                {alert.time}
              </span>
            </div>
            <div className='flex items-center gap-1'>
              <PersonIcon fill='#6B7280' width={12} height={12} />
              <span className='font-normal text-xs text-[#6B7280]'>
                {alert.responsibleBy}
              </span>
            </div>
          </div>
        </div>
        <div
          className={`flex items-center justify-center px-2 py-1 bg-opacity-20 font-medium text-xs uppercase`}
          style={{
            backgroundColor: alert.color + '33',
            color: alert.color,
            borderRadius: '4px',
          }}
        >
          {alert.currentStatus}
        </div>
      </div>
    </div>
  )
}

export default ActiveAlertCard
