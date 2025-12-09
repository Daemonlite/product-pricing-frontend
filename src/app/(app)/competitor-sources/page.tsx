'use client'


import React, { useState } from 'react'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import Input from '@/components/ui/Input-field'
import { Dialog } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { Chip } from '@/components/ui/chip'

const CompetitorSources: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSource, setSelectedSource] = useState<any>(null)
  const [newSource, setNewSource] = useState({
    name: '',
    website: '',
    apiEndpoint: '',
    frequency: 'daily',
  })

  // Sample competitor sources data
  const sources = [
    {
      id: 1,
      name: 'Jumia',
      website: 'https://www.jumia.com.gh',
      apiEndpoint: '/api/products',
      status: 'active',
      lastUpdate: '2023-05-15 09:30:22',
      reliability: 98,
      frequency: 'daily',
      products: 245,
    },
    {
      id: 2,
      name: 'Tonaton',
      website: 'https://www.tonaton.com',
      apiEndpoint: '/api/listings',
      status: 'active',
      lastUpdate: '2023-05-15 10:15:45',
      reliability: 92,
      frequency: 'daily',
      products: 178,
    },
    {
      id: 3,
      name: 'Melcom',
      website: 'https://www.melcom.com',
      apiEndpoint: '/products/feed',
      status: 'active',
      lastUpdate: '2023-05-15 08:45:12',
      reliability: 95,
      frequency: 'daily',
      products: 203,
    },
    {
      id: 4,
      name: 'Electromart',
      website: 'https://www.electromart.com.gh',
      apiEndpoint: '/catalog/api',
      status: 'error',
      lastUpdate: '2023-05-14 14:22:30',
      reliability: 85,
      frequency: 'daily',
      products: 156,
    },
    {
      id: 5,
      name: 'Game',
      website: 'https://www.game.com.gh',
      apiEndpoint: '/products/export',
      status: 'active',
      lastUpdate: '2023-05-15 07:10:18',
      reliability: 90,
      frequency: 'daily',
      products: 189,
    },
    {
      id: 6,
      name: 'CompuGhana',
      website: 'https://www.compughana.com',
      apiEndpoint: '/api/v1/products',
      status: 'warning',
      lastUpdate: '2023-05-14 18:45:33',
      reliability: 87,
      frequency: 'weekly',
      products: 112,
    },
    {
      id: 7,
      name: 'Telefonika',
      website: 'https://www.telefonika.com.gh',
      apiEndpoint: '/catalog/feed',
      status: 'active',
      lastUpdate: '2023-05-15 11:20:05',
      reliability: 93,
      frequency: 'daily',
      products: 134,
    },
    {
      id: 8,
      name: 'FrankieMart',
      website: 'https://www.frankiemart.com',
      apiEndpoint: '/api/products',
      status: 'inactive',
      lastUpdate: '2023-05-10 09:15:22',
      reliability: 75,
      frequency: 'manual',
      products: 86,
    },
  ]

  const filteredSources = sources.filter((source) => {
    if (!searchQuery) return true
    return (
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.website.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleAddSource = () => {
    // In a real app, this would add the source to the database
    alert('Source added successfully!')
    setShowAddModal(false)
    setNewSource({
      name: '',
      website: '',
      apiEndpoint: '',
      frequency: 'daily',
    })
  }

  const handleEditSource = (source: typeof sources[0]) => {
    setSelectedSource(source)
    setNewSource({
      name: source.name,
      website: source.website,
      apiEndpoint: source.apiEndpoint,
      frequency: source.frequency,
    })
    setShowEditModal(true)
  }

  const handleUpdateSource = () => {
    // In a real app, this would update the source in the database
    alert(`Source "${newSource.name}" updated successfully!`)
    setShowEditModal(false)
  }

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteSourceId, setDeleteSourceId] = useState<number | null>(null)

  const handleDeleteSource = (sourceId: number) => {
    setDeleteSourceId(sourceId)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteSource = () => {
    if (deleteSourceId !== null) {
      // In a real app, this would delete the source from the database
      alert(`Source #${deleteSourceId} deleted successfully!`)
      setDeleteSourceId(null)
      setShowDeleteConfirm(false)
    }
  }

  const cancelDeleteSource = () => {
    setDeleteSourceId(null)
    setShowDeleteConfirm(false)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setNewSource((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case 'error':
        return <X className="h-4 w-4 text-error" />
      case 'inactive':
        return <Clock className="h-4 w-4 text-muted-foreground" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'warning':
        return 'Warning'
      case 'error':
        return 'Error'
      case 'inactive':
        return 'Inactive'
      default:
        return status
    }
  }

  const tableColumns = [
    {
      key: 'name' as const,
      label: 'Source',
      render: (value: string, row: typeof sources[0]) => (
        <div className="text-sm font-medium text-foreground">
          {value}
        </div>
      ),
    },
    {
      key: 'website' as const,
      label: 'Website',
      render: (value: string, row: typeof sources[0]) => (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-primary hover:text-primary/80"
        >
          {value.replace(/(^\w+:|^)\/\//, '')}
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      ),
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string, row: typeof sources[0]) => (
        <div className="flex items-center">
          {getStatusIcon(value)}
          <Chip
            variant="tonal"
            color={
              value === 'active' ? 'success' :
              value === 'warning' ? 'warning' :
              value === 'error' ? 'error' : 'default'
            }
            className="ml-2"
          >
            {getStatusText(value)}
          </Chip>
        </div>
      ),
    },
    {
      key: 'lastUpdate' as const,
      label: 'Last Update',
      render: (value: string, row: typeof sources[0]) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          {value}
        </div>
      ),
    },
    {
      key: 'reliability' as const,
      label: 'Reliability',
      render: (value: number, row: typeof sources[0]) => (
        <div className="flex items-center">
          <div className="w-16 bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                value >= 90 ? 'bg-success' :
                value >= 80 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm text-foreground">{value}%</span>
        </div>
      ),
    },
    {
      key: 'frequency' as const,
      label: 'Frequency',
      render: (value: string, row: typeof sources[0]) => (
        <div className="text-sm text-muted-foreground">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </div>
      ),
    },
    {
      key: 'products' as const,
      label: 'Products',
      render: (value: number, row: typeof sources[0]) => (
        <div className="text-sm text-foreground">{value}</div>
      ),
    },
  ]

  const tableActions = (item: any) => (
    <>
      <Button
        variant="ghost"
        color="info"
        size="icon"
        onClick={() => handleEditSource(item)}
        className="mr-2"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        color="error"
        onClick={() => handleDeleteSource(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0" style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Competitor Sources</h1>
          <p className="text-muted-foreground">
            Manage data sources for competitor price monitoring
          </p>
        </div>

        <Button onClick={() => setShowAddModal(true)} startIcon={<Plus />}>
          Add Source
        </Button>
      </div>

      <Table
        data={filteredSources}
        columns={tableColumns}
        actions={tableActions}
        searchable
        pagination={true}
        itemsPerPage={10}
        rowStyle={(item, index) => ({ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` })}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-card shadow border border-border" style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}>
          <div className="border-b border-border bg-muted px-6 py-4">
            <h2 className="text-lg font-medium text-foreground">
              Source Status Summary
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-lg bg-success/10 p-4" style={{ animation: `fadeInUp 0.6s ease-out 0.2s both` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-success" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-success">
                        Active
                      </p>
                      <p className="text-2xl font-semibold text-success">
                        {sources.filter((s) => s.status === 'active').length}
                      </p>
                    </div>
                  </div>
                  <Chip variant="tonal" color="success">
                    {Math.round(
                      (sources.filter((s) => s.status === 'active').length /
                        sources.length) *
                        100,
                    )}
                    %
                  </Chip>
                </div>
              </div>
              <div className="rounded-lg bg-warning/10 p-4" style={{ animation: `fadeInUp 0.6s ease-out 0.3s both` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-warning" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-warning">
                        Warning
                      </p>
                      <p className="text-2xl font-semibold text-warning">
                        {sources.filter((s) => s.status === 'warning').length}
                      </p>
                    </div>
                  </div>
                  <Chip variant="tonal" color="warning">
                    {Math.round(
                      (sources.filter((s) => s.status === 'warning').length /
                        sources.length) *
                        100,
                    )}
                    %
                  </Chip>
                </div>
              </div>
              <div className="rounded-lg bg-error/10 p-4" style={{ animation: `fadeInUp 0.6s ease-out 0.4s both` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <X className="h-8 w-8 text-error" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-error">Error</p>
                      <p className="text-2xl font-semibold text-error">
                        {sources.filter((s) => s.status === 'error').length}
                      </p>
                    </div>
                  </div>
                  <Chip variant="tonal" color="error">
                    {Math.round(
                      (sources.filter((s) => s.status === 'error').length /
                        sources.length) *
                        100,
                    )}
                    %
                  </Chip>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-4" style={{ animation: `fadeInUp 0.6s ease-out 0.5s both` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-muted-foreground">
                        Inactive
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {sources.filter((s) => s.status === 'inactive').length}
                      </p>
                    </div>
                  </div>
                  <Chip variant="tonal">
                    {Math.round(
                      (sources.filter((s) => s.status === 'inactive').length /
                        sources.length) *
                        100,
                    )}
                    %
                  </Chip>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reliability */}
        <div className="overflow-hidden rounded-lg bg-card shadow border border-border" style={{ animation: `fadeInUp 0.6s ease-out 0.6s both` }}>
          <div className="border-b border-border bg-muted px-6 py-4">
            <h2 className="text-lg font-medium text-foreground">
              Reliability Overview
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Average Reliability
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {Math.round(
                      sources.reduce((acc, curr) => acc + curr.reliability, 0) /
                        sources.length,
                    )}
                    %
                  </span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${Math.round(sources.reduce((acc, curr) => acc + curr.reliability, 0) / sources.length)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="mt-6 space-y-4 overflow-y-auto" style={{ maxHeight: '10rem' }}>
                <p className="text-sm font-medium text-foreground">
                  Reliability by Source
                </p>
                {sources
                  .sort((a, b) => b.reliability - a.reliability)
                  .slice(0, 5)
                  .map((source, index) => (
                    <div key={source.id} style={{ animation: `fadeInUp 0.6s ease-out ${(index + 7) * 0.1}s both` }}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {source.name}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {source.reliability}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div
                          className={`h-2 rounded-full ${
                            source.reliability >= 90 ? 'bg-success' :
                            source.reliability >= 80 ? 'bg-warning' : 'bg-error'
                          }`}
                          style={{
                            width: `${source.reliability}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Source Modal */}
      <Dialog
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
        }}
        size="xl"
        color={showAddModal ? 'primary' : 'info'}
        title={showAddModal ? "Add New Competitor Source" : "Edit Competitor Source"}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false)
                setShowEditModal(false)
              }}
            >
              Cancel
            </Button>
            {showAddModal ? (
              <Button onClick={handleAddSource} startIcon={<Save className='h-4 w-4' />}>
                Add Source
              </Button>
            ) : (
              <Button onClick={handleUpdateSource} startIcon={<Save className='h-4 w-4' />}>
                Save Changes
              </Button>
            )}
          </>
        }
      >
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Input
              label="Source Name"
              type="text"
              name="name"
              value={newSource.name}
              onChange={handleInputChange}
              required
              placeholder="Source Name"
            />
          </div>
          <div className="sm:col-span-3">
            <Input
              label="Website URL"
              type="url"
              name="website"
              value={newSource.website}
              onChange={handleInputChange}
              required
              placeholder="https://example.com"
            />
          </div>
          <div className="sm:col-span-3">
            <Input
              label="API Endpoint"
              type="text"
              name="apiEndpoint"
              value={newSource.apiEndpoint}
              onChange={handleInputChange}
              placeholder="/api/products"
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              label="Update Frequency"
              options={[
                { value: 'hourly', label: 'Hourly' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'manual', label: 'Manual' },
              ]}
              value={newSource.frequency}
              onChange={(value) => setNewSource(prev => ({ ...prev, frequency: value as string }))}
              required
              placeholder='Select Frequency'
            />
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteConfirm}
        onClose={cancelDeleteSource}
        title="Confirm Delete"
        color="error"
        actions={
          <>
            <Button variant="outline" onClick={cancelDeleteSource}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteSource}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground pb-4">Are you sure you want to delete this competitor source?</p>
      </Dialog>
    </div>
  )
}

export default CompetitorSources
