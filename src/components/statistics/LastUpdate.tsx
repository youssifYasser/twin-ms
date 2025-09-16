import { useFilter } from '@/context/FilterContext'

const LastUpdate = () => {
  const { filterState } = useFilter()

  // Get current time for last update
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <div className='bg-[#07131D] p-4 flex flex-col items-start gap-3'>
      <h4 className='text-base font-bold text-[#B0B3B5] uppercase'>
        Last Updated
      </h4>
      <hr className='border-[#37415180] color-[#37415180] w-[90%] self-center' />
      <p className='text-[#C2C4C6] font-medium text-2xl'>{currentTime}</p>
      <p className='text-[#94989B] font-normal text-sm'>
        {filterState.selectedFloor === 'All Floors'
          ? 'Building Report'
          : filterState.selectedUnit === 'All Units'
          ? 'Floor Report'
          : 'Unit Report'}
      </p>
    </div>
  )
}

export default LastUpdate
