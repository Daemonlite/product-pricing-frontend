'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Bell,
  Settings,
  TrendingDown,
  AlertTriangle,
  Clock,
  Check,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { Tabs } from '@/components/ui/tabs'
import { Table } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchNotifications, markAllNotificationsAsRead, markOneNotificationAsRead } from '@/store/slices/notificationsSlice'
import { useAuth } from '@/context/AuthContext'

const NotificationsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedType, setSelectedType] = useState('all')
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { notifications, loading, error } = useAppSelector((state) => state.notifications)

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchNotifications(user.token))
    }
  }, [dispatch, user?.token])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedType])

  // Filter notifications based on selected type
  const normalizedNotifications = useMemo(() => {
    return notifications.map((n: any) => ({ ...n, read: (n.is_read ?? n.read) }))
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    if (selectedType === 'all') {
      return normalizedNotifications
    } else {
      return normalizedNotifications.filter((notification) => notification.type === selectedType)
    }
  }, [normalizedNotifications, selectedType])

  const getIcon = (type: string) => {
    switch (type) {
      case 'price_drop':
        return <TrendingDown className="h-5 w-5 text-destructive" />
      case 'margin_warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />
      case 'outdated':
        return <Clock className="h-5 w-5 text-info" />
      case 'system':
        return <Bell className="h-5 w-5 text-primary" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  const columns: any = [
    {
      key: 'type' as const,
      label: 'Type',
      render: (value: any) => (
        <div className="flex items-center">
          {getIcon(value)}
        </div>
      ),
    },
    {
      key: 'message' as const,
      label: 'Message',
    },
    {
      key: 'timestamp' as const,
      label: 'Time',
    },
    {
      key: 'read' as const,
      label: 'Status',
      render: (value: any) => (
        <Chip variant="tonal" color={value ? 'success' : 'warning'}>
          {value ? 'Read' : 'Unread'}
        </Chip>
      ),
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          {!row.read && (
            <Button size="sm" variant="tonal" color={'success'} onClick={() => {
              if (user?.token) {
                dispatch(markOneNotificationAsRead({ token: user.token, uid: row.uid }))
              }
            }}>
              <Check className="mr-1 h-3 w-3" />
              Mark as Read
            </Button>
          )}
        </div>
      ),
    },
  ]

  const notificationTable = (
    <Table
      data={filteredNotifications}
      columns={columns}
      pagination
      itemsPerPage={5}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      emptyStateTitle="No notifications found"
      emptyStateDescription="Try adjusting your filter to find what you're looking for."
      rowStyle={(item, index) => ({ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` })}
      className='text-nowrap'
    />
  )

  const tabs = [
    {
      id: 'all',
      label: 'All',
      content: notificationTable,
    },
    {
      id: 'price_drop',
      label: 'Price Drops',
      startIcon: <TrendingDown className="h-4 w-4" />,
      content: notificationTable,
    },
    {
      id: 'margin_warning',
      label: 'Margin Alerts',
      startIcon: <AlertTriangle className="h-4 w-4" />,
      content: notificationTable,
    },
    {
      id: 'outdated',
      label: 'Outdated',
      startIcon: <Clock className="h-4 w-4" />,
      content: notificationTable,
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton shape="text" size="xl" width="250px" />
          <Skeleton shape="text" size="md" width="350px" />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div></div>
            <Skeleton size="md" width="160px" height="40px" />
          </div>
          <div className="flex space-x-6 mb-6">
            <Skeleton size="md" width="60px" height="32px" />
            <Skeleton size="md" width="100px" height="32px" />
            <Skeleton size="md" width="110px" height="32px" />
            <Skeleton size="md" width="80px" height="32px" />
          </div>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-4">
              <div className="grid grid-cols-5 gap-4">
                <Skeleton shape="text" size="sm" />
                <Skeleton shape="text" size="sm" />
                <Skeleton shape="text" size="sm" />
                <Skeleton shape="text" size="sm" />
                <Skeleton shape="text" size="sm" />
              </div>
            </div>
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 items-center">
                  <Skeleton size="md" width="40px" height="40px" shape="circle" />
                  <Skeleton shape="text" size="md" width="80%" />
                  <Skeleton shape="text" size="md" width="60%" />
                  <Skeleton size="sm" width="60px" />
                  <Skeleton size="sm" width="100px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}>
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with price changes and alerts
        </p>
      </div>

      <div style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}>
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <Button
            onClick={() => {
              if (user?.token) {
                dispatch(markAllNotificationsAsRead(user.token))
              }
            }}
            disabled={loading}
            variant="outline"
            color="primary"
          >
            Mark All as Read
          </Button>
        </div>
        <Tabs
          tabs={tabs}
          defaultActiveId={selectedType}
          onTabChange={setSelectedType}
          variant="filled"
        />
      </div>
    </div>
  )
}

export default NotificationsPage
