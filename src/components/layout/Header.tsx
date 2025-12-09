'use client'

import { ThemeToggle } from '../theme/ThemeToggle'
import { useSidebar } from '../../context/SidebarContext'
import { PanelLeftOpen, PanelLeftClose, Bell, UserCircle, ChevronDown, Home, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import NavigationDrawer from '../ui/navigationDrawer'
import { CalendarComponent } from '../CalendarComponent'
import { TaskComponent } from '../TaskComponent'
import { Chip } from '../ui/chip'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { Button } from '../ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchNotifications } from '@/store/slices/notificationsSlice'
import { useEffect } from 'react'

export function Header() {
  const { toggleMobileSidebar, isMobileOpen } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const dispatch = useAppDispatch()
  const { notifications } = useAppSelector((state) => state.notifications)

  const getBreadcrumb = () => {
    const pathSegments = pathname.split('/').filter(segment => segment)
    const breadcrumbs: { name: string; href: string; icon?: () => React.ReactElement }[] = [{ name: 'Home', href: '/', icon: () => <Home className="w-3.5 h-3.5" /> }]

    let currentPath = ''
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`
      breadcrumbs.push({
        name: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
      })
    })

    return breadcrumbs
  }

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      '/': 'Dashboard',
      '/products': 'Products',
      '/pricing-calculator': 'Pricing Calculator',
      '/competitor-analysis': 'Competitor Analysis',
      '/competitor-sources': 'Competitor Sources',
      '/shipping-details': 'Shipping Details',
      '/all-calculations': 'All Calculations',
      '/reports': 'Reports',
      '/logs': 'Logs',
      '/notifications': 'Notifications',
      '/settings': 'Settings',
    }
    return titles[pathname] || 'Product Pricing'
  }

  const breadcrumbs = getBreadcrumb()

  const toggleDrawer = () => setDrawerOpen(!drawerOpen)

  const handleLogout = async () => {
    try {
      await logout()
      showToast('Logged out successfully', 'success')
      router.push('/login')
    } catch (error) {
      showToast('Logout failed', 'error')
    }
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  useEffect(() => {
      if (user?.token) {
        dispatch(fetchNotifications(user.token))
      }
    }, [dispatch, user?.token])

  return (
    <>
      <header className="bg-background px-4 lg:px-10 py-4 sticky top-0 z-30">
        <div className="flex h-14 items-center justify-between">
          <div className="items-center gap-2 flex">
            <button
                onClick={toggleMobileSidebar}
                className="p-1 lg:hidden block bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
              {isMobileOpen ? <PanelLeftClose className="w-4 h-4 text-primary" /> : <PanelLeftOpen className="w-4 h-4 text-primary" />}
            </button>

            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Page Title */}
              <h1 className="text-lg font-semibold text-primary">{getPageTitle()}</h1>

              {/* Breadcrumb */}
              <nav className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center space-x-1">
                    {index > 0 && <span className="mx-1">/</span>}
                    {crumb.icon && crumb.icon()}
                    <Link href={crumb.href} className="hover:text-foreground transition-colors">
                      {crumb.name}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Header Content */}
          <div className="flex items-center justify-end space-x-2 md:justify-end">
            <nav className="flex items-center gap-2 md:gap-6">
              {/* Notification Bell */}
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors relative cursor-pointer" onClick={() => router.push('/notifications')}>
                <Bell className="w-5 h-5" />
                {/* Optional badge for unread notifications */}
                <Chip size='sm' color='primary' className="absolute top-0 -right-1">
                  {notifications.length}
                </Chip>
              </button>

              {/* User Profile */}
              <button
                onClick={toggleDrawer}
                className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg cursor-pointer"
              >
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                  {user ? getUserInitials(user.name || user.email) : 'U'}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{user?.name || user?.email || 'User'}</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* User Profile Drawer */}
      <NavigationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        location="right"
        title="User Profile"
        width="20rem"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Link href="/user-profile" className="flex items-center space-x-1 p-2 rounded-md hover:bg-muted">
              <UserCircle className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            {/* <Link href="/settings" className="flex items-center space-x-1 p-2 rounded-md hover:bg-muted">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link> */}
            <Button color='error' variant={'tonal'} className="flex items-center space-x-1 p-2 w-full text-left rounded-md" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
          <CalendarComponent />
          {/* <TaskComponent /> */}
        </div>
      </NavigationDrawer>
    </>
  )
}
