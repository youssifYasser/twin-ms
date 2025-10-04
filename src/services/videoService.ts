// Video service for camera feeds
export interface VideoFeed {
  id: string
  url: string
  type: 'mp4' | 'webm' | 'placeholder'
  duration?: number
}

// Sample video URLs - these can be replaced with actual video files
const SAMPLE_VIDEOS: VideoFeed[] = [
  {
    id: 'lobby-main',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'mp4',
    duration: 15,
  },
  {
    id: 'corridor-east',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    type: 'mp4',
    duration: 15,
  },
  {
    id: 'parking-level1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    type: 'mp4',
    duration: 60,
  },
  {
    id: 'entrance-south',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    type: 'mp4',
    duration: 15,
  },
  {
    id: 'elevator-bank',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    type: 'mp4',
    duration: 15,
  },
  {
    id: 'security-desk',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'mp4',
    duration: 15,
  },
  {
    id: 'roof-access',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    type: 'mp4',
    duration: 15,
  },
  {
    id: 'stairwell-emergency',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    type: 'mp4',
    duration: 60,
  },
]

// Get video feed for a specific camera
export const getVideoFeedForCamera = (cameraId: string): VideoFeed => {
  // First try to find a matching sample video
  const video = SAMPLE_VIDEOS.find((v) => v.id === cameraId)
  if (video) return video

  // For demonstration, cycle through available videos based on camera ID hash
  const hash = cameraId
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const videoIndex = hash % SAMPLE_VIDEOS.length
  const selectedVideo = SAMPLE_VIDEOS[videoIndex]

  return {
    ...selectedVideo,
    id: cameraId,
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
