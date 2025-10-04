interface PumpIconProps {
  width?: number
  height?: number
  className?: string
  fill?: string
}

const PumpIcon = ({
  width = 16,
  height = 16,
  className = '',
  fill = '#FFFFFF',
}: PumpIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* Pump Housing/Body */}
      <rect
        x='3'
        y='6'
        width='10'
        height='6'
        rx='1'
        fill={fill}
        opacity='0.8'
      />

      {/* Motor/Engine */}
      <circle cx='8' cy='4' r='2.5' fill={fill} />

      {/* Inlet Pipe */}
      <rect x='1' y='8' width='3' height='2' fill={fill} opacity='0.6' />

      {/* Outlet Pipe */}
      <rect x='12' y='8' width='3' height='2' fill={fill} opacity='0.6' />

      {/* Motor Lines/Details */}
      <circle
        cx='8'
        cy='4'
        r='1'
        fill='none'
        stroke={fill}
        strokeWidth='0.5'
        opacity='0.7'
      />

      {/* Flow Direction Arrows */}
      <path
        d='M14 8.5L15 9L14 9.5'
        stroke={fill}
        strokeWidth='0.8'
        fill='none'
        opacity='0.9'
      />
    </svg>
  )
}

export default PumpIcon
