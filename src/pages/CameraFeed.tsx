import { useState, useMemo, useEffect } from 'react'
import { DownloadIcon, RefreshIcon, SnapshotIcon } from '@/icons'
import { CameraOfflineIcon, CogIcon } from '@/icons/system'
import { useFilter } from '@/context/FilterContext'
import { getFilteredCameras, getFilteredCameraStats } from '@/utils/dataFilters'
import { getVideoFeedForCamera } from '@/services/videoService'
import { VideoPlayer } from '@/components'
import { LayoutGridIcon, ListIcon } from 'lucide-react'

// View types
type ViewMode = 'grid' | 'list'
type ItemsPerRow = 2 | 3 | 4

const CameraFeed = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'ai'>('ai')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [itemsPerRow, setItemsPerRow] = useState<ItemsPerRow>(4)
  const [showItemsDropdown, setShowItemsDropdown] = useState(false)
  const [enableVideos, setEnableVideos] = useState(false) // Simple local state

  const { filterState } = useFilter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowItemsDropdown(false)
    }

    if (showItemsDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showItemsDropdown])

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
    <div className='space-y-6 w-full max-w-full'>
      {/* Video Status Banner */}
      {!enableVideos && (
        <div className='bg-orange-500/20 border border-orange-500/30 backdrop-blur-24 p-4 rounded-lg'>
          <p className='text-orange-400 text-center text-sm'>
            📹 <strong>Video Playback Disabled</strong> - Videos are currently
            turned off for testing. Use the toggle below to enable them.
          </p>
        </div>
      )}

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

      <div className='flex flex-col gap-6 w-full max-w-full'>
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

            {/* Simple Video Toggle */}
            <div className='flex items-center gap-2 ml-4 pl-4 border-l border-gray-600'>
              <button
                onClick={() => setEnableVideos(!enableVideos)}
                className={`py-1 px-3 rounded-lg font-bold text-sm transition-colors ${
                  enableVideos
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                📹 {enableVideos ? 'Videos On' : 'Videos Off'}
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
          <div className='flex items-center gap-3'>
            {/* Grid Items Per Row Dropdown */}
            <div className='relative'>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (viewMode === 'list') {
                    setViewMode('grid')
                  }
                  setShowItemsDropdown(!showItemsDropdown)
                }}
                className={`w-auto h-8 px-3 flex items-center justify-center gap-2 rounded cursor-pointer transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#3BA091] hover:bg-[#338a7b] text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                }`}
              >
                <LayoutGridIcon width={16} height={16} fill='currentColor' />
                {/* <span className='text-sm font-medium'>{itemsPerRow}</span> */}
                {/* <ChevronDownIcon width={14} height={14} fill='currentColor' /> */}
              </button>

              {/* Dropdown Menu */}
              {showItemsDropdown && viewMode === 'grid' && (
                <div
                  className='absolute top-full mt-1 left-0 bg-[#1F2937] border border-[#374151] rounded-lg shadow-lg z-50 min-w-[120px]'
                  onClick={(e) => e.stopPropagation()}
                >
                  {([2, 3, 4, 5] as ItemsPerRow[]).map((count) => (
                    <button
                      key={count}
                      onClick={() => {
                        setItemsPerRow(count)
                        setShowItemsDropdown(false)
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-[#374151] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        itemsPerRow === count
                          ? 'bg-[#3BA091] text-white'
                          : 'text-gray-300'
                      }`}
                    >
                      {count} per row
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* List View Button */}
            <button
              onClick={() => {
                setViewMode('list')
                setShowItemsDropdown(false)
              }}
              className={`w-8 h-8 flex items-center justify-center rounded cursor-pointer transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#3BA091] hover:bg-[#338a7b] text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
              }`}
            >
              <ListIcon width={16} height={16} fill='currentColor' />
            </button>
          </div>
        </div>

        {/* Camera Display */}
        {viewMode === 'grid' ? (
          // Grid View
          <div
            className={`grid gap-6 ${
              itemsPerRow === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : itemsPerRow === 3
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : itemsPerRow === 4
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'
            }`}
          >
            {cameras.map((camera) => (
              <CameraCard
                key={camera.id}
                camera={camera}
                activeTab={activeTab}
                enableVideos={enableVideos}
              />
            ))}
          </div>
        ) : (
          // List View - Table
          <div className='w-full'>
            <CameraTable
              cameras={cameras}
              activeTab={activeTab}
              enableVideos={enableVideos}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Camera Card Component (extracted from original grid view)
const CameraCard = ({
  camera,
  activeTab,
  enableVideos,
}: {
  camera: any
  activeTab: 'live' | 'ai'
  enableVideos: boolean
}) => {
  // Get video feed for this camera
  const videoFeed = getVideoFeedForCamera(camera.id)

  return (
    <div className='bg-[#111827CC] border border-[#37415180] backdrop-blur-24 rounded-2xl overflow-hidden'>
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
                {camera.aiDetections.map((detection: any, index: number) => (
                  <AIDetectionComponent
                    key={index}
                    color={detection.color}
                    label={`${detection.label} ${detection.count}`}
                  />
                ))}
                {camera.aiDetections.length === 0 && (
                  <div className='h-20 w-full flex items-center justify-center bg-gray-800/40 rounded'>
                    <span className='text-gray-400 text-xs'>No detections</span>
                  </div>
                )}
              </div>
            ) : (
              // Live feed mode - show video player
              <div className='mx-4'>
                <VideoPlayer
                  videoFeed={videoFeed}
                  isVisible={activeTab === 'live'}
                  className='h-32 w-full'
                  autoPlay={true}
                  muted={true}
                  controls={false}
                  lazyLoad={true}
                  enableVideo={enableVideos}
                />
              </div>
            )
          ) : (
            // Camera offline - show offline icon
            <div className='h-20 mx-4 bg-gray-900/60 rounded flex flex-col items-center justify-center gap-1'>
              <CameraOfflineIcon width={24} height={24} fill='#EF4444' />
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
            <h4 className='text-white font-bold text-lg'>{camera.name}</h4>
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
            <p className='text-white font-bold text-sm'>{camera.viewers}</p>
          </div>
          <div>
            <p className='text-[#9CA3AF] font-bold text-sm'>Last Activity</p>
            <p className='text-white font-bold text-sm'>
              {camera.lastActivity}
            </p>
          </div>
        </div>
        <div className='mt-1 border-t border-[#37415180] pt-3 flex items-center justify-between w-full'>
          <div className='flex items-center gap-3'>
            {camera.aiDetections.map((detection: any, index: number) => (
              <span
                key={index}
                style={{ color: detection.color }}
                className='font-bold text-xs'
              >
                {detection.label === 'Person' ? '👥' : '🚗'} {detection.count}
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
              <DownloadIcon width={12} height={12} fill='currentColor' />
            </button>
            <button
              className='flex items-center justify-center p-2 bg-[#374151] rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2b333f] transition-colors duration-200'
              title='Take Snapshot'
              disabled={!camera.isOnline}
            >
              <SnapshotIcon width={12} height={12} fill='currentColor' />
            </button>
            <button
              className='flex items-center justify-center p-2 bg-[#374151] rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2b333f] transition-colors duration-200'
              title='Camera Settings'
            >
              <CogIcon width={12} height={12} fill='currentColor' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Camera Table Component
const CameraTable = ({
  cameras,
  activeTab,
  enableVideos,
}: {
  cameras: any[]
  activeTab: 'live' | 'ai'
  enableVideos: boolean
}) => {
  return (
    <div className='bg-[#111827CC] border border-[#37415180] backdrop-blur-24 rounded-2xl overflow-hidden w-full'>
      <div className='overflow-x-auto w-full'>
        <table className='w-full min-w-[800px] overflow-x-scroll'>
          <thead className='bg-[#1F2937] border-b border-[#374151]'>
            <tr>
              <th className='px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider min-w-fit'>
                Camera
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider min-w-fit'>
                Live Feed
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider min-w-fit'>
                Status
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider min-w-fit'>
                Resolution
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider min-w-fit'>
                Location
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider min-w-fit'>
                Recording
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider min-w-fit'>
                Detections
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider min-w-fit'>
                Uptime
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider min-w-fit'>
                Storage
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider min-w-fit'>
                IP Address
              </th>
              <th className='px-6 py-4 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider min-w-fit'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#374151]'>
            {cameras.map((camera) => (
              <CameraTableRow
                key={camera.id}
                camera={camera}
                activeTab={activeTab}
                enableVideos={enableVideos}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Camera Table Row Component
const CameraTableRow = ({
  camera,
  activeTab,
  enableVideos,
}: {
  camera: any
  activeTab: 'live' | 'ai'
  enableVideos: boolean
}) => {
  // Get video feed for this camera
  const videoFeed = getVideoFeedForCamera(camera.id)

  // Generate mock data for table fields
  const recordingStatus = camera.isOnline
    ? Math.random() > 0.3
      ? 'Recording'
      : 'Stopped'
    : 'Offline'
  const uptime = camera.isOnline
    ? `${Math.floor(Math.random() * 30) + 1}d ${Math.floor(
        Math.random() * 24
      )}h`
    : '0h'
  const storage = `${Math.floor(Math.random() * 80) + 10}%`
  const ipAddress = `192.168.1.${Math.floor(Math.random() * 200) + 10}`

  return (
    <tr className='hover:bg-[#1F2937]/50 transition-colors'>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center gap-3'>
          <div
            className={`w-3 h-3 rounded-full ${
              camera.isOnline ? 'bg-[#3BA091]' : 'bg-[#EF4444]'
            }`}
          />
          <div>
            <div className='text-sm font-bold text-white'>{camera.name}</div>
            <div className='text-xs text-[#9CA3AF]'>ID: {camera.id}</div>
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='w-24 h-16'>
          {camera.isOnline ? (
            activeTab === 'live' ? (
              <VideoPlayer
                videoFeed={videoFeed}
                isVisible={true}
                className='w-full h-full'
                autoPlay={true}
                muted={true}
                controls={false}
                lazyLoad={true}
                enableVideo={enableVideos}
              />
            ) : (
              <div className='w-full h-full bg-gray-800/40 rounded flex items-center justify-center'>
                <span className='text-gray-400 text-xs'>AI Mode</span>
              </div>
            )
          ) : (
            <div className='w-full h-full bg-gray-900/60 rounded flex items-center justify-center'>
              <CameraOfflineIcon width={16} height={16} fill='#EF4444' />
            </div>
          )}
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <span
          className={`px-2 py-1 text-xs font-bold rounded-full ${
            camera.isOnline
              ? 'bg-[#3BA091]/20 text-[#3BA091] border border-[#3BA091]/30'
              : 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
          }`}
        >
          {camera.isOnline ? 'ONLINE' : 'OFFLINE'}
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-white'>
        {camera.quality.resolution} • {camera.quality.fps}fps
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-white'>
        {camera.location}
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <span
          className={`px-2 py-1 text-xs font-bold rounded-full ${
            recordingStatus === 'Recording'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : recordingStatus === 'Stopped'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }`}
        >
          {recordingStatus}
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center gap-2'>
          {camera.aiDetections.map((detection: any, index: number) => (
            <span
              key={index}
              style={{ color: detection.color }}
              className='text-xs font-bold'
            >
              {detection.label === 'Person' ? '👥' : '🚗'} {detection.count}
            </span>
          ))}
          {camera.aiDetections.length === 0 && (
            <span className='text-gray-500 text-xs'>None</span>
          )}
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-white'>
        {uptime}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-white'>
        {storage}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]'>
        {ipAddress}
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center gap-1'>
          <button
            className='flex items-center justify-center p-2 bg-[#374151] rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2b333f] transition-colors duration-200'
            title='Download'
            disabled={!camera.isOnline}
          >
            <DownloadIcon width={12} height={12} fill='currentColor' />
          </button>
          <button
            className='flex items-center justify-center p-2 bg-[#374151] rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2b333f] transition-colors duration-200'
            title='Take Snapshot'
            disabled={!camera.isOnline}
          >
            <SnapshotIcon width={12} height={12} fill='currentColor' />
          </button>
          <button
            className='flex items-center justify-center p-2 bg-[#374151] rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2b333f] transition-colors duration-200'
            title='Camera Settings'
          >
            <CogIcon width={12} height={12} fill='currentColor' />
          </button>
        </div>
      </td>
    </tr>
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
