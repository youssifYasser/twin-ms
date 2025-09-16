import { useState, useRef, useEffect } from 'react'
import { ArrowDownIcon } from '@/icons'

interface DropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  buttonClassName?: string
  arrowClassName?: string
}

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  className = '',
  buttonClassName = '',
  arrowClassName = '',
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-3 py-2 bg-[#1F293799] border border-[#37415180] rounded-lg text-white text-sm font-medium hover:bg-[#1F2937BB] transition-colors duration-200 min-w-[120px] ${buttonClassName}`}
      >
        <span>{value || placeholder}</span>
        <ArrowDownIcon
          width={16}
          height={16}
          fill='#9CA3AF'
          className={`transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${arrowClassName}`}
        />
      </button>

      {isOpen && (
        <div className='absolute top-full left-0 mt-1 w-full bg-[#1F2937] border border-[#37415180] rounded-lg shadow-lg z-50 overflow-hidden'>
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-[#374151] transition-colors duration-150 ${
                value === option
                  ? 'bg-[#37988A] text-white font-medium'
                  : 'text-[#D1D5DB]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
