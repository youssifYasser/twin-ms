import IconLayout from '../IconLayout'

interface DownloadIconProps {
  className?: string
  width?: number
  height?: number
  fill?: string
}

const DownloadIcon = ({
  className = '',
  width = 24,
  height = 24,
  fill = '#FFFFFF',
}: DownloadIconProps) => {
  return (
    <IconLayout className={className} width={width} height={height}>
      <path
        d='M1.75 10.25H10.75V11.25H1.75V10.25ZM6.75 7.34L9.79 4.3L10.49 5.01L6.25 9.25L2.01 5.01L2.71 4.3L5.75 7.34V1.75H6.75V7.34Z'
        fill={fill}
      />
    </IconLayout>
  )
}

export default DownloadIcon
