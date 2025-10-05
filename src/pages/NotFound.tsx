import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

const NotFound = () => {
  return (
    <div className='min-h-screen bg-primary-bg flex items-center justify-center px-4'>
      <div className='max-w-md w-full text-center'>
        <div className='mb-8'>
          <h1 className='text-9xl font-bold text-active-page mb-4'>404</h1>
          <h2 className='text-2xl font-bold text-white mb-2'>Page Not Found</h2>
          <p className='text-gray-400 mb-8'>
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className='space-y-4'>
          <Link
            to={ROUTES.HOME}
            className='inline-flex items-center px-6 py-3 bg-active-page text-white font-medium rounded-lg hover:bg-active-page/80 transition-colors'
          >
            <svg
              className='w-5 h-5 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
              />
            </svg>
            Go to Home
          </Link>

          <div className='pt-4'>
            <button
              onClick={() => window.history.back()}
              className='text-gray-400 hover:text-white transition-colors'
            >
              ← Go back to previous page
            </button>
          </div>
        </div>

        <div className='mt-12 pt-8 border-t border-gray-700'>
          <p className='text-sm text-gray-500'>
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound
