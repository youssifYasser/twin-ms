import {
  AlertStatsCard,
  ActiveAlertCard,
  MaintenanceTaskCard,
  CreateTaskDialog,
} from '@/components/alerts'
import { Dropdown } from '@/components'
import { PlusIcon, RefreshIcon } from '@/icons'
import { useState, useMemo } from 'react'
import { useFilter } from '@/context/FilterContext'
import { useRealtimeData } from '@/context/RealtimeDataContext'
import { getFilteredAlerts, getFilteredAlertStats } from '@/utils/dataFilters'
import { BUILDING_DATA } from '@/data/buildingData'
import {
  MAINTENANCE_TASKS_DATA,
  LocationMaintenanceTaskType,
} from '@/data/alertsData'
import type { TaskFormData } from '@/components/alerts/CreateTaskDialog'
import type { AlertStatusType } from '@/types'

const AlertsMaintenance = () => {
  const [severityFilter, setSeverityFilter] = useState<string>('All')
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false)
  const [prefilledTaskData, setPrefilledTaskData] = useState<
    Partial<TaskFormData> | undefined
  >(undefined)
  // Add state for managing maintenance tasks
  const [allMaintenanceTasks, setAllMaintenanceTasks] = useState<
    LocationMaintenanceTaskType[]
  >(MAINTENANCE_TASKS_DATA)
  const { filterState } = useFilter()
  const { getModifiedStatistics } = useRealtimeData()

  // Action handlers for alert cards
  const handleCreateTask = (alertTitle: string) => {
    console.log('Creating maintenance task for alert:', alertTitle)

    // Find the alert to get its details
    const alert = filteredAlerts.find((a) => a.title === alertTitle)

    // Build location string from alert's floor and unit data
    const getLocationFromAlert = (alert: any) => {
      if (!alert) return ''

      // Find the floor data
      const floor = BUILDING_DATA.find((f) => f.id === alert.floorId)
      const floorName = floor?.displayName || alert.floorId

      if (alert.unitId && !alert.unitId.includes('_all')) {
        // Find the unit data for specific units
        const unit = floor?.units.find((u) => u.id === alert.unitId)
        const unitName = unit?.displayName || alert.unitId
        return `${floorName} - ${unitName}`
      }

      return floorName
    }

    // Prefill the form with alert data
    const prefilledData: Partial<TaskFormData> = {
      title: alertTitle,
      description: alert
        ? `Maintenance task created from alert: ${alert.description}`
        : `Maintenance task for ${alertTitle}`,
      location: getLocationFromAlert(alert),
      priority:
        alert?.severity === 'critical'
          ? 'CRITICAL'
          : alert?.severity === 'high'
          ? 'HIGH'
          : alert?.severity === 'medium'
          ? 'MEDIUM'
          : 'LOW',
      category:
        alert?.title?.toLowerCase().includes('hvac') ||
        alert?.title?.toLowerCase().includes('temperature') ||
        alert?.title?.toLowerCase().includes('cooling') ||
        alert?.title?.toLowerCase().includes('heating')
          ? 'HVAC'
          : alert?.title?.toLowerCase().includes('electrical') ||
            alert?.title?.toLowerCase().includes('power') ||
            alert?.title?.toLowerCase().includes('circuit')
          ? 'Electrical'
          : alert?.title?.toLowerCase().includes('security') ||
            alert?.title?.toLowerCase().includes('access') ||
            alert?.title?.toLowerCase().includes('door')
          ? 'Security'
          : alert?.title?.toLowerCase().includes('fire') ||
            alert?.title?.toLowerCase().includes('smoke') ||
            alert?.title?.toLowerCase().includes('alarm')
          ? 'Fire Safety'
          : alert?.title?.toLowerCase().includes('elevator') ||
            alert?.title?.toLowerCase().includes('lift')
          ? 'Elevator'
          : alert?.title?.toLowerCase().includes('plumbing') ||
            alert?.title?.toLowerCase().includes('water') ||
            alert?.title?.toLowerCase().includes('leak')
          ? 'Plumbing'
          : 'General',
      assignedTo:
        alert?.title?.toLowerCase().includes('hvac') ||
        alert?.title?.toLowerCase().includes('temperature') ||
        alert?.title?.toLowerCase().includes('cooling') ||
        alert?.title?.toLowerCase().includes('heating')
          ? 'HVAC Technician'
          : alert?.title?.toLowerCase().includes('electrical') ||
            alert?.title?.toLowerCase().includes('power')
          ? 'Electrical Team'
          : alert?.title?.toLowerCase().includes('security')
          ? 'Security Team'
          : alert?.title?.toLowerCase().includes('fire') ||
            alert?.title?.toLowerCase().includes('smoke')
          ? 'Fire Safety Inspector'
          : alert?.title?.toLowerCase().includes('elevator')
          ? 'Elevator Maintenance Co.'
          : 'Maintenance Team',
      status: alert?.severity === 'critical' ? 'SCHEDULED' : 'PENDING',
      estimatedDuration:
        alert?.severity === 'critical'
          ? '2-4 hours'
          : alert?.severity === 'high'
          ? '1-2 hours'
          : '30-60 minutes',
      safetyRequirements: {
        ppeRequired: true, // Always require PPE for maintenance tasks
        lockoutTagout: Boolean(
          alert?.title?.toLowerCase().includes('electrical') ||
            alert?.title?.toLowerCase().includes('power') ||
            alert?.title?.toLowerCase().includes('hvac')
        ),
        confinedSpace: false,
        hotWorkPermit: Boolean(
          alert?.title?.toLowerCase().includes('fire') ||
            alert?.title?.toLowerCase().includes('electrical')
        ),
        heightWork: Boolean(
          alert?.title?.toLowerCase().includes('elevator') ||
            alert?.title?.toLowerCase().includes('hvac')
        ),
        electricalSafety: Boolean(
          alert?.title?.toLowerCase().includes('electrical') ||
            alert?.title?.toLowerCase().includes('power') ||
            alert?.title?.toLowerCase().includes('circuit')
        ),
      },
    }

    setPrefilledTaskData(prefilledData)
    setIsCreateTaskDialogOpen(true)
  }

  const handleAddTask = () => {
    console.log('Adding new general maintenance task')
    setPrefilledTaskData(undefined) // No prefilled data for general tasks
    setIsCreateTaskDialogOpen(true)
  }

  const handleViewDetails = (alertId: string) => {
    console.log('Viewing details for alert:', alertId)
    // Implement detail view logic here
    // Could open a modal, navigate to details page, etc.
  }

  const handleAcknowledge = (alertId: string) => {
    console.log('Acknowledging alert:', alertId)
    // Implement acknowledgment logic here
    // Could update alert status, send to server, etc.
  }

  const handleTaskSubmit = (taskData: TaskFormData) => {
    console.log('Creating new task:', taskData)

    // Convert TaskFormData to LocationMaintenanceTaskType
    const newTask: LocationMaintenanceTaskType = {
      title: taskData.title,
      description: taskData.description,
      createdAt: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      assignedTo: taskData.assignedTo,
      timeEstimate: taskData.estimatedDuration || '1 hour',
      color: getTaskColorByPriority(taskData.priority),
      currentStatus: taskData.status.toLowerCase().replace(' ', '') as any,
      severity: priorityToSeverity(taskData.priority),
      floorId: extractFloorIdFromLocation(taskData.location),
      unitId: extractUnitIdFromLocation(taskData.location),
    }

    // Add the new task to the beginning of the tasks list
    setAllMaintenanceTasks((prevTasks) => [newTask, ...prevTasks])
  }

  // Helper functions for task conversion
  const getTaskColorByPriority = (
    priority: TaskFormData['priority']
  ): string => {
    switch (priority) {
      case 'CRITICAL':
        return '#F87171' // Red
      case 'HIGH':
        return '#F97316' // Orange
      case 'MEDIUM':
        return '#9CA3AF' // Gray
      case 'LOW':
        return '#60A5FA' // Blue
      default:
        return '#9CA3AF'
    }
  }

  const priorityToSeverity = (
    priority: TaskFormData['priority']
  ): AlertStatusType => {
    switch (priority) {
      case 'CRITICAL':
        return 'critical'
      case 'HIGH':
        return 'high'
      case 'MEDIUM':
        return 'medium'
      case 'LOW':
        return 'low'
      default:
        return 'medium'
    }
  }

  const extractFloorIdFromLocation = (location: string): string => {
    // Try to match patterns like "Floor 3", "3rd Floor", etc.
    const floorMatch = location.match(
      /floor\s*(\d+)|(\d+)(?:st|nd|rd|th)?\s*floor/i
    )
    if (floorMatch) {
      const floorNumber = floorMatch[1] || floorMatch[2]
      return `floor_${floorNumber}`
    }

    // Check for special cases
    if (location.toLowerCase().includes('basement')) return 'basement'
    if (location.toLowerCase().includes('roof')) return 'roof'
    if (
      location.toLowerCase().includes('all') ||
      location.toLowerCase().includes('building')
    )
      return 'all'

    // Default to all if can't determine
    return 'all'
  }

  const extractUnitIdFromLocation = (location: string): string | undefined => {
    // If location contains " - " it likely has unit information
    if (location.includes(' - ')) {
      const parts = location.split(' - ')
      if (parts.length > 1) {
        const unitPart = parts[1].trim()
        const floorPart = parts[0].trim()

        // Extract floor number from first part
        const floorMatch = floorPart.match(
          /floor\s*(\d+)|(\d+)(?:st|nd|rd|th)?\s*floor/i
        )

        if (floorMatch) {
          const floorNumber = floorMatch[1] || floorMatch[2]
          const floorId = `floor_${floorNumber}`

          // Check for specific unit types
          if (unitPart.toLowerCase().includes('pumps room')) {
            return `${floorId}_pumps_room`
          }

          // Check for "All Units"
          if (unitPart.toLowerCase().includes('all units')) {
            return `${floorId}_all`
          }

          // Check for unit numbers like "Unit 501", "Unit 302", etc.
          const unitMatch = unitPart.match(/unit\s*(\d+)/i)
          if (unitMatch) {
            const unitNumber = unitMatch[1]
            // Convert unit number to unit index (e.g., 501 -> 1, 502 -> 2)
            const lastDigit = parseInt(unitNumber.slice(-1))
            if (lastDigit >= 1 && lastDigit <= 5) {
              return `${floorId}_unit_${lastDigit}`
            }
          }

          // Default to unit 1 for unrecognized unit patterns
          return `${floorId}_unit_1`
        }
      }
    }

    // Check if it's a floor-wide task
    if (
      location.toLowerCase().includes('all') ||
      location.toLowerCase().includes('entire')
    ) {
      const floorId = extractFloorIdFromLocation(location)
      if (floorId !== 'all') {
        return `${floorId}_all`
      }
    }

    return undefined
  }

  const handleCloseDialog = () => {
    setIsCreateTaskDialogOpen(false)
    setPrefilledTaskData(undefined)
  }

  // Get filtered maintenance tasks first (needed for alert stats)
  const filteredMaintenanceTasks = useMemo(() => {
    // Filter the allMaintenanceTasks state based on floor/unit selection
    let filteredTasks = allMaintenanceTasks

    // All floors - return all tasks
    if (filterState.selectedFloorId === 'all') {
      return filteredTasks
    }

    // Specific floor
    if (filterState.selectedFloorId && filterState.selectedUnitId === 'all') {
      return filteredTasks.filter(
        (task) =>
          task.floorId === filterState.selectedFloorId || task.floorId === 'all' // Include building-wide tasks
      )
    }

    // Specific unit
    if (
      filterState.selectedFloorId &&
      filterState.selectedUnitId &&
      filterState.selectedUnitId !== 'all'
    ) {
      return filteredTasks.filter(
        (task) =>
          (task.floorId === filterState.selectedFloorId &&
            task.unitId === filterState.selectedUnitId) ||
          (task.floorId === filterState.selectedFloorId &&
            task.unitId?.includes('_all')) || // Include floor-level tasks
          task.floorId === 'all' // Include building-wide tasks
      )
    }

    return filteredTasks
  }, [
    allMaintenanceTasks,
    filterState.selectedFloorId,
    filterState.selectedUnitId,
  ])

  // Get filtered data based on current floor/unit selection
  const alertsStats = useMemo(() => {
    const baseStats = getFilteredAlertStats({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })

    // Update the maintenance tasks count to reflect current filtered tasks
    const maintenanceTasksIndex = baseStats.findIndex(
      (stat) => stat.title === 'Maintenance Tasks'
    )
    if (maintenanceTasksIndex !== -1) {
      baseStats[maintenanceTasksIndex] = {
        ...baseStats[maintenanceTasksIndex],
        value: filteredMaintenanceTasks.length.toString(),
      }
    }

    // Apply real-time modifications to stats
    const modifiedStats = getModifiedStatistics(baseStats)

    // AlertStatsCard expects a color property, so add it
    return modifiedStats.map((stat) => ({
      ...stat,
      color: '#1F2937', // Default card background color
    }))
  }, [
    filterState.selectedFloorId,
    filterState.selectedUnitId,
    filteredMaintenanceTasks.length,
  ])

  const filteredAlerts = useMemo(() => {
    return getFilteredAlerts(
      {
        selectedFloorId: filterState.selectedFloorId,
        selectedUnitId: filterState.selectedUnitId,
      },
      severityFilter
    )
  }, [filterState.selectedFloorId, filterState.selectedUnitId, severityFilter])

  // Dropdown options for severity filter
  const severityOptions = ['All', 'Critical', 'High', 'Medium', 'Low']

  return (
    <div className='space-y-6'>
      {/* Display current filter information */}
      {filterState.selectedFloor !== 'All Floors' && (
        <div className='bg-bg-card backdrop-blur-24 p-4 rounded-lg border border-primary-border'>
          <p className='text-white text-center text-lg'>
            Showing alerts for:{' '}
            <span className='font-bold text-active-page'>
              {filterState.selectedFloor}
              {filterState.selectedUnit !== 'All Units' &&
                ` - ${filterState.selectedUnit}`}
            </span>
          </p>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {alertsStats.map((stat, index) => {
          return <AlertStatsCard key={index} statisticsItem={stat} />
        })}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 font-roboto'>
        <div className='col-span-2 bg-bg-card backdrop-blur-24 p-6 rounded-none flex flex-col gap-6 h-fit'>
          <div className='flex items-center justify-between'>
            <h3 className='text-xl font-bold text-white'>Active Alerts</h3>
            {/* Severity (alert status) dropdown Filter and Refresh button */}
            <div className='flex items-stretch gap-2'>
              <Dropdown
                options={severityOptions}
                value={severityFilter}
                onChange={(value) => setSeverityFilter(value)}
                placeholder='Filter by severity'
                className='rounded-lg border border-[#4B5563] bg-[#1F2937]'
              />
              <button
                onClick={() => setSeverityFilter('All')}
                className='flex items-center justify-center p-2 bg-[#1F2937] rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1F2937BB] transition-colors duration-200'
                title='Refresh alerts'
              >
                <RefreshIcon width={16} height={16} fill='currentColor' />
              </button>
            </div>
          </div>
          <div className='flex flex-col items-start gap-4 w-full '>
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, index) => (
                <ActiveAlertCard
                  key={index}
                  alert={alert}
                  onCreateTask={handleCreateTask}
                  onViewDetails={handleViewDetails}
                  onAcknowledge={handleAcknowledge}
                />
              ))
            ) : (
              <div className='flex items-center justify-center py-8 text-[#9CA3AF]'>
                <p>No alerts found for the selected criteria.</p>
              </div>
            )}
          </div>
        </div>

        <div className='bg-bg-card backdrop-blur-24 p-6 rounded-none flex flex-col gap-6 h-fit'>
          <div className='flex items-center justify-between'>
            <h3 className='font-bold text-white text-lg'>Maintenance Tasks</h3>
            <button
              onClick={handleAddTask}
              className='flex items-center justify-center gap-2 bg-[#37988A] hover:bg-[#37988ABB] px-4 py-2 rounded-lg transition-colors duration-200 text-white'
              title='Add new maintenance task'
            >
              <PlusIcon width={16} height={16} />
              Add Task
            </button>
          </div>
          <div className='flex flex-col gap-4 items-start w-full'>
            {filteredMaintenanceTasks.map((task, index) => (
              <MaintenanceTaskCard key={index} task={task} />
            ))}
          </div>
        </div>
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        isOpen={isCreateTaskDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleTaskSubmit}
        prefilledData={prefilledTaskData}
      />
    </div>
  )
}

export default AlertsMaintenance
