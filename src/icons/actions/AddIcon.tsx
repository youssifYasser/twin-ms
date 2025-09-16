interface AddIconProps {
  fill?: string
  width?: number
  height?: number
  className?: string
}

const AddIcon = ({
  fill = '#ffffff',
  width = 24,
  height = 24,
  className = '',
}: AddIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M7.98172 7.33342V3.33342H9.31547V7.33342H13.3167V8.66675H9.31547V12.6667H7.98172V8.66675H3.98047V7.33342H7.98172Z'
        fill={fill}
      />
    </svg>
  )
}

export default AddIcon
