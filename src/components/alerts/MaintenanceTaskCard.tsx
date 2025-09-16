import { CalendarIcon, ClockIcon, PersonIcon } from '@/icons'
import { MaintenanceTaskType } from '@/types'

interface MaintenanceTaskCardProps {
  task: MaintenanceTaskType
}

const MaintenanceTaskCard = ({ task }: MaintenanceTaskCardProps) => {
  const severityColors: { [key: string]: string } = {
    critical: '#F87171',
    high: '#FB923C',
    medium: '#FBBF24',
    low: '#60A5FA',
  }

  return (
    <div className='bg-[#1F293766] p-4 rounded-xl w-full flex flex-col items-start gap-3'>
      <div className='flex items-start gap-2'>
        <div className='flex flex-col items-start gap-2'>
          <h4 className='font-medium text-base text-white'>{task.title}</h4>
          <p className='text-sm text-[#9CA3AF] mb-2'>{task.description}</p>
          <div className='flex items-center gap-3 flex-wrap mb-2'>
            <div className='flex items-center gap-1'>
              <CalendarIcon fill='#6B7280' width={12} height={12} />
              <span className='font-normal text-xs text-[#6B7280]'>
                {task.createdAt}
              </span>
            </div>
            <div className='flex items-center gap-1'>
              <ClockIcon fill='#6B7280' width={12} height={12} />
              <span className='font-normal text-xs text-[#6B7280]'>
                {task.timeEstimate}
              </span>
            </div>
            <div className='flex items-center gap-1'>
              <PersonIcon fill='#6B7280' width={12} height={12} />
              <span className='font-normal text-xs text-[#6B7280]'>
                {task.assignedTo}
              </span>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-end gap-2'>
          <div
            className={`flex items-center justify-center px-2 py-1 bg-opacity-20 font-medium text-xs uppercase`}
            style={{
              backgroundColor: severityColors[task.severity] + '33',
              color: severityColors[task.severity],
              borderRadius: '4px',
            }}
          >
            {task.severity}
          </div>
          <div
            className={`flex items-center justify-center px-2 py-1 bg-opacity-20 font-medium text-xs uppercase`}
            style={{
              backgroundColor: task.color + '33',
              color: task.color,
              borderRadius: '4px',
            }}
          >
            {task.currentStatus}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceTaskCard
