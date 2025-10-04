import React, { useState } from 'react'
import { AssetData } from '@/context/AssetPopupContext'

interface AssetPopupProps {
  asset: AssetData
  isVisible: boolean
  onClose: () => void
}

type TabType = 'overview' | 'power' | 'performance'

const AssetPopup: React.FC<AssetPopupProps> = ({
  asset,
  isVisible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  // Get asset icon based on type (Remix icons)
  const getAssetIcon = () => {
    switch (asset.type) {
      case 'light':
        return 'ri-lightbulb-line'
      case 'hvac':
        return 'ri-temp-hot-line'
      case 'pump':
        return 'ri-drop-line'
      default:
        return 'ri-lightbulb-line'
    }
  }

  // Get status color and text
  const getStatusConfig = () => {
    switch (asset.status) {
      case 'operational':
        return {
          color: '#14B8A6',
          bgColor: 'bg-teal-500/20',
          text: 'Operational',
        }
      case 'warning':
        return {
          color: '#F59E0B',
          bgColor: 'bg-yellow-500/20',
          text: 'Warning',
        }
      case 'error':
        return { color: '#EF4444', bgColor: 'bg-red-500/20', text: 'Error' }
      case 'offline':
        return { color: '#6B7280', bgColor: 'bg-gray-500/20', text: 'Offline' }
      default:
        return {
          color: '#14B8A6',
          bgColor: 'bg-teal-500/20',
          text: 'Operational',
        }
    }
  }

  const statusConfig = getStatusConfig()

  // Get asset type specific label
  const getAssetTypeLabel = () => {
    switch (asset.type) {
      case 'light':
        return 'Smart LED Panel'
      case 'hvac':
        return 'Climate Control Unit'
      case 'pump':
        return 'Water Circulation Pump'
      default:
        return 'Smart Device'
    }
  }

  // Get metrics as array for display
  const metricsArray = Object.entries(asset.metrics).map(([key, value]) => ({
    key,
    ...value,
  }))

  // Split metrics into pairs for grid layout
  const metricPairs = []
  for (let i = 0; i < metricsArray.length; i += 2) {
    metricPairs.push(metricsArray.slice(i, i + 2))
  }

  if (!isVisible) return null

  return (
    <div className='fixed inset-0 z-50 pointer-events-none'>
      {/* Background overlay */}
      <div
        className='absolute inset-0 bg-black/20 pointer-events-auto'
        onClick={onClose}
      />

      {/* Popup container */}
      <div
        className='fixed bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl transition-all duration-300 ease-out pointer-events-auto'
        style={{
          right: '24px',
          top: '50%',
          transform: isVisible
            ? 'translateY(-50%) translateX(0) scale(1)'
            : 'translateY(-50%) translateX(100%) scale(0.95)',
          opacity: isVisible ? 1 : 0,
        }}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-slate-700/50'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center'>
              <i className={`${getAssetIcon()} text-teal-400`}></i>
            </div>
            <div>
              <h3 className='font-semibold text-white text-sm'>{asset.name}</h3>
              <div className='flex items-center gap-2 mt-1'>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 text-teal-400 ${statusConfig.bgColor}`}
                >
                  <i className='ri-checkbox-circle-line text-xs'></i>
                  {statusConfig.text}
                </span>
                <span className='text-xs text-slate-400'>
                  {getAssetTypeLabel()}
                </span>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-1'>
            <button
              className='w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer transition-colors'
              title='More options'
            >
              <i className='ri-more-line text-sm'></i>
            </button>
            <button
              onClick={onClose}
              className='w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer transition-colors'
              title='Close'
            >
              <i className='ri-close-line text-sm'></i>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex border-b border-slate-700/50'>
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium cursor-pointer transition-all ${
              activeTab === 'overview'
                ? 'text-teal-400 border-b-2 border-teal-400 bg-teal-500/5'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <i className='ri-dashboard-line text-sm'></i>
            Overview
          </button>
          <button
            onClick={() => setActiveTab('power')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium cursor-pointer transition-all ${
              activeTab === 'power'
                ? 'text-teal-400 border-b-2 border-teal-400 bg-teal-500/5'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <i className='ri-flashlight-line text-sm'></i>
            Power
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium cursor-pointer transition-all ${
              activeTab === 'performance'
                ? 'text-teal-400 border-b-2 border-teal-400 bg-teal-500/5'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <i className='ri-bar-chart-line text-sm'></i>
            Performance
          </button>
        </div>

        {/* Content */}
        <div className='p-4 max-h-80 overflow-y-auto'>
          {activeTab === 'power' && (
            <div className='space-y-4'>
              {/* Metrics Grid */}
              {metricPairs.map((pair, pairIndex) => (
                <div key={pairIndex} className='grid grid-cols-2 gap-3'>
                  {pair.map((metric) => (
                    <div
                      key={metric.key}
                      className='bg-slate-800/50 rounded-lg p-3'
                    >
                      <div className='flex items-center gap-2 mb-2'>
                        {metric.icon && (
                          <i
                            className={`${metric.icon} text-sm`}
                            style={{ color: metric.color || '#14B8A6' }}
                          ></i>
                        )}
                        <span className='text-xs font-medium text-slate-400 uppercase tracking-wide'>
                          {metric.key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <div className='text-lg font-bold text-white'>
                        {metric.value}
                        {metric.unit && (
                          <span className='text-sm text-slate-400 ml-1'>
                            {metric.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Dimmer Level for lights */}
              {asset.type === 'light' && asset.dimmerLevel !== undefined && (
                <div className='bg-slate-800/50 rounded-lg p-3'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                      <i className='ri-contrast-2-line text-purple-400 text-sm'></i>
                      <span className='text-xs font-medium text-slate-400 uppercase tracking-wide'>
                        Dimmer Level
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-white'>
                      {asset.dimmerLevel}%
                    </span>
                  </div>
                  <div className='w-full bg-slate-700 rounded-full h-2'>
                    <div
                      className='bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${asset.dimmerLevel}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className='space-y-4'>
              <div className='text-slate-300 text-sm'>
                <p>
                  <strong>Location:</strong> {asset.location}
                </p>
                <p>
                  <strong>Asset ID:</strong> {asset.id}
                </p>
                <p>
                  <strong>Type:</strong> {getAssetTypeLabel()}
                </p>
              </div>
              <div className='bg-slate-800/50 rounded-lg p-3'>
                <h4 className='text-white font-medium mb-2'>Specifications</h4>
                <div className='space-y-1 text-sm text-slate-300'>
                  {Object.entries(asset.specifications).map(([key, value]) => (
                    <p key={key}>
                      <strong>{key}:</strong> {value}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className='space-y-4'>
              <div className='text-center text-slate-400 py-8'>
                <div className='w-12 h-12 mx-auto mb-3 bg-slate-800 rounded-lg flex items-center justify-center'>
                  <i className='ri-bar-chart-line text-2xl'></i>
                </div>
                <p className='text-sm'>Performance analytics coming soon</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between p-4 border-t border-slate-700/50'>
          <div className='flex items-center gap-2'>
            <button className='bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 cursor-pointer transition-colors text-white'>
              <i className='ri-settings-3-line text-sm'></i>
              Configure
            </button>
            <button className='bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 cursor-pointer transition-colors text-white'>
              <i className='ri-history-line text-sm'></i>
              History
            </button>
            <button className='bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 cursor-pointer transition-colors text-white'>
              <i className='ri-download-line text-sm'></i>
              Export
            </button>
            <button className='bg-teal-500 hover:bg-teal-600 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 cursor-pointer transition-colors text-white'>
              <i className='ri-eye-line text-sm'></i>
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetPopup
