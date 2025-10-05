import React, { useRef, useEffect, useState, useCallback } from 'react'
import { VideoFeed } from '@/services/videoService'

interface VideoPlayerProps {
  videoFeed: VideoFeed
  isVisible: boolean
  className?: string
  autoPlay?: boolean
  muted?: boolean
  controls?: boolean
  lazyLoad?: boolean
  enableVideo?: boolean // Simple prop to control video playback
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoFeed,
  isVisible,
  className = '',
  autoPlay = true,
  muted = true,
  controls = false,
  lazyLoad = true,
  enableVideo = false, // Default to false (videos off)
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(!lazyLoad) // Load immediately if lazy loading is disabled

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazyLoad || shouldLoad || !enableVideo) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
            observer.disconnect() // Stop observing once we've started loading
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before the element comes into view
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [lazyLoad, shouldLoad, enableVideo])

  const handleLoadStart = useCallback(() => setIsLoading(true), [])
  const handleCanPlay = useCallback(() => setIsLoading(false), [])
  const handleError = useCallback(() => {
    setHasError(true)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoad || !enableVideo) return

    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    // Start loading the video when shouldLoad becomes true
    video.load()

    return () => {
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [
    shouldLoad,
    videoFeed.url,
    handleLoadStart,
    handleCanPlay,
    handleError,
    enableVideo,
  ])

  // Handle play/pause based on visibility
  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoad || !enableVideo) return

    if (isVisible && autoPlay && !hasError) {
      video.play().catch(() => {
        // Auto-play failed, which is expected in many browsers
        console.log('Auto-play prevented by browser')
      })
    } else {
      video.pause()
    }
  }, [isVisible, autoPlay, hasError, shouldLoad, enableVideo])

  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={`bg-gray-900/60 rounded flex flex-col items-center justify-center gap-2 ${className}`}
      >
        <div className='text-red-400 text-xs'>📹</div>
        <span className='text-red-400 text-xs font-bold'>Feed Error</span>
      </div>
    )
  }

  // If videos are disabled, show placeholder state
  if (!enableVideo) {
    return (
      <div
        ref={containerRef}
        className={`relative rounded overflow-hidden ${className}`}
      >
        <div className='absolute inset-0 bg-gray-900/60 rounded flex flex-col items-center justify-center gap-2 z-10'>
          <div className='w-6 h-6 border border-gray-500 rounded-sm flex items-center justify-center'>
            <div className='w-3 h-3 border-l-2 border-gray-400'></div>
          </div>
          <span className='text-gray-400 text-xs'>Camera ready</span>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative rounded overflow-hidden ${className}`}
    >
      {/* Lazy loading placeholder */}
      {!shouldLoad && (
        <div className='absolute inset-0 bg-gray-900/60 rounded flex flex-col items-center justify-center gap-2 z-10'>
          <div className='w-6 h-6 border border-gray-500 rounded-sm flex items-center justify-center'>
            <div className='w-3 h-3 border-l-2 border-gray-400'></div>
          </div>
          <span className='text-gray-400 text-xs'>Camera ready</span>
        </div>
      )}

      {/* Loading state */}
      {shouldLoad && isLoading && (
        <div className='absolute inset-0 bg-gray-900/60 rounded flex flex-col items-center justify-center gap-2 z-10'>
          <div className='animate-spin w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full'></div>
          <span className='text-gray-400 text-xs'>Loading feed...</span>
        </div>
      )}

      {/* Video element - only render when shouldLoad is true */}
      {shouldLoad && (
        <video
          ref={videoRef}
          className='w-full h-full object-cover'
          autoPlay={autoPlay}
          loop
          muted={muted}
          controls={controls}
          playsInline
          preload='metadata'
        >
          <source src={videoFeed.url} type={`video/${videoFeed.type}`} />
          Your browser does not support video playback.
        </video>
      )}

      {/* Live indicator overlay - only show when video is loaded */}
      {shouldLoad && !isLoading && !hasError && (
        <div className='absolute top-2 left-2'>
          <div className='flex items-center gap-1 bg-black/60 px-2 py-1 rounded text-xs'>
            <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
            <span className='text-white font-bold'>LIVE</span>
          </div>
        </div>
      )}

      {/* Video controls overlay (only show on hover) */}
      {shouldLoad && !isLoading && !hasError && (
        <div className='absolute bottom-2 right-2 opacity-0 hover:opacity-100 transition-opacity'>
          <button
            onClick={() => {
              const video = videoRef.current
              if (video) {
                if (video.paused) {
                  video.play()
                } else {
                  video.pause()
                }
              }
            }}
            className='bg-black/60 hover:bg-black/80 text-white p-1 rounded text-xs'
          >
            ⏯️
          </button>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
