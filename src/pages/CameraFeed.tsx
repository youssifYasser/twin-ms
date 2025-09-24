import { useState, useMemo } from 'react'
import { DownloadIcon, RefreshIcon, SnapshotIcon } from '@/icons'
import { CameraOfflineIcon } from '@/icons/system'
import { useFilter } from '@/context/FilterContext'
import { getFilteredCameras, getFilteredCameraStats } from '@/utils/dataFilters'

const CameraFeed = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'ai'>('ai')
  const { filterState } = useFilter()

  // Get filtered camera data based on current floor/unit selection
  const cameras = useMemo(() => {
    return getFilteredCameras({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })
  }, [filterState.selectedFloorId, filterState.selectedUnitId])

  // Get camera statistics
  const cameraStats = useMemo(() => {
    return getFilteredCameraStats({
      selectedFloorId: filterState.selectedFloorId,
      selectedUnitId: filterState.selectedUnitId,
    })
  }, [filterState.selectedFloorId, filterState.selectedUnitId])

  return (
    <div className='space-y-6'>
      {/* Filter Status Display */}
      {filterState.selectedFloor !== 'All Floors' && (
        <div className='bg-bg-card backdrop-blur-24 p-4 rounded-lg border border-primary-border'>
          <p className='text-white text-center text-lg'>
            Cameras for:{' '}
            <span className='font-bold text-active-page'>
              {filterState.selectedFloor}
              {filterState.selectedUnit !== 'All Units' &&
                ` - ${filterState.selectedUnit}`}
            </span>
          </p>
        </div>
      )}

      <div className='flex flex-col gap-6'>
        <div className='flex items-center w-full justify-between'>
          <div className='flex items-center gap-3'>
            {/* Either choose "Live Camera Feeds" or "AI Detection" and the active one have the bg-[#3BA091] */}
            <button
              onClick={() => setActiveTab('live')}
              className={`py-1 px-3 rounded-lg font-bold text-sm transition-colors ${
                activeTab === 'live' ? 'bg-[#3BA091]' : 'bg-transparent'
              }`}
            >
              Live Camera Feeds
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-1 px-3 rounded-lg font-bold text-sm transition-colors ${
                activeTab === 'ai' ? 'bg-[#3BA091]' : 'bg-transparent'
              }`}
            >
              AI Detection
            </button>
          </div>
          <div className='flex items-center gap-3'>
            <p className='text-[#9CA3AF] font-bold text-sm'>
              {cameraStats.online} / {cameraStats.total} cameras online
            </p>
            <button
              className='flex items-center justify-center p-2 bg-[#1F2937] rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1F2937BB] transition-colors duration-200'
              title='Refresh cameras'
            >
              <RefreshIcon width={16} height={16} fill='currentColor' />
            </button>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {cameras.map((camera) => (
            // Camera Card
            <div
              key={camera.id}
              className='bg-[#111827CC] border border-[#37415180] backdrop-blur-24 rounded-2xl overflow-hidden'
            >
              <div
                className='flex flex-col gap-2'
                style={{
                  background:
                    'linear-gradient(135deg, #1F2937 0%, #374151 50%, #111827 100%)',
                }}
              >
                <div className='flex items-center justify-between p-4'>
                  <div className='flex items-center space-x-2'>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        camera.isOnline ? 'bg-[#EF4444]' : 'bg-gray-500'
                      }`}
                    ></div>
                    <span className='text-xs text-white font-bold'>
                      {camera.isOnline ? 'LIVE' : 'OFFLINE'}
                    </span>
                  </div>
                  <span className='rounded-[4px] px-2 py-1 flex items-center justify-center bg-black/60 font-bold text-xs text-white'>
                    {camera.quality.resolution} • {camera.quality.fps}fps
                  </span>
                </div>
                <div>
                  {camera.isOnline ? (
                    activeTab === 'ai' ? (
                      // AI Detection mode - show detection boxes
                      <div className='flex flex-wrap gap-1 px-4'>
                        {camera.aiDetections.map((detection, index) => (
                          <AIDetectionComponent
                            key={index}
                            color={detection.color}
                            label={`${detection.label} ${detection.count}`}
                          />
                        ))}
                        {camera.aiDetections.length === 0 && (
                          <div className='h-20 w-full flex items-center justify-center bg-gray-800/40 rounded'>
                            <span className='text-gray-400 text-xs'>
                              No detections
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Live feed mode - show placeholder
                      <div className='h-20 mx-4 bg-gray-900/60 rounded flex items-center justify-center'>
                        <span className='text-gray-400 text-xs'>Live Feed</span>
                      </div>
                    )
                  ) : (
                    // Camera offline - show offline icon
                    <div className='h-20 mx-4 bg-gray-900/60 rounded flex flex-col items-center justify-center gap-1'>
                      <CameraOfflineIcon
                        width={24}
                        height={24}
                        fill='#EF4444'
                      />
                      <span className='text-red-400 text-xs font-bold'>
                        Camera Offline
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className='p-4 flex flex-col items-start gap-2'>
                <div className='flex items-center justify-between w-full'>
                  <div>
                    <h4 className='text-white font-bold text-lg'>
                      {camera.name}
                    </h4>
                    <p className='text-[#9CA3AF] font-bold text-sm'>
                      {camera.location}
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      camera.isOnline ? 'bg-[#3BA091]' : 'bg-[#EF4444]'
                    }`}
                  ></div>
                </div>
                <div className='flex items-stretch justify-between w-full'>
                  <div>
                    <p className='text-[#9CA3AF] font-bold text-sm'>Viewers</p>
                    <p className='text-white font-bold text-sm'>
                      {camera.viewers}
                    </p>
                  </div>
                  <div>
                    <p className='text-[#9CA3AF] font-bold text-sm'>
                      Last Activity
                    </p>
                    <p className='text-white font-bold text-sm'>
                      {camera.lastActivity}
                    </p>
                  </div>
                </div>
                <div className='mt-1 border-t border-[#37415180] pt-3 flex items-center justify-between w-full'>
                  <div className='flex items-center gap-3'>
                    {camera.aiDetections.map((detection, index) => (
                      <span
                        key={index}
                        style={{ color: detection.color }}
                        className='font-bold text-xs'
                      >
                        {detection.label === 'Person' ? '👥' : '🚗'}{' '}
                        {detection.count}
                      </span>
                    ))}
                    {camera.aiDetections.length === 0 && (
                      <span className='text-gray-500 font-bold text-xs'>
                        No detections
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-1'>
                    <button
                      className='flex items-center justify-center p-2 bg-[#374151] rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2b333f] transition-colors duration-200'
                      title='Download'
                      disabled={!camera.isOnline}
                    >
                      <DownloadIcon
                        width={12}
                        height={12}
                        fill='currentColor'
                      />
                    </button>
                    <button
                      className='flex items-center justify-center p-2 bg-[#374151] rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2b333f] transition-colors duration-200'
                      title='Take Snapshot'
                      disabled={!camera.isOnline}
                    >
                      <SnapshotIcon
                        width={12}
                        height={12}
                        fill='currentColor'
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const AIDetectionComponent = ({
  color,
  label,
}: {
  color: string
  label: string
}) => {
  return (
    <div
      className='h-20 w-20 overflow-hidden'
      style={{
        border: `2px solid ${color}`,
        borderRadius: '4px',
      }}
    >
      <div className='w-full px-1' style={{ backgroundColor: color }}>
        <span className='text-xs text-black font-bold'>{label}</span>
      </div>
      <div className='w-full bg-transparent'></div>
    </div>
  )
}

export default CameraFeed
