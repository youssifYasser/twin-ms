import IconLayout from '../IconLayout'

interface CameraOfflineIconProps {
  className?: string
  width?: number
  height?: number
  fill?: string
}

const CameraOfflineIcon = ({
  className = '',
  width = 24,
  height = 24,
  fill = '#EF4444',
}: CameraOfflineIconProps) => {
  return (
    <IconLayout className={className} width={width} height={height}>
      <path
        d='M2 6C2 4.9 2.9 4 4 4H7L8 2H16L17 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6ZM4 6V18H20V6H16.83L15.83 4H8.17L7.17 6H4ZM12 17C15.31 17 18 14.31 18 11C18 7.69 15.31 5 12 5C8.69 5 6 7.69 6 11C6 14.31 8.69 17 12 17ZM12 15C9.79 15 8 13.21 8 11C8 8.79 9.79 7 12 7C14.21 7 16 8.79 16 11C16 13.21 14.21 15 12 15Z'
        fill={fill}
      />
      {/* Cross overlay for offline */}
      <path
        d='M3.5 3.5L20.5 20.5M20.5 3.5L3.5 20.5'
        stroke={fill}
        strokeWidth='2'
        strokeLinecap='round'
      />
    </IconLayout>
  )
}

export default CameraOfflineIcon
