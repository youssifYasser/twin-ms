import { BUILDING_DATA } from './buildingData'

// Camera data interfaces
export interface AIDetection {
  label: 'Person' | 'Vehicle'
  color: '#3BA091' | '#60A5FA'
  count: number
}

export interface CameraQuality {
  resolution: '720p' | '1080p' | '4K'
  fps: number
}

export interface LocationCameraType {
  id: string
  name: string
  floorId: string
  unitId?: string
  location: string
  isOnline: boolean
  quality: CameraQuality
  viewers: number
  lastActivity: string
  aiDetections: AIDetection[]
  isLiveFeed?: boolean
}

// Generate realistic camera data for each floor and unit
export const CAMERAS_DATA: LocationCameraType[] = []

// Camera name templates for different locations
const getCameraName = (floor: any, unit: any, index: number): string => {
  if (floor.id === 'basement') {
    const names = [
      'Parking Entrance',
      'Storage Area',
      'Utility Room',
      'Basement Corridor',
    ]
    return names[index] || `Basement Camera ${index + 1}`
  }

  if (floor.id === 'roof') {
    const names = [
      'Rooftop Overview',
      'HVAC Monitoring',
      'Roof Access',
      'Perimeter View',
    ]
    return names[index] || `Roof Camera ${index + 1}`
  }

  if (unit.id.includes('_all')) {
    const names = [
      'Floor Corridor',
      'Elevator Area',
      'Fire Exit',
      'Common Area',
      'Stairwell',
    ]
    return names[index] || `${floor.displayName} Common ${index + 1}`
  }

  const names = [
    'Main Entrance',
    'Living Room',
    'Kitchen View',
    'Balcony',
    'Bedroom',
  ]
  return names[index] || `${unit.displayName} Camera ${index + 1}`
}

// Generate AI detections
const generateAIDetections = (): AIDetection[] => {
  const detections: AIDetection[] = []

  // Randomly add persons (70% chance)
  if (Math.random() > 0.3) {
    detections.push({
      label: 'Person',
      color: '#3BA091',
      count: Math.floor(Math.random() * 5) + 1,
    })
  }

  // Randomly add vehicles (40% chance)
  if (Math.random() > 0.6) {
    detections.push({
      label: 'Vehicle',
      color: '#60A5FA',
      count: Math.floor(Math.random() * 3) + 1,
    })
  }

  return detections
}

// Generate camera quality specs
const generateQuality = (): CameraQuality => {
  const resolutions: CameraQuality['resolution'][] = ['720p', '1080p', '4K']
  const fpsList = [24, 30, 48, 60]

  return {
    resolution: resolutions[Math.floor(Math.random() * resolutions.length)],
    fps: fpsList[Math.floor(Math.random() * fpsList.length)],
  }
}

// Generate last activity timestamp
const generateLastActivity = (): string => {
  const activities = [
    'Just now',
    '1 min ago',
    '2 min ago',
    '5 min ago',
    '10 min ago',
    '15 min ago',
    '30 min ago',
    '1 hr ago',
    '2 hrs ago',
  ]
  return activities[Math.floor(Math.random() * activities.length)]
}

// Generate cameras for each floor and unit
BUILDING_DATA.forEach((floor) => {
  if (floor.id === 'basement' || floor.id === 'roof') {
    // Special floors - 3-4 cameras each
    const cameraCount = Math.floor(Math.random() * 2) + 3
    for (let i = 0; i < cameraCount; i++) {
      CAMERAS_DATA.push({
        id: `${floor.id}_camera_${i + 1}`,
        name: getCameraName(floor, null, i),
        floorId: floor.id,
        location: floor.displayName,
        isOnline: Math.random() > 0.1, // 90% online rate
        quality: generateQuality(),
        viewers: Math.floor(Math.random() * 5) + 1,
        lastActivity: generateLastActivity(),
        aiDetections: generateAIDetections(),
      })
    }
  } else {
    // Regular floors
    floor.units.forEach((unit) => {
      if (unit.id.includes('_all')) {
        // Floor-level common area cameras (2-3 cameras)
        const cameraCount = Math.floor(Math.random() * 2) + 2
        for (let i = 0; i < cameraCount; i++) {
          CAMERAS_DATA.push({
            id: `${floor.id}_${unit.id}_camera_${i + 1}`,
            name: getCameraName(floor, unit, i),
            floorId: floor.id,
            unitId: unit.id,
            location: `${floor.displayName} - Common Area`,
            isOnline: Math.random() > 0.1, // 90% online rate
            quality: generateQuality(),
            viewers: Math.floor(Math.random() * 8) + 1,
            lastActivity: generateLastActivity(),
            aiDetections: generateAIDetections(),
          })
        }
      } else {
        // Individual unit cameras (1-2 cameras per unit)
        const cameraCount = Math.floor(Math.random() * 2) + 1
        for (let i = 0; i < cameraCount; i++) {
          CAMERAS_DATA.push({
            id: `${floor.id}_${unit.id}_camera_${i + 1}`,
            name: getCameraName(floor, unit, i),
            floorId: floor.id,
            unitId: unit.id,
            location: unit.displayName,
            isOnline: Math.random() > 0.05, // 95% online rate for individual units
            quality: generateQuality(),
            viewers: Math.floor(Math.random() * 3) + 1,
            lastActivity: generateLastActivity(),
            aiDetections: generateAIDetections(),
          })
        }
      }
    })
  }
})

// Helper functions for filtering camera data
export const getCamerasForFilter = (
  selectedFloorId: string | null,
  selectedUnitId: string | null
): LocationCameraType[] => {
  // All floors - return all cameras
  if (selectedFloorId === 'all') {
    return CAMERAS_DATA
  }

  // All units in a specific floor
  if (selectedFloorId && selectedUnitId === 'all') {
    return CAMERAS_DATA.filter((camera) => camera.floorId === selectedFloorId)
  }

  // Specific unit
  if (selectedFloorId && selectedUnitId && selectedUnitId !== 'all') {
    return CAMERAS_DATA.filter(
      (camera) =>
        camera.floorId === selectedFloorId && camera.unitId === selectedUnitId
    )
  }

  return []
}

// Get camera statistics for the current filter
export const getCameraStatsForFilter = (
  selectedFloorId: string | null,
  selectedUnitId: string | null
) => {
  const cameras = getCamerasForFilter(selectedFloorId, selectedUnitId)
  const onlineCameras = cameras.filter((camera) => camera.isOnline)

  return {
    total: cameras.length,
    online: onlineCameras.length,
    offline: cameras.length - onlineCameras.length,
    totalViewers: cameras.reduce((sum, camera) => sum + camera.viewers, 0),
    totalDetections: {
      persons: cameras.reduce(
        (sum, camera) =>
          sum +
          camera.aiDetections
            .filter((d) => d.label === 'Person')
            .reduce((s, d) => s + d.count, 0),
        0
      ),
      vehicles: cameras.reduce(
        (sum, camera) =>
          sum +
          camera.aiDetections
            .filter((d) => d.label === 'Vehicle')
            .reduce((s, d) => s + d.count, 0),
        0
      ),
    },
  }
}

export default CAMERAS_DATA
