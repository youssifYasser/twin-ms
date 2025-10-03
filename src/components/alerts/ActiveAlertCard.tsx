import { ClockIcon, LocationIcon, PersonIcon } from '@/icons'
import { Plus, Eye, Check } from 'lucide-react'
import { ActiveAlertType } from '@/types'

interface ActiveAlertCardProps {
  alert: ActiveAlertType
  onCreateTask?: (alertId: string) => void
  onViewDetails?: (alertId: string) => void
  onAcknowledge?: (alertId: string) => void
}

const ActiveAlertCard = ({
  alert,
  onCreateTask,
  onViewDetails,
  onAcknowledge,
}: ActiveAlertCardProps) => {
  const handleCreateTask = () => {
    onCreateTask?.(alert.title || 'unknown')
  }

  const handleViewDetails = () => {
    onViewDetails?.(alert.title || 'unknown')
  }

  const handleAcknowledge = () => {
    onAcknowledge?.(alert.title || 'unknown')
  }
  return (
    <div className='bg-[#1F293766] border border-[#37415180] rounded-xl p-4 flex flex-col gap-4 w-full'>
      {/* Main Alert Content */}
      <div className='flex items-start gap-4'>
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

      {/* Actions Row */}
      <div className='flex items-center gap-2 pt-3 border-t border-slate-700'>
        <button
          onClick={handleCreateTask}
          className='bg-teal-500 hover:bg-teal-600 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap text-white transition-colors duration-200'
          title='Create maintenance task from this alert'
        >
          <Plus className='w-3 h-3' />
          Create Task
        </button>
        <button
          onClick={handleViewDetails}
          className='bg-slate-600 hover:bg-slate-500 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap text-slate-300 hover:text-white transition-colors duration-200'
          title='View detailed information about this alert'
        >
          <Eye className='w-3 h-3' />
          View Details
        </button>
        <button
          onClick={handleAcknowledge}
          className='bg-slate-600 hover:bg-slate-500 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap text-slate-300 hover:text-white transition-colors duration-200'
          title='Acknowledge this alert'
        >
          <Check className='w-3 h-3' />
          Acknowledge
        </button>
      </div>
    </div>
  )
}

export default ActiveAlertCard
