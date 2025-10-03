import logo2 from '../assets/logo2.svg'

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

const Logo = ({ className = '', width = 30, height = 30 }: LogoProps) => {
  return (
    <img
      src={logo2}
      alt='Twin MS Logo'
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}

export default Logo
