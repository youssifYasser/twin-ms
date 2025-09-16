import { PresetType } from '@/types'

interface PresetCardProps {
  presetData: PresetType
  onClick: (id: number) => void
  isActive?: boolean
}

const PresetCard = ({
  presetData: { id, name, description },
  onClick,
  isActive = false,
}: PresetCardProps) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={`p-4 transition-colors duration-300 border  ${
        isActive
          ? 'bg-[#3BA0911A] border-[#3BA091] pointer-events-none'
          : 'bg-[#1F293766] border-[#37415180] cursor-pointer hover:border-[#3BA091]'
      } flex flex-col items-start gap-2`}
    >
      <div className='flex items-center justify-between w-full'>
        <h4 className='font-roboto text-white text-base font-medium'>{name}</h4>
        <span
          className={`w-2 h-2 rounded-full bg-[#4ADE80] transition-opacity duration-300 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        ></span>
      </div>
      <p className='font-roboto text-sm text-[#9CA3AF] font-normal'>
        {description}
      </p>
    </div>
  )
}

export default PresetCard
