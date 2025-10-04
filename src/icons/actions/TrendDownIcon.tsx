import React from 'react'
import { IconProps } from '@/types'

const TrendDownIcon: React.FC<IconProps> = ({
  width = 16,
  height = 16,
  fill = '#EF4444', // Red for down trend
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
        d='M7 10L12 15L17 10'
        stroke={fill}
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7 7L12 12L17 7'
        stroke={fill}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity='0.6'
      />
    </svg>
  )
}

export default TrendDownIcon
