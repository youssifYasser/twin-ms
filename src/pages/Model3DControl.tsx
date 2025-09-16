const Model3DControl = () => {
  return (
    <div className='space-y-6'>
      <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-6'>
        <h3 className='text-xl font-semibold text-white mb-4'>
          3D Model Controls
        </h3>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Rotation Speed
              </label>
              <input
                type='range'
                min='0'
                max='100'
                defaultValue='50'
                className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Zoom Level
              </label>
              <input
                type='range'
                min='10'
                max='200'
                defaultValue='100'
                className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer'
              />
            </div>
          </div>
          <div className='bg-gray-900/50 rounded-lg p-4 flex items-center justify-center min-h-[200px]'>
            <p className='text-gray-500'>3D Model Viewport</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Model3DControl
