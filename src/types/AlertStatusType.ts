import { IconComponent } from './IconType'

export type AlertStatusType = 'critical' | 'high' | 'medium' | 'low'

export type ActiveAlertType = {
  title: string
  description: string
  severity: AlertStatusType
  time: string
  location: string
  responsibleBy: string
  currentStatus: string
  icon: IconComponent
  color: string
}

export type MaintenanceTaskType = {
  title: string
  description: string
  severity: AlertStatusType
  currentStatus: string
  assignedTo: string
  createdAt: string
  color: string
  timeEstimate: string
}
