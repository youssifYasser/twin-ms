interface ElevatorIconProps {
  width?: number
  height?: number
  className?: string
  fill?: string
}

const ElevatorIcon = ({
  width = 16,
  height = 16,
  className = '',
  fill = '#FFFFFF',
}: ElevatorIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox='0 0 17 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M7.25359 7.41329V1.33329L14.5823 5.33329V14.6666H2.58984V5.33329L7.25359 7.41329ZM8.58609 3.57329V9.45329L3.92234 7.38663V13.3333H13.2498V6.11996L8.58609 3.57329Z'
        fill={fill}
      />
    </svg>
  )
}

export default ElevatorIcon
