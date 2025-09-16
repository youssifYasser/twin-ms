interface CalendarIconsProps {
  fill?: string
  width?: number
  height?: number
  className?: string
}

const CalendarIcons = ({
  fill = '#ffffff',
  width = 24,
  height = 24,
  className = '',
}: CalendarIconsProps) => {
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
        d='M5.07812 1V2H8.07812V1H9.07812V2H11.0781C11.2181 2 11.3365 2.04833 11.4331 2.145C11.5298 2.24167 11.5781 2.36 11.5781 2.5V10.5C11.5781 10.64 11.5298 10.7583 11.4331 10.855C11.3365 10.9517 11.2181 11 11.0781 11H2.07812C1.93812 11 1.81979 10.9517 1.72312 10.855C1.62646 10.7583 1.57812 10.64 1.57812 10.5V2.5C1.57812 2.36 1.62646 2.24167 1.72312 2.145C1.81979 2.04833 1.93812 2 2.07812 2H4.07812V1H5.07812ZM10.5781 6H2.57812V10H10.5781V6ZM4.07812 3H2.57812V5H10.5781V3H9.07812V4H8.07812V3H5.07812V4H4.07812V3Z'
        fill={fill}
      />
    </svg>
  )
}

export default CalendarIcons
