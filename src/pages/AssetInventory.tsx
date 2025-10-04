import React, { useState, useMemo } from 'react'
import {
  Asset,
  AssetFilters,
  AddAssetFormData,
  AssetType,
  AssetStatus,
  WarrantyStatus,
} from '../types/AssetTypes'
import { assetsData } from '../data/assetsData'

const AssetInventory = () => {
  const [assets, setAssets] = useState<Asset[]>(assetsData)
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [filters, setFilters] = useState<AssetFilters>({
    name: '',
    unit: 'All',
    floor: 'All',
    type: 'All',
    provider: 'All',
    warranty: 'All',
    sortBy: 'name',
  })

  const [formData, setFormData] = useState<AddAssetFormData>({
    name: 'Air Conditioning Unit',
    unit: '501',
    floor: 5,
    type: 'HVAC',
    provider: 'Samsung Electronics',
    warrantyExpiry: '2026-12-31',
    serialNumber: 'AC-SAM-2024-001',
    installDate: '2024-01-15',
    cost: 15000,
    status: 'Active',
    notes: 'High-efficiency cooling system for executive floor',
  })

  // Get unique values for filter dropdowns
  const uniqueUnits = useMemo(
    () => Array.from(new Set(assets.map((asset) => asset.unit))),
    [assets]
  )
  const uniqueFloors = useMemo(
    () =>
      Array.from(new Set(assets.map((asset) => asset.floor))).sort(
        (a, b) => a - b
      ),
    [assets]
  )
  const uniqueTypes = useMemo(
    () => Array.from(new Set(assets.map((asset) => asset.type))),
    [assets]
  )
  const uniqueProviders = useMemo(
    () => Array.from(new Set(assets.map((asset) => asset.provider))),
    [assets]
  )

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    let filtered = assets.filter((asset) => {
      return (
        (filters.name === '' ||
          asset.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.unit === 'All' || asset.unit === filters.unit) &&
        (filters.floor === 'All' || asset.floor.toString() === filters.floor) &&
        (filters.type === 'All' || asset.type === filters.type) &&
        (filters.provider === 'All' || asset.provider === filters.provider) &&
        (filters.warranty === 'All' ||
          asset.warrantyStatus === filters.warranty)
      )
    })

    // Sort assets
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'unit':
          return a.unit.localeCompare(b.unit)
        case 'floor':
          return a.floor - b.floor
        case 'type':
          return a.type.localeCompare(b.type)
        case 'provider':
          return a.provider.localeCompare(b.provider)
        case 'warranty':
          return (
            new Date(a.warrantyExpiry).getTime() -
            new Date(b.warrantyExpiry).getTime()
          )
        case 'cost':
          return a.cost - b.cost
        default:
          return 0
      }
    })

    return filtered
  }, [assets, filters])

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAssets(new Set())
    } else {
      setSelectedAssets(new Set(filteredAssets.map((asset) => asset.id)))
    }
    setSelectAll(!selectAll)
  }

  const handleAssetSelect = (assetId: string) => {
    const newSelection = new Set(selectedAssets)
    if (newSelection.has(assetId)) {
      newSelection.delete(assetId)
    } else {
      newSelection.add(assetId)
    }
    setSelectedAssets(newSelection)
    setSelectAll(newSelection.size === filteredAssets.length)
  }

  const resetFilters = () => {
    setFilters({
      name: '',
      unit: 'All',
      floor: 'All',
      type: 'All',
      provider: 'All',
      warranty: 'All',
      sortBy: 'name',
    })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.name ||
      !formData.unit ||
      formData.floor === '' ||
      !formData.type ||
      !formData.provider ||
      !formData.warrantyExpiry ||
      !formData.serialNumber ||
      !formData.installDate ||
      formData.cost === ''
    ) {
      alert('Please fill in all required fields')
      return
    }

    // Calculate warranty status
    const warrantyDate = new Date(formData.warrantyExpiry)
    const today = new Date()
    const monthsUntilExpiry =
      (warrantyDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)

    let warrantyStatus: WarrantyStatus = 'Active'
    if (monthsUntilExpiry < 0) {
      warrantyStatus = 'Expired'
    } else if (monthsUntilExpiry < 6) {
      warrantyStatus = 'Expiring Soon'
    }

    const newAsset: Asset = {
      id: `AST-${String(assets.length + 1).padStart(3, '0')}`,
      name: formData.name,
      unit: formData.unit,
      floor: Number(formData.floor),
      type: formData.type as AssetType,
      provider: formData.provider,
      warrantyExpiry: formData.warrantyExpiry,
      warrantyStatus,
      status: formData.status,
      cost: Number(formData.cost),
      serialNumber: formData.serialNumber,
      installDate: formData.installDate,
      notes: formData.notes,
    }

    setAssets([...assets, newAsset])
    setShowAddDialog(false)
    setFormData({
      name: 'Air Conditioning Unit',
      unit: '501',
      floor: 5,
      type: 'HVAC',
      provider: 'Samsung Electronics',
      warrantyExpiry: '2026-12-31',
      serialNumber: 'AC-SAM-2024-001',
      installDate: '2024-01-15',
      cost: 15000,
      status: 'Active',
      notes: 'High-efficiency cooling system for executive floor',
    })
  }

  const getStatusColor = (status: AssetStatus) => {
    switch (status) {
      case 'Active':
        return 'text-teal-400 bg-teal-500/20'
      case 'Maintenance':
        return 'text-orange-400 bg-orange-500/20'
      case 'Inactive':
        return 'text-red-400 bg-red-500/20'
      default:
        return 'text-slate-400 bg-slate-500/20'
    }
  }

  const getWarrantyColor = (status: WarrantyStatus) => {
    switch (status) {
      case 'Active':
        return 'text-teal-400 bg-teal-500/20'
      case 'Expiring Soon':
        return 'text-orange-400 bg-orange-500/20'
      case 'Expired':
        return 'text-red-400 bg-red-500/20'
      default:
        return 'text-slate-400 bg-slate-500/20'
    }
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold'>Asset Inventory</h2>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setShowAddDialog(true)}
            className='bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors'
          >
            <i className='ri-add-line'></i>
            Add Asset
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className='bg-slate-800 rounded-xl p-4 mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold'>Filters</h3>
          <button
            onClick={resetFilters}
            className='bg-slate-600 hover:bg-slate-500 px-3 py-2 rounded-lg text-sm cursor-pointer whitespace-nowrap transition-colors'
          >
            Reset Filters
          </button>
        </div>
        <div className='grid grid-cols-7 gap-4'>
          <div>
            <label className='block text-sm font-medium text-slate-400 mb-2'>
              Name
            </label>
            <input
              type='text'
              placeholder='Search by name...'
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className='w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-400 mb-2'>
              Unit
            </label>
            <select
              value={filters.unit}
              onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
              className='w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500 pr-8'
            >
              <option value='All'>All</option>
              {uniqueUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-400 mb-2'>
              Floor
            </label>
            <select
              value={filters.floor}
              onChange={(e) =>
                setFilters({ ...filters, floor: e.target.value })
              }
              className='w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500 pr-8'
            >
              <option value='All'>All</option>
              {uniqueFloors.map((floor) => (
                <option key={floor} value={floor.toString()}>
                  Floor {floor}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-400 mb-2'>
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className='w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500 pr-8'
            >
              <option value='All'>All</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-400 mb-2'>
              Provider
            </label>
            <select
              value={filters.provider}
              onChange={(e) =>
                setFilters({ ...filters, provider: e.target.value })
              }
              className='w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500 pr-8'
            >
              <option value='All'>All</option>
              {uniqueProviders.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-400 mb-2'>
              Warranty
            </label>
            <select
              value={filters.warranty}
              onChange={(e) =>
                setFilters({ ...filters, warranty: e.target.value })
              }
              className='w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500 pr-8'
            >
              <option value='All'>All</option>
              <option value='Active'>Active</option>
              <option value='Expiring Soon'>Expiring Soon</option>
              <option value='Expired'>Expired</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-slate-400 mb-2'>
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value })
              }
              className='w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500 pr-8'
            >
              <option value='name'>Name</option>
              <option value='unit'>Unit</option>
              <option value='floor'>Floor</option>
              <option value='type'>Type</option>
              <option value='provider'>Provider</option>
              <option value='warranty'>Warranty</option>
              <option value='cost'>Cost</option>
            </select>
          </div>
        </div>
        <div className='mt-4 flex items-center justify-between'>
          <div className='text-sm text-slate-400'>
            Showing {filteredAssets.length} of {assets.length} assets
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={handleSelectAll}
              className='bg-slate-600 hover:bg-slate-500 px-3 py-1 rounded text-sm cursor-pointer whitespace-nowrap transition-colors'
            >
              {selectAll ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className='bg-slate-800 rounded-xl overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-slate-700'>
              <tr>
                <th className='text-left p-4 font-semibold w-12'>
                  <input
                    type='checkbox'
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className='w-4 h-4 text-teal-500 bg-slate-600 border-slate-500 rounded focus:ring-teal-500'
                  />
                </th>
                <th className='text-left p-4 font-semibold'>Asset</th>
                <th className='text-left p-4 font-semibold'>Unit</th>
                <th className='text-left p-4 font-semibold'>Floor</th>
                <th className='text-left p-4 font-semibold'>Type</th>
                <th className='text-left p-4 font-semibold'>Provider</th>
                <th className='text-left p-4 font-semibold'>Warranty</th>
                <th className='text-left p-4 font-semibold'>Status</th>
                <th className='text-left p-4 font-semibold'>Cost</th>
                <th className='text-left p-4 font-semibold'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className='border-t border-slate-700 hover:bg-slate-750'
                >
                  <td className='p-4'>
                    <input
                      type='checkbox'
                      checked={selectedAssets.has(asset.id)}
                      onChange={() => handleAssetSelect(asset.id)}
                      className='w-4 h-4 text-teal-500 bg-slate-600 border-slate-500 rounded focus:ring-teal-500'
                    />
                  </td>
                  <td className='p-4'>
                    <div>
                      <div className='font-semibold text-sm'>{asset.name}</div>
                      <div className='text-xs text-slate-400'>
                        ID: {asset.id}
                      </div>
                      <div className='text-xs text-slate-500'>
                        SN: {asset.serialNumber}
                      </div>
                    </div>
                  </td>
                  <td className='p-4 text-sm'>{asset.unit}</td>
                  <td className='p-4 text-sm'>{asset.floor}</td>
                  <td className='p-4'>
                    <span className='text-xs bg-slate-600/20 text-slate-300 px-2 py-1 rounded'>
                      {asset.type}
                    </span>
                  </td>
                  <td className='p-4 text-sm text-slate-300'>
                    {asset.provider}
                  </td>
                  <td className='p-4'>
                    <div>
                      <div className='text-sm'>{asset.warrantyExpiry}</div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getWarrantyColor(
                          asset.warrantyStatus
                        )}`}
                      >
                        {asset.warrantyStatus}
                      </span>
                    </div>
                  </td>
                  <td className='p-4'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        asset.status
                      )}`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td className='p-4 text-sm font-medium'>
                    {asset.cost.toLocaleString()} SAR
                  </td>
                  <td className='p-4'>
                    <div className='flex gap-1'>
                      <button className='w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded cursor-pointer transition-colors'>
                        <i className='ri-eye-line text-sm'></i>
                      </button>
                      <button className='w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded cursor-pointer transition-colors'>
                        <i className='ri-edit-line text-sm'></i>
                      </button>
                      <button className='w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded cursor-pointer transition-colors'>
                        <i className='ri-download-line text-sm'></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Dialog */}
      {showAddDialog && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-slate-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-semibold'>Add New Asset</h3>
              <button
                onClick={() => setShowAddDialog(false)}
                className='w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors'
              >
                <i className='ri-close-line'></i>
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Asset Name
                </label>
                <input
                  type='text'
                  placeholder='Enter asset name...'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500'
                  required
                />
              </div>
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>Unit</label>
                  <input
                    type='text'
                    placeholder='Unit location...'
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Floor
                  </label>
                  <input
                    type='number'
                    placeholder='Floor number...'
                    value={formData.floor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        floor: e.target.value ? Number(e.target.value) : '',
                      })
                    }
                    className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as AssetType,
                      })
                    }
                    className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 pr-8'
                    required
                  >
                    <option value=''>Select Type</option>
                    <option value='Lighting'>Lighting</option>
                    <option value='HVAC'>HVAC</option>
                    <option value='Security'>Security</option>
                    <option value='Elevator'>Elevator</option>
                    <option value='Safety'>Safety</option>
                    <option value='Network'>Network</option>
                  </select>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Provider
                  </label>
                  <input
                    type='text'
                    placeholder='Manufacturer/Provider...'
                    value={formData.provider}
                    onChange={(e) =>
                      setFormData({ ...formData, provider: e.target.value })
                    }
                    className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Warranty Expiry
                  </label>
                  <input
                    type='date'
                    value={formData.warrantyExpiry}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        warrantyExpiry: e.target.value,
                      })
                    }
                    className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500'
                    required
                  />
                </div>
              </div>
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Serial Number
                  </label>
                  <input
                    type='text'
                    placeholder='Serial number...'
                    value={formData.serialNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, serialNumber: e.target.value })
                    }
                    className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Install Date
                  </label>
                  <input
                    type='date'
                    value={formData.installDate}
                    onChange={(e) =>
                      setFormData({ ...formData, installDate: e.target.value })
                    }
                    className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Cost (SAR)
                  </label>
                  <input
                    type='number'
                    placeholder='Asset cost...'
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cost: e.target.value ? Number(e.target.value) : '',
                      })
                    }
                    className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500'
                    required
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as AssetStatus,
                    })
                  }
                  className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 pr-8'
                >
                  <option value='Active'>Active</option>
                  <option value='Maintenance'>Maintenance</option>
                  <option value='Inactive'>Inactive</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Notes</label>
                <textarea
                  rows={3}
                  placeholder='Additional notes about the asset...'
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className='w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500 resize-none'
                />
              </div>
              <div className='flex gap-3 mt-6'>
                <button
                  type='submit'
                  className='flex-1 bg-teal-500 hover:bg-teal-600 py-2 rounded-lg font-medium cursor-pointer whitespace-nowrap transition-colors'
                >
                  Add Asset
                </button>
                <button
                  type='button'
                  onClick={() => setShowAddDialog(false)}
                  className='flex-1 bg-slate-600 hover:bg-slate-500 py-2 rounded-lg font-medium cursor-pointer whitespace-nowrap transition-colors'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssetInventory
