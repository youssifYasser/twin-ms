import React from 'react'
import { IconProps } from '@/types'

const TrendStableIcon: React.FC<IconProps> = ({
  width = 16,
  height = 16,
  fill = '#6B7280', // Gray for stable trend
  className = '',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M7 12L17 12'
        stroke={fill}
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7 14L17 14'
        stroke={fill}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity='0.6'
      />
    </svg>
  )
}

export default TrendStableIcon
