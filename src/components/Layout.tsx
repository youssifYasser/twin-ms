import { ReactNode, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import AppBar from '@/components/AppBar'
import { useCurrentPageType, usePageTitle } from '@/hooks/useRouting'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const currentPage = useCurrentPageType()

  // Update page title based on current route
  usePageTitle()

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar
        isOpen={isSidebarOpen}
        currentPage={currentPage}
        onToggle={handleToggleSidebar}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <AppBar
          currentPage={currentPage}
          showLogo={!isSidebarOpen}
          toggleSidebar={handleToggleSidebar}
        />
        <main className='flex-1 overflow-auto p-3 sm:p-4 md:p-6 font-inter'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
