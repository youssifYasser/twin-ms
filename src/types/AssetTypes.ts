export type AssetType =
  | 'Lighting'
  | 'HVAC'
  | 'Security'
  | 'Elevator'
  | 'Safety'
  | 'Network'
export type AssetStatus = 'Active' | 'Maintenance' | 'Inactive'
export type WarrantyStatus = 'Active' | 'Expiring Soon' | 'Expired'

export interface Asset {
  id: string
  name: string
  unit: string
  floor: number
  type: AssetType
  provider: string
  warrantyExpiry: string
  warrantyStatus: WarrantyStatus
  status: AssetStatus
  cost: number
  serialNumber: string
  installDate: string
  notes?: string
}

export interface AssetFilters {
  name: string
  unit: string
  floor: string
  type: string
  provider: string
  warranty: string
  sortBy: string
}

export interface AddAssetFormData {
  name: string
  unit: string
  floor: number | ''
  type: AssetType | ''
  provider: string
  warrantyExpiry: string
  serialNumber: string
  installDate: string
  cost: number | ''
  status: AssetStatus
  notes: string
}
