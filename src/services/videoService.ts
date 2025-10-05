// Video service for camera feeds
export interface VideoFeed {
  id: string
  url: string
  type: 'mp4' | 'webm' | 'placeholder'
  duration?: number
}

// Sample video URLs - using local videos from public/videos folder for offline functionality
// Video assignment logic:
// - Security (1), (2), (4): Entrances and common areas
// - Security (3): Meeting rooms and units
// - Security (5): Pumps rooms
const SAMPLE_VIDEOS: VideoFeed[] = [
  {
    id: 'lobby-main',
    url: '/videos/Security  (1).mp4', // Entrance - main lobby
    type: 'mp4',
    duration: 15,
  },
  {
    id: 'corridor-east',
    url: '/videos/Security  (2).mp4', // Entrance - corridor
    type: 'mp4',
    duration: 15,
  },
  {
    id: 'parking-level1',
    url: '/videos/Security  (4).mp4', // Entrance - parking area
    type: 'mp4',
    duration: 60,
  },
  {
    id: 'entrance-south',
    url: '/videos/Security  (1).mp4', // Entrance - south entrance
    type: 'mp4',
    duration: 15,
  },
  {
    id: 'elevator-bank',
    url: '/videos/Security  (2).mp4', // Common area - elevator bank
    type: 'mp4',
    duration: 15,
  },
  {
    id: 'security-desk',
    url: '/videos/Security  (4).mp4', // Common area - security desk
    type: 'mp4',
    duration: 15,
  },
  {
    id: 'roof-access',
    url: '/videos/Security  (4).mp4', // Entrance - roof access
    type: 'mp4',
    duration: 15,
  },
  {
    id: 'stairwell-emergency',
    url: '/videos/Security  (2).mp4', // Common area - emergency stairwell
    type: 'mp4',
    duration: 60,
  },
]

// Get video feed for a specific camera
export const getVideoFeedForCamera = (cameraId: string): VideoFeed => {
  // First try to find a matching sample video
  const video = SAMPLE_VIDEOS.find((v) => v.id === cameraId)
  if (video) return video

  // Assign videos based on camera location type
  let videoPath = '/videos/Security  (1).mp4' // Default for entrances

  // Check camera ID patterns to determine location type
  if (cameraId.includes('pumps') || cameraId.includes('pump')) {
    // Pumps rooms get Security (5)
    videoPath = '/videos/Security  (5).mp4'
  } else if (
    cameraId.includes('unit') ||
    cameraId.includes('meeting') ||
    cameraId.includes('room') ||
    cameraId.includes('office')
  ) {
    // Meeting rooms and units get Security (3)
    videoPath = '/videos/Security  (3).mp4'
  } else {
    // Entrances and common areas get Security (1), (2), or (4)
    const entranceVideos = [
      '/videos/Security  (1).mp4',
      '/videos/Security  (2).mp4',
      '/videos/Security  (4).mp4',
    ]
    const hash = cameraId
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const videoIndex = hash % entranceVideos.length
    videoPath = entranceVideos[videoIndex]
  }

  return {
    id: cameraId,
    url: videoPath,
    type: 'mp4',
    duration: 15,
  }
}

// Get all available video feeds
export const getAllVideoFeeds = (): VideoFeed[] => SAMPLE_VIDEOS

// Check if video URL is accessible
export const isVideoAccessible = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}
