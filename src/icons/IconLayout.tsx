interface IconLayoutProps {
  className?: string
  width?: number
  height?: number
  children: React.ReactNode
  onClick?: () => void
}

const IconLayout = ({
  className = '',
  width = 24,
  height = 24,
  children,
  onClick,
}: IconLayoutProps) => {
  return (
    <svg
      onClick={onClick}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      {children}
    </svg>
  )
}

export default IconLayout
