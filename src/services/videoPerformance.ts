// Performance monitoring for video loading
export class VideoPerformanceMonitor {
  private static loadedVideos = new Set<string>()
  private static loadingStartTimes = new Map<string, number>()

  static startLoading(videoId: string) {
    this.loadingStartTimes.set(videoId, Date.now())
    console.log(`📹 Started loading video: ${videoId}`)
  }

  static finishLoading(videoId: string) {
    const startTime = this.loadingStartTimes.get(videoId)
    if (startTime) {
      const loadTime = Date.now() - startTime
      this.loadedVideos.add(videoId)
      console.log(`✅ Video ${videoId} loaded in ${loadTime}ms`)
      this.loadingStartTimes.delete(videoId)
    }
  }

  static getStats() {
    return {
      totalLoaded: this.loadedVideos.size,
      currentlyLoading: this.loadingStartTimes.size,
      loadedVideoIds: Array.from(this.loadedVideos),
    }
  }

  static logStats() {
    const stats = this.getStats()
    console.log('📊 Video Loading Stats:', stats)
  }
}

// Hook for monitoring video performance
export const useVideoPerformance = (videoId: string) => {
  const startLoading = () => VideoPerformanceMonitor.startLoading(videoId)
  const finishLoading = () => VideoPerformanceMonitor.finishLoading(videoId)

  return { startLoading, finishLoading }
}
