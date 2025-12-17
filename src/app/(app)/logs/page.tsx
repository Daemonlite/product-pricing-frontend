'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/Input-field'
import { Chip } from '@/components/ui/chip'
import { Table } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppSelector } from '@/store/hooks'
import { RootState, AppDispatch } from '@/store/store'
import { fetchLogs } from '@/store/slices/logsSlice'
import { useAuth } from '@/context/AuthContext'
import { useDispatch, useSelector } from 'react-redux'

const LogsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { logs: logs, loading, error } = useSelector((state: RootState) => state.logs)
  const { user } = useAuth()

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLogType, setSelectedLogType] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<keyof typeof logs[0] | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchLogs(user.token))
    }
  }, [dispatch, user?.token])

  const handleSort = (column: any) => {
    if (column === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(column)
      setSortDirection('asc')
    }
  }

  const handleRefresh = () => {
    if (user?.token) {
      dispatch(fetchLogs(user.token))
    }
  }

  const logTypes = ['All', 'Info', 'Success', 'Warning', 'Error']

  // Filter logs by type and search query
  const filteredLogs = useMemo(() => {
    let filtered = logs
    if (selectedLogType !== 'All') {
      filtered = filtered.filter((log) => log.type?.toLowerCase() === selectedLogType.toLowerCase())
    }
    if (searchQuery) {
      filtered = filtered.filter((log) =>
        log.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [logs, selectedLogType, searchQuery])

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-info" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getLogColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'info'
      case 'success':
        return 'success'
      case 'warning':
        return 'warning'
      case 'error':
        return 'error'
      default:
        return 'default'
    }
  }

  const columns = [
    {
      key: 'action_type' as keyof typeof logs[0],
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center">
          {getLogIcon(row.type)}
          <Chip
            className="ml-2"
            variant="tonal"
            color={getLogColor(row.type)}
          >
            {row.action_type ? row.action_type.charAt(0).toUpperCase() + row.action_type.slice(1) : 'Unknown'}
          </Chip>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'ip_address' as keyof typeof logs[0],
      label: 'IP Address',
    },
    {
      key: 'user' as keyof typeof logs[0],
      label: 'User',
      render: (value: any, row: any) => (
        <div className="text-sm text-foreground">
          {row.user?.full_name}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'timestamp' as keyof typeof logs[0],
      label: 'Timestamp',
      render: (value: any) => (
        <div className="flex items-center text-muted-foreground">
          {value}
        </div>
      ),
    },
    {
      key: 'description' as keyof typeof logs[0],
      label: 'Details',
      render: (value: any) => (
        <div><pre className="whitespace-pre-wrap break-words text-sm text-foreground">{value}</pre></div>
      ) 
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0" style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}>
        {loading ? (
          <Skeleton className="h-10 w-48 rounded-lg" />
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-foreground">System Logs</h1>
            <p className="text-muted-foreground">View system activity and event history</p>
          </div>
        )}
      </div>

      <div className="flex space-x-2 text-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}>
        {logTypes.map((type, index) => (
          <Button
            key={type}
            onClick={() => setSelectedLogType(type)}
            variant={selectedLogType === type ? 'primary' : 'ghost'}
            className='px-6 py-3'
            style={{ animation: `fadeInUp 0.6s ease-out ${(index + 2) * 0.1}s both` }}
          >
            {type}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : (
        <Table
          data={filteredLogs}
          columns={columns}
          searchable
          pagination={true}
          itemsPerPage={10}
          itemsPerPageOptions={[5, 10, 25]}
          searchPlaceholder="Search logs..."
          sortKey={sortKey as keyof typeof logs[0]}
          sortDirection={sortDirection}
          onSort={handleSort}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          emptyStateTitle="No logs found"
          emptyStateDescription="Try adjusting your search or filter to find what you're looking for."
          rowStyle={(item, index) => ({ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` })}
        />
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {loading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : (
          <div className="overflow-hidden rounded-lg bg-card shadow border border-border" style={{ animation: `fadeInUp 0.6s ease-out 0.2s both` }}>
            <div className="border-b border-border bg-muted px-6 py-4">
              <h2 className="text-lg font-medium text-foreground">Log Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {['info', 'success', 'warning', 'error'].map((type, index) => (
                  <div key={type} className="flex items-center justify-between" style={{ animation: `fadeInUp 0.6s ease-out ${(index + 3) * 0.1}s both` }}>
                    <div className="flex items-center">
                      {getLogIcon(type)}
                      <span className="ml-2 text-sm font-medium text-foreground capitalize">
                        {type}
                      </span>
                    </div>
                    <Chip variant="tonal" color={getLogColor(type)}>
                      {logs.filter((log) => log.type === type).length}
                    </Chip>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : (
          <div className="overflow-hidden rounded-lg bg-card shadow border border-border" style={{ animation: `fadeInUp 0.6s ease-out 0.3s both` }}>
            <div className="border-b border-border bg-muted px-6 py-4">
              <h2 className="text-lg font-medium text-foreground">User Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {logs.reduce((acc: any[], log) => {
                  const userName = log.user?.full_name
                  const existing = acc.find(item => item.user === userName)
                  if (existing) {
                    existing.count += 1
                  } else {
                    acc.push({ user: userName, count: 1 })
                  }
                  return acc
                }, []).slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between" style={{ animation: `fadeInUp 0.6s ease-out ${(index + 7) * 0.1}s both` }}>
                    <span className="text-sm font-medium text-foreground">{item.user}</span>
                    <Chip variant="tonal" color="primary">
                      {item.count} events
                    </Chip>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : (
          <div className="overflow-hidden rounded-lg bg-card shadow border border-border" style={{ animation: `fadeInUp 0.6s ease-out 0.4s both` }}>
            <div className="border-b border-border bg-muted px-6 py-4">
              <h2 className="text-lg font-medium text-foreground">Recent Errors</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {logs
                  .filter((log) => log.type === 'error')
                  .slice(0, 3)
                  .map((log, index) => (
                    <div key={index} className="rounded-md border border-error/20 bg-error/10 p-4" style={{ animation: `fadeInUp 0.6s ease-out ${(index + 12) * 0.1}s both` }}>
                      <div className="flex">
                        <XCircle className="h-5 w-5 text-error flex-shrink-0" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-error">{log.action_type}</h3>
                          <div className="mt-1 text-xs text-error/60">{log.timestamp}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                {logs.filter((log) => log.type === 'error').length === 0 && (
                  <div className="rounded-md border border-success/20 bg-success/10 p-4" style={{ animation: `fadeInUp 0.6s ease-out 1.5s both` }}>
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-success">No errors</h3>
                        <div className="mt-2 text-sm text-success/80">
                          <p>No error logs recorded in the system.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LogsPage
