import { Edit, MoreHorizontal } from 'lucide-react'

interface AutomationRule {
  id: string
  name: string
  status: 'active' | 'scheduled' | 'monitoring'
  condition: string
  action: string
  metric: string
  statusColor: string
  bulletColor: string
}

interface AutomationRuleCardProps {
  rule: AutomationRule
  onEdit?: (id: string) => void
  onMore?: (id: string) => void
}

const AutomationRuleCard = ({
  rule,
  onEdit,
  onMore,
}: AutomationRuleCardProps) => {
  const getStatusColor = () => {
    switch (rule.status) {
      case 'active':
        return 'bg-teal-500/20 text-teal-400'
      case 'scheduled':
        return 'bg-orange-500/20 text-orange-400'
      case 'monitoring':
        return 'bg-slate-600/20 text-slate-400'
      default:
        return 'bg-slate-600/20 text-slate-400'
    }
  }

  const getBulletColor = () => {
    switch (rule.status) {
      case 'active':
        return '#4ADE80'
      case 'scheduled':
        return '#FB923C'
      case 'monitoring':
        return '#6B7280'
      default:
        return '#6B7280'
    }
  }

  return (
    <div className='border-[#37415180] bg-[#1F293766] border  p-4 rounded-lg flex items-center justify-between transition-all duration-300 hover:border-slate-600'>
      <div className='flex-1'>
        <div className='flex items-center gap-3'>
          <div
            className='w-3 h-3 rounded-full'
            style={{ backgroundColor: getBulletColor() }}
          />
          <h4 className='font-semibold text-white'>{rule.name}</h4>
          <span
            className={`px-2 py-1 rounded-full text-xs ${getStatusColor()}`}
          >
            {rule.status}
          </span>
        </div>
        <div className='mt-2 text-sm text-slate-300'>
          <strong>If:</strong> {rule.condition} → <strong>Then:</strong>{' '}
          {rule.action}
        </div>
        <div className='mt-1 text-xs text-teal-400'>{rule.metric}</div>
      </div>
      <div className='flex items-center gap-2'>
        <button
          onClick={() => onEdit?.(rule.id)}
          className='w-8 h-8 flex items-center justify-center bg-slate-600 hover:bg-slate-500 rounded-lg cursor-pointer transition-colors'
          title='Edit Rule'
        >
          <Edit className='w-4 h-4 text-slate-400 hover:text-white' />
        </button>
        <button
          onClick={() => onMore?.(rule.id)}
          className='w-8 h-8 flex items-center justify-center bg-slate-600 hover:bg-slate-500 rounded-lg cursor-pointer transition-colors'
          title='More Options'
        >
          <MoreHorizontal className='w-4 h-4 text-slate-400 hover:text-white' />
        </button>
      </div>
    </div>
  )
}

export default AutomationRuleCard
