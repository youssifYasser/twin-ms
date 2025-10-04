import { useState, useEffect } from 'react'

interface LinearProgressProps {
  progress: number // Progress percentage (0 to 100)
  title: string
  value: string
  color: string
}

export default function LinearProgress({
  progress,
  title,
  value,
  color,
}: LinearProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    // Start animation after a small delay to ensure component is mounted
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)

    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className='w-full'>
      {/* Title and Value Row */}
      <div className='flex justify-between items-center mb-2'>
        <span className='font-normal text-sm text-[#D1D5DB]'>{title}</span>
        <span className='font-bold text-sm text-white'>{value}</span>
      </div>

      {/* Progress Bar and Percentage Row */}
      <div className='flex items-center gap-3'>
        {/* Progress Bar Container */}
        <div
          className='flex-1 h-2 rounded-full'
          style={{ backgroundColor: '#374151' }}
        >
          {/* Progress Bar Fill */}
          <div
            className='h-full rounded-full transition-all duration-1000 ease-out'
            style={{
              width: `${animatedProgress}%`,
              backgroundColor: color,
            }}
          />
        </div>

        {/* Progress Percentage */}
        <span
          className='font-normal transition-all duration-1000 ease-out'
          style={{
            fontSize: '12px',
            color: '#9CA3AF',
          }}
        >
          {Math.round(animatedProgress)}%
        </span>
      </div>
    </div>
  )
}
