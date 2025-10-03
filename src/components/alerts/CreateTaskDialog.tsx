import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface CreateTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: TaskFormData) => void
  prefilledData?: Partial<TaskFormData>
}

export interface TaskFormData {
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'PENDING' | 'SCHEDULED' | 'IN PROGRESS' | 'COMPLETED' | 'OVERDUE'
  category:
    | 'HVAC'
    | 'Electrical'
    | 'Plumbing'
    | 'Security'
    | 'Fire Safety'
    | 'Elevator'
    | 'General'
  dueDate: string
  estimatedDuration: string
  assignedTo: string
  location: string
  estimatedCost: number
  recurring: 'No' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually'
  requiredTools: string
  safetyRequirements: {
    ppeRequired: boolean
    lockoutTagout: boolean
    confinedSpace: boolean
    hotWorkPermit: boolean
    heightWork: boolean
    electricalSafety: boolean
  }
  additionalNotes: string
}

const CreateTaskDialog = ({
  isOpen,
  onClose,
  onSubmit,
  prefilledData,
}: CreateTaskDialogProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'PENDING',
    category: 'General',
    dueDate: '',
    estimatedDuration: '',
    assignedTo: 'Maintenance Team',
    location: '',
    estimatedCost: 0,
    recurring: 'No',
    requiredTools: '',
    safetyRequirements: {
      ppeRequired: false,
      lockoutTagout: false,
      confinedSpace: false,
      hotWorkPermit: false,
      heightWork: false,
      electricalSafety: false,
    },
    additionalNotes: '',
  })

  // Update form data when prefilledData changes
  useEffect(() => {
    if (isOpen) {
      if (prefilledData) {
        // Apply prefilled data from alert
        setFormData((prev) => ({
          ...prev,
          ...prefilledData,
          safetyRequirements: {
            ...prev.safetyRequirements,
            ...prefilledData.safetyRequirements,
          },
        }))
      } else {
        // Reset to default values when no prefilled data
        setFormData({
          title: '',
          description: '',
          priority: 'MEDIUM',
          status: 'PENDING',
          category: 'General',
          dueDate: '',
          estimatedDuration: '',
          assignedTo: 'Maintenance Team',
          location: '',
          estimatedCost: 0,
          recurring: 'No',
          requiredTools: '',
          safetyRequirements: {
            ppeRequired: false,
            lockoutTagout: false,
            confinedSpace: false,
            hotWorkPermit: false,
            heightWork: false,
            electricalSafety: false,
          },
          additionalNotes: '',
        })
      }
    }
  }, [prefilledData, isOpen])

  const handleInputChange = (field: keyof TaskFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSafetyRequirementChange = (
    requirement: keyof TaskFormData['safetyRequirements'],
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      safetyRequirements: {
        ...prev.safetyRequirements,
        [requirement]: checked,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 dialog-backdrop flex items-center justify-center z-50'
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
      }}
    >
      <div
        className='bg-slate-800 border border-slate-600 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-xl font-semibold text-white'>
            Add New Maintenance Task
          </h3>
          <button
            onClick={onClose}
            className='w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2 text-white'>
              Task Title
            </label>
            <input
              type='text'
              placeholder='Enter task title...'
              className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2 text-white'>
              Description
            </label>
            <textarea
              rows={3}
              placeholder='Describe the maintenance task...'
              className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 resize-none transition-colors'
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
            />
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2 text-white'>
                Priority
              </label>
              <select
                className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
                value={formData.priority}
                onChange={(e) =>
                  handleInputChange(
                    'priority',
                    e.target.value as TaskFormData['priority']
                  )
                }
              >
                <option value='LOW'>LOW</option>
                <option value='MEDIUM'>MEDIUM</option>
                <option value='HIGH'>HIGH</option>
                <option value='CRITICAL'>CRITICAL</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2 text-white'>
                Status
              </label>
              <select
                className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
                value={formData.status}
                onChange={(e) =>
                  handleInputChange(
                    'status',
                    e.target.value as TaskFormData['status']
                  )
                }
              >
                <option value='PENDING'>PENDING</option>
                <option value='SCHEDULED'>SCHEDULED</option>
                <option value='IN PROGRESS'>IN PROGRESS</option>
                <option value='COMPLETED'>COMPLETED</option>
                <option value='OVERDUE'>OVERDUE</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2 text-white'>
                Category
              </label>
              <select
                className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
                value={formData.category}
                onChange={(e) =>
                  handleInputChange(
                    'category',
                    e.target.value as TaskFormData['category']
                  )
                }
              >
                <option value='HVAC'>HVAC</option>
                <option value='Electrical'>Electrical</option>
                <option value='Plumbing'>Plumbing</option>
                <option value='Security'>Security</option>
                <option value='Fire Safety'>Fire Safety</option>
                <option value='Elevator'>Elevator</option>
                <option value='General'>General</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2 text-white'>
                Due Date
              </label>
              <input
                type='date'
                className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2 text-white'>
                Estimated Duration
              </label>
              <input
                type='text'
                placeholder='e.g., 2 hours, 1 day'
                className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
                value={formData.estimatedDuration}
                onChange={(e) =>
                  handleInputChange('estimatedDuration', e.target.value)
                }
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2 text-white'>
                Assigned To
              </label>
              <select
                className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
                value={formData.assignedTo}
                onChange={(e) =>
                  handleInputChange('assignedTo', e.target.value)
                }
              >
                <option value='Maintenance Team'>Maintenance Team</option>
                <option value='HVAC Technician'>HVAC Technician</option>
                <option value='Electrical Team'>Electrical Team</option>
                <option value='Security Team'>Security Team</option>
                <option value='Fire Safety Inspector'>
                  Fire Safety Inspector
                </option>
                <option value='Elevator Maintenance Co.'>
                  Elevator Maintenance Co.
                </option>
                <option value='External Contractor'>External Contractor</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2 text-white'>
                Location
              </label>
              <input
                type='text'
                placeholder='Floor, Zone, Room...'
                className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2 text-white'>
                Estimated Cost (SAR)
              </label>
              <input
                type='number'
                min='0'
                step='0.01'
                placeholder='0.00'
                className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
                value={formData.estimatedCost}
                onChange={(e) =>
                  handleInputChange(
                    'estimatedCost',
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2 text-white'>
                Recurring Task
              </label>
              <select
                className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
                value={formData.recurring}
                onChange={(e) =>
                  handleInputChange(
                    'recurring',
                    e.target.value as TaskFormData['recurring']
                  )
                }
              >
                <option value='No'>No</option>
                <option value='Daily'>Daily</option>
                <option value='Weekly'>Weekly</option>
                <option value='Monthly'>Monthly</option>
                <option value='Quarterly'>Quarterly</option>
                <option value='Annually'>Annually</option>
              </select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2 text-white'>
              Required Tools/Materials
            </label>
            <textarea
              rows={2}
              placeholder='List any special tools or materials needed...'
              className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 resize-none transition-colors'
              value={formData.requiredTools}
              onChange={(e) =>
                handleInputChange('requiredTools', e.target.value)
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2 text-white'>
              Safety Requirements
            </label>
            <div className='grid grid-cols-3 gap-2'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  className='w-4 h-4 text-teal-500 bg-slate-600 border-slate-500 rounded focus:ring-teal-500'
                  checked={formData.safetyRequirements.ppeRequired}
                  onChange={(e) =>
                    handleSafetyRequirementChange(
                      'ppeRequired',
                      e.target.checked
                    )
                  }
                />
                <span className='text-sm text-white'>PPE Required</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  className='w-4 h-4 text-teal-500 bg-slate-600 border-slate-500 rounded focus:ring-teal-500'
                  checked={formData.safetyRequirements.lockoutTagout}
                  onChange={(e) =>
                    handleSafetyRequirementChange(
                      'lockoutTagout',
                      e.target.checked
                    )
                  }
                />
                <span className='text-sm text-white'>Lockout/Tagout</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  className='w-4 h-4 text-teal-500 bg-slate-600 border-slate-500 rounded focus:ring-teal-500'
                  checked={formData.safetyRequirements.confinedSpace}
                  onChange={(e) =>
                    handleSafetyRequirementChange(
                      'confinedSpace',
                      e.target.checked
                    )
                  }
                />
                <span className='text-sm text-white'>Confined Space</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  className='w-4 h-4 text-teal-500 bg-slate-600 border-slate-500 rounded focus:ring-teal-500'
                  checked={formData.safetyRequirements.hotWorkPermit}
                  onChange={(e) =>
                    handleSafetyRequirementChange(
                      'hotWorkPermit',
                      e.target.checked
                    )
                  }
                />
                <span className='text-sm text-white'>Hot Work Permit</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  className='w-4 h-4 text-teal-500 bg-slate-600 border-slate-500 rounded focus:ring-teal-500'
                  checked={formData.safetyRequirements.heightWork}
                  onChange={(e) =>
                    handleSafetyRequirementChange(
                      'heightWork',
                      e.target.checked
                    )
                  }
                />
                <span className='text-sm text-white'>Height Work</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  className='w-4 h-4 text-teal-500 bg-slate-600 border-slate-500 rounded focus:ring-teal-500'
                  checked={formData.safetyRequirements.electricalSafety}
                  onChange={(e) =>
                    handleSafetyRequirementChange(
                      'electricalSafety',
                      e.target.checked
                    )
                  }
                />
                <span className='text-sm text-white'>Electrical Safety</span>
              </label>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2 text-white'>
              Additional Notes
            </label>
            <textarea
              rows={3}
              placeholder='Any additional information or special instructions...'
              className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 resize-none transition-colors'
              value={formData.additionalNotes}
              onChange={(e) =>
                handleInputChange('additionalNotes', e.target.value)
              }
            />
          </div>

          <div className='flex gap-3 mt-6'>
            <button
              type='submit'
              className='flex-1 bg-teal-500 hover:bg-teal-600 py-2 rounded-lg font-medium text-white cursor-pointer whitespace-nowrap transition-colors duration-200'
            >
              Create Task
            </button>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 bg-slate-600 hover:bg-slate-500 py-2 rounded-lg font-medium text-white cursor-pointer whitespace-nowrap transition-colors duration-200'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTaskDialog
