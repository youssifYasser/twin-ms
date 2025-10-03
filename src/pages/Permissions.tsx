import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  department: string
  permissions: string[]
  status: 'Active' | 'Inactive'
  lastLogin: string
}

interface AddUserFormData {
  firstName: string
  lastName: string
  email: string
  role: string
  department: string
  permissions: string[]
}

const Permissions = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Building Manager',
      department: 'Facilities',
      permissions: ['Full Access', 'User Management'],
      status: 'Active',
      lastLogin: '2024-01-15 09:30',
    },
    {
      id: '2',
      firstName: 'Mike',
      lastName: 'Chen',
      email: 'mike.chen@company.com',
      role: 'Security Chief',
      department: 'Security',
      permissions: ['Camera Access', 'Security Control'],
      status: 'Active',
      lastLogin: '2024-01-15 08:45',
    },
    {
      id: '3',
      firstName: 'David',
      lastName: 'Rodriguez',
      email: 'david.rodriguez@company.com',
      role: 'Maintenance Lead',
      department: 'Maintenance',
      permissions: ['Device Control', 'Maintenance Reports'],
      status: 'Active',
      lastLogin: '2024-01-14 16:20',
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Watson',
      email: 'emily.watson@company.com',
      role: 'IT Administrator',
      department: 'IT',
      permissions: ['System Control', 'Network Management'],
      status: 'Active',
      lastLogin: '2024-01-15 10:15',
    },
    {
      id: '5',
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james.wilson@company.com',
      role: 'Facility Coordinator',
      department: 'Facilities',
      permissions: ['Room Booking', 'Basic Reports'],
      status: 'Inactive',
      lastLogin: '2024-01-10 14:30',
    },
  ])

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [formData, setFormData] = useState<AddUserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Building Manager',
    department: 'Facilities',
    permissions: [],
  })

  const availablePermissions = [
    'Full Access',
    'User Management',
    'System Control',
    'Camera Access',
    'Device Control',
    'Reports',
  ]

  const handleInputChange = (field: keyof AddUserFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter((p) => p !== permission),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newUser: User = {
      id: Date.now().toString(),
      ...formData,
      status: 'Active',
      lastLogin: new Date()
        .toLocaleString('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        .replace(',', ''),
    }

    setUsers((prev) => [...prev, newUser])
    setIsAddUserDialogOpen(false)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'Building Manager',
      department: 'Facilities',
      permissions: [],
    })
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsAddUserDialogOpen(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getStatusColor = (status: string) => {
    return status === 'Active'
      ? 'text-teal-400 bg-teal-500/20'
      : 'text-red-400 bg-red-500/20'
  }

  useEffect(() => {
    if (isAddUserDialogOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isAddUserDialogOpen])

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-white'>User Permissions</h2>
        <button
          onClick={() => setIsAddUserDialogOpen(true)}
          className='bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer text-white font-medium transition-colors'
        >
          <i className='ri-user-add-line'></i>
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className='bg-slate-800 rounded-xl overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-slate-700'>
              <tr>
                <th className='text-left p-4 font-semibold text-white'>User</th>
                <th className='text-left p-4 font-semibold text-white'>Role</th>
                <th className='text-left p-4 font-semibold text-white'>
                  Department
                </th>
                <th className='text-left p-4 font-semibold text-white'>
                  Permissions
                </th>
                <th className='text-left p-4 font-semibold text-white'>
                  Status
                </th>
                <th className='text-left p-4 font-semibold text-white'>
                  Last Login
                </th>
                <th className='text-left p-4 font-semibold text-white'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className='border-t border-slate-700 hover:bg-slate-750 transition-colors'
                >
                  <td className='p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center font-semibold text-white'>
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                      <div>
                        <div className='font-semibold text-white'>
                          {user.firstName} {user.lastName}
                        </div>
                        <div className='text-sm text-slate-400'>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='p-4 text-sm text-white'>{user.role}</td>
                  <td className='p-4 text-sm text-slate-300'>
                    {user.department}
                  </td>
                  <td className='p-4'>
                    <div className='flex flex-wrap gap-1'>
                      {user.permissions.slice(0, 2).map((permission) => (
                        <span
                          key={permission}
                          className='text-xs bg-teal-500/20 text-teal-400 px-2 py-1 rounded'
                        >
                          {permission}
                        </span>
                      ))}
                      {user.permissions.length > 2 && (
                        <span className='text-xs bg-slate-600/20 text-slate-400 px-2 py-1 rounded'>
                          +{user.permissions.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className='p-4'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className='p-4 text-sm text-slate-400'>
                    {user.lastLogin}
                  </td>
                  <td className='p-4'>
                    <div className='flex gap-1'>
                      <button className='w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded cursor-pointer transition-colors'>
                        <i className='ri-edit-line text-sm text-white'></i>
                      </button>
                      <button className='w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded cursor-pointer transition-colors'>
                        <i className='ri-settings-3-line text-sm text-white'></i>
                      </button>
                      <button className='w-7 h-7 flex items-center justify-center bg-red-600 hover:bg-red-500 rounded cursor-pointer transition-colors'>
                        <i className='ri-delete-bin-line text-sm text-white'></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Dialog */}
      {isAddUserDialogOpen && (
        <div
          className='fixed inset-0 bg-black/50 dialog-backdrop flex items-center justify-center z-50'
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
            className='bg-slate-800 border border-slate-600 rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-semibold text-white'>Add New User</h3>
              <button
                onClick={() => setIsAddUserDialogOpen(false)}
                className='w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2 text-white'>
                    First Name
                  </label>
                  <input
                    type='text'
                    className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange('firstName', e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2 text-white'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange('lastName', e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2 text-white'>
                  Email
                </label>
                <input
                  type='email'
                  className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2 text-white'>
                    Role
                  </label>
                  <select
                    className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  >
                    <option value='Building Manager'>Building Manager</option>
                    <option value='Security Chief'>Security Chief</option>
                    <option value='Maintenance Lead'>Maintenance Lead</option>
                    <option value='IT Administrator'>IT Administrator</option>
                    <option value='Facility Coordinator'>
                      Facility Coordinator
                    </option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2 text-white'>
                    Department
                  </label>
                  <select
                    className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors'
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange('department', e.target.value)
                    }
                  >
                    <option value='Facilities'>Facilities</option>
                    <option value='Security'>Security</option>
                    <option value='Maintenance'>Maintenance</option>
                    <option value='IT'>IT</option>
                    <option value='Operations'>Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2 text-white'>
                  Permissions
                </label>
                <div className='grid grid-cols-2 gap-2'>
                  {availablePermissions.map((permission) => (
                    <label
                      key={permission}
                      className='flex items-center gap-2 cursor-pointer'
                    >
                      <input
                        type='checkbox'
                        className='w-4 h-4 text-teal-500 bg-slate-600 border-slate-500 rounded focus:ring-teal-500'
                        checked={formData.permissions.includes(permission)}
                        onChange={(e) =>
                          handlePermissionChange(permission, e.target.checked)
                        }
                      />
                      <span className='text-sm text-white'>{permission}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className='flex gap-3 mt-6'>
                <button
                  type='submit'
                  className='flex-1 bg-teal-500 hover:bg-teal-600 py-2 rounded-lg font-medium text-white cursor-pointer whitespace-nowrap transition-colors duration-200'
                >
                  Add User
                </button>
                <button
                  type='button'
                  onClick={() => setIsAddUserDialogOpen(false)}
                  className='flex-1 bg-slate-600 hover:bg-slate-500 py-2 rounded-lg font-medium text-white cursor-pointer whitespace-nowrap transition-colors duration-200'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Permissions
