export type PresetType = {
  id: number
  name: string
  description: string
}

export type DeviceType =
  | 'Lighting'
  | 'HVAC'
  | 'Security'
  | 'Elevators'
  | 'Pumps'

export type DeviceControlItemType = {
  id: string
  name: string
  floor: string
  progress: number
  maxPower: string
  isOn: boolean
  deviceType: DeviceType
  hasMalfunction?: boolean // Add malfunction status
}

export type DeviceControlType = {
  name: string
  progress: number
  totalPower: string
  icon: React.FC<React.SVGProps<SVGSVGElement>>
}

export type PresetDataType = {
  [key in DeviceType]: {
    [deviceId: string]: {
      progress: number
      isOn: boolean
    }
  }
}
