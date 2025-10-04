import React from 'react'
import { IconProps } from '@/types'

const TrendUpIcon: React.FC<IconProps> = ({
  width = 16,
  height = 16,
  fill = '#10B981', // Green for up trend
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
        d='M7 14L12 9L17 14'
        stroke={fill}
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7 17L12 12L17 17'
        stroke={fill}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity='0.6'
      />
    </svg>
  )
}

export default TrendUpIcon
