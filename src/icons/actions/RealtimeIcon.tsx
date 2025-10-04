import React from 'react'
import { IconProps } from '@/types'

const RealtimeIcon: React.FC<IconProps> = ({
  width = 16,
  height = 16,
  fill = 'currentColor',
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
      {/* Radio waves */}
      <path
        d='M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z'
        stroke={fill}
        strokeWidth='1.5'
        fill='none'
      />
      <path
        d='M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z'
        stroke={fill}
        strokeWidth='1.5'
        fill='none'
      />
      {/* Center dot */}
      <circle cx='12' cy='12' r='2' fill={fill} />
      {/* Signal rays */}
      <path
        d='M18.364 5.636L19.071 4.929'
        stroke={fill}
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M4.929 19.071L5.636 18.364'
        stroke={fill}
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M19.071 19.071L18.364 18.364'
        stroke={fill}
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M5.636 5.636L4.929 4.929'
        stroke={fill}
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  )
}

export default RealtimeIcon
