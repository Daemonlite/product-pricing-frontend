'use client'

import React, { useState, useEffect } from 'react'
import {
  Search,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  X,
  Save,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/Input-field'
import { Dialog } from '@/components/ui/dialog'
import { Table } from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import { Select } from '@/components/ui/select'
import { Tabs } from '@/components/ui/tabs'

const CompetitorAnalysis: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddCompetitorModal, setShowAddCompetitorModal] = useState(false)
  const [showAdjustPriceModal, setShowAdjustPriceModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedCompetitor, setSelectedCompetitor] = useState('')
  const [activeTab, setActiveTab] = useState('select')
  const [manualName, setManualName] = useState('')
  const [manualPrice, setManualPrice] = useState('')

  const competitorsList = [
    { name: 'Amazon', price: 1000, url: 'https://amazon.com' },
    { name: 'Ebay', price: 950, url: 'https://ebay.com' },
    { name: 'Walmart', price: 980, url: 'https://walmart.com' },
    { name: 'Target', price: 970, url: 'https://target.com' },
    { name: 'BestBuy', price: 990, url: 'https://bestbuy.com' },
    { name: 'NewEgg', price: 960, url: 'https://newegg.com' },
    { name: 'Overstock', price: 940, url: 'https://overstock.com' },
  ]
  const [adjustedPrice, setAdjustedPrice] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(4)
  const [tablePages, setTablePages] = useState<Record<string, number>>({})
  const [competitorData, setCompetitorData] = useState([
    {
      product: 'iPhone 13 Pro',
      yourPrice: 999,
      competitors: [
        {
          name: 'Jumia',
          price: 1049,
          difference: -50,
          url: '#',
        },
        {
          name: 'Tonaton',
          price: 979,
          difference: 20,
          url: '#',
        },
        {
          name: 'Melcom',
          price: 1029,
          difference: -30,
          url: '#',
        },
      ],
      lastUpdated: '2 hours ago',
    },
    {
      product: 'Samsung Galaxy S21',
      yourPrice: 849,
      competitors: [
        {
          name: 'Jumia',
          price: 899,
          difference: -50,
          url: '#',
        },
        {
          name: 'Tonaton',
          price: 829,
          difference: 20,
          url: '#',
        },
        {
          name: 'Melcom',
          price: 879,
          difference: -30,
          url: '#',
        },
      ],
      lastUpdated: '3 hours ago',
    },
    {
      product: 'AirPods Pro',
      yourPrice: 249,
      competitors: [
        {
          name: 'Jumia',
          price: 259,
          difference: -10,
          url: '#',
        },
        {
          name: 'Tonaton',
          price: 239,
          difference: 10,
          url: '#',
        },
        {
          name: 'Melcom',
          price: 249,
          difference: 0,
          url: '#',
        },
      ],
      lastUpdated: '5 hours ago',
    },
    {
      product: 'iPad Mini',
      yourPrice: 499,
      competitors: [
        {
          name: 'Jumia',
          price: 519,
          difference: -20,
          url: '#',
        },
        {
          name: 'Tonaton',
          price: 489,
          difference: 10,
          url: '#',
        },
        {
          name: 'Melcom',
          price: 509,
          difference: -10,
          url: '#',
        },
      ],
      lastUpdated: '8 hours ago',
    },
    {
      product: 'MacBook Air M1',
      yourPrice: 1299,
      competitors: [
        {
          name: 'Jumia',
          price: 1349,
          difference: -50,
          url: '#',
        },
        {
          name: 'Tonaton',
          price: 1279,
          difference: 20,
          url: '#',
        },
        {
          name: 'Melcom',
          price: 1319,
          difference: -20,
          url: '#',
        },
      ],
      lastUpdated: '12 hours ago',
    },
  ])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const filteredData = searchQuery ? competitorData.filter(item => item.product.toLowerCase().includes(searchQuery.toLowerCase())) : competitorData
  const getPriceStatus = (competitors: any[]) => {
    const lowerPrices = competitors.filter((c) => c.difference < 0).length
    const equalPrices = competitors.filter((c) => c.difference === 0).length
    const higherPrices = competitors.filter((c) => c.difference > 0).length
    if (lowerPrices > higherPrices) {
      return {
        status: 'Underpriced',
        icon: <TrendingDown className="mr-1 h-4 w-4 text-success" />,
        color: 'text-success',
      }
    } else if (higherPrices > lowerPrices) {
      return {
        status: 'Overpriced',
        icon: <TrendingUp className="mr-1 h-4 w-4 text-destructive" />,
        color: 'text-destructive',
      }
    } else {
      return {
        status: 'Competitive',
        icon: <AlertTriangle className="mr-1 h-4 w-4 text-warning" />,
        color: 'text-warning',
      }
    }
  }

  const calculateSuggestedPrice = (competitors: any[]) => {
    const sum = competitors.reduce((acc, comp) => acc + comp.price, 0)
    return sum / competitors.length
  }

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === 'select') {
      const competitor = competitorsList.find(c => c.name === selectedCompetitor)
      if (competitor) {
        setCompetitorData(prev => prev.map(prod =>
          prod.product === selectedProduct.product ?
            { ...prod, competitors: [...prod.competitors, { name: competitor.name, price: competitor.price, difference: competitor.price - prod.yourPrice, url: competitor.url }] }
            : prod
        ))
      }
    } else if (activeTab === 'manual') {
      const price = parseFloat(manualPrice)
      if (manualName && !isNaN(price)) {
        setCompetitorData(prev => prev.map(prod =>
          prod.product === selectedProduct.product ?
            { ...prod, competitors: [...prod.competitors, { name: manualName, price, difference: price - prod.yourPrice, url: '#' }] }
            : prod
        ))
      }
    }
    setShowAddCompetitorModal(false)
    setSelectedCompetitor('')
    setManualName('')
    setManualPrice('')
  }
  const handleAdjustPrice = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would update the product price in the database
    alert(`Price for ${selectedProduct.product} adjusted to ₵${adjustedPrice}`)
    setShowAdjustPriceModal(false)
    setAdjustedPrice('')
  }
  const openAddCompetitorModal = (product: any) => {
    setSelectedProduct(product)
    setActiveTab('select')
    setShowAddCompetitorModal(true)
  }

  const openAdjustPriceModal = (product: any) => {
    setSelectedProduct(product)
    setAdjustedPrice(product.yourPrice.toString())
    setShowAdjustPriceModal(true)
  }

  const openAdjustPriceModalWithSuggestion = (product: any, suggested: number) => {
    setSelectedProduct(product)
    setAdjustedPrice(suggested.toString())
    setShowAdjustPriceModal(true)
  }



  const removeCompetitor = (productName: string, competitorName: string) => {
    setCompetitorData(prev => prev.map(prod =>
      prod.product === productName ?
        { ...prod, competitors: prod.competitors.filter(c => c.name !== competitorName) }
        : prod
    ))
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const tabs = [
    {
      id: 'select',
      label: 'Select Competitor',
      content: (
        <Select
          label="Competitor Name"
          clearable
          searchable
          placeholder='Select a competitor'
          value={selectedCompetitor}
          onChange={(value) => setSelectedCompetitor(value as string)}
          required
          options={[
            { value: 'Amazon', label: 'Amazon' },
            { value: 'Ebay', label: 'Ebay' },
            { value: 'Walmart', label: 'Walmart' },
            { value: 'Target', label: 'Target' },
            { value: 'BestBuy', label: 'BestBuy' },
            { value: 'NewEgg', label: 'NewEgg' },
            { value: 'Overstock', label: 'Overstock' },
          ]}
        />
      ),
    },
    {
      id: 'manual',
      label: 'Manual Entry',
      content: (
        <div className="space-y-4">
          <Input
            label="Competitor Name"
            type="text"
            placeholder="Enter competitor name"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            required
          />
          <Input
            label="Price (₵)"
            type="number"
            placeholder="Enter price"
            value={parseFloat(manualPrice) || 0}
            onChange={(e) => setManualPrice(e.target.value)}
            required
            min="0"
            step={1}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}>
        <h1 className="text-2xl font-bold text-foreground">
          Competitor Analysis
        </h1>
        <p className="text-muted-foreground">
          Monitor and compare your prices with competitors
        </p>
      </div>
      <div className="rounded-lg bg-card p-6 shadow" style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}>
        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex w-full max-w-md items-center rounded-md border border-border">
            <Input
              startIcon={<Search className="mr-2 h-4 w-4" />}
              type="text"
              placeholder="Search for a product to analyze..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus:ring-0"
              clearable
            />
          </div>
        </div>

        <div className="mt-4 space-y-6">
          {paginatedData.map((item, index) => {
            const data = [
              { store: 'Your Store', price: item.yourPrice, difference: '-', source: '-', action: '' },
              ...item.competitors.map(comp => ({ store: comp.name, price: comp.price, difference: comp.difference, source: comp.url, action: comp.name }))
            ]
            const columns = [
              { key: 'store' as const, label: 'Store', sortable: true, render: (v: any, row: any) => row.store === 'Your Store' ? <span className="font-medium text-primary">{v}</span> : v },
              { key: 'price' as const, label: 'Price', sortable: true, format: (v: any) => `₵${v}` },
              { key: 'difference' as const, label: 'Difference', sortable: true, render: (v: any, row: any) => row.store === 'Your Store' ? '-' : (v > 0 ? `+${v}` : v), cellClass: (row: any) => row.store === 'Your Store' ? '' : (row.difference > 0 ? 'text-success' : row.difference < 0 ? 'text-destructive' : 'text-muted-foreground') },
              { key: 'source' as const, label: 'Source', sortable: false, render: (v: any, row: any) => row.store === 'Your Store' ? '-' : <a href={v} className="inline-flex items-center text-sm text-primary hover:text-primary/80">View <ExternalLink className="ml-1 h-3 w-3" /></a> },
              { key: 'action' as const, label: 'Action', sortable: false, render: (v: any, row: any) => row.store === 'Your Store' ? '' : <Button variant="tonal" color={'error'} size="sm" onClick={() => removeCompetitor(item.product, v)}><X className="h-4 w-4" /></Button> },
            ]
            const suggestedPrice = calculateSuggestedPrice(item.competitors)
            return (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-border"
                style={{ animation: `fadeInUp 0.6s ease-out ${(index + 2) * 0.1}s both` }}
              >
                <div className="border-b border-border bg-muted px-6 py-3">
                  <div className="flex flex-wrap items-center justify-between">
                    <h3 className="text-lg font-medium text-foreground">
                      {item.product}
                    </h3>
                    <div className="mt-1 flex items-center sm:mt-0 gap-2">
                      <span className="mr-2 text-sm text-muted-foreground">
                        Last updated: {item.lastUpdated}
                      </span>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table
                    data={data}
                    columns={columns}
                    searchable={false}
                    pagination={true}
                    itemsPerPage={5}
                    currentPage={tablePages[item.product] || 1}
                    onPageChange={(page) => setTablePages(prev => ({...prev, [item.product]: page}))}
                    hoverable={false}
                    rowStyle={(row, rowIndex) => ({ animation: `fadeInUp 0.6s ease-out ${rowIndex * 0.1}s both` })}
                  />
                </div>
                <div className="border-t border-border bg-muted px-6 py-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-foreground">Market Position:</span>
                    <span
                      className={`ml-2 flex items-center text-sm ${getPriceStatus(item.competitors).color}`}
                    >
                      {getPriceStatus(item.competitors).icon}
                      {getPriceStatus(item.competitors).status}
                    </span>
                    <span className="ml-4 text-sm font-medium text-foreground">Suggested Price: ₵{suggestedPrice.toFixed(2)}</span>
                    <div className="ml-auto flex space-x-2">
                      <Button
                        onClick={() => openAdjustPriceModalWithSuggestion(item, suggestedPrice)}
                        variant="secondary"
                        size="sm"
                      >
                        Apply Suggested Price
                      </Button>
                      <Button
                        onClick={() => openAddCompetitorModal(item)}
                        variant="outline"
                        size="sm"
                      >
                        Add Competitor
                      </Button>
                      <Button
                        onClick={() => openAdjustPriceModal(item)}
                        variant="primary"
                        size="sm"
                      >
                        Adjust Price
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          itemsPerPageOptions={[4]}
          className="mt-4"
        />
      </div>

      {/* Add Competitor Modal */}
      <Dialog
        isOpen={showAddCompetitorModal}
        onClose={() => setShowAddCompetitorModal(false)}
        title={`Add Competitor for ${selectedProduct?.product}`}
        size="xl"
        color="primary"
        actions={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddCompetitorModal(false)}>Cancel</Button>
            <Button type="submit" form="add-competitor-form">Add Competitor</Button>
          </div>
        }
      >
        <form onSubmit={handleAddCompetitor}>
          <Tabs
            variant='filled'
            tabs={tabs}
            onTabChange={(id) => {
              setActiveTab(id);
              setSelectedCompetitor('');
              setManualName('');
              setManualPrice('');
            }}
          />
        </form>
      </Dialog>

      {/* Adjust Price Modal */}
      <Dialog
        isOpen={showAdjustPriceModal}
        onClose={() => setShowAdjustPriceModal(false)}
        title={`Adjust Price for ${selectedProduct?.product}`}
        size="xl"
        color="primary"
        actions={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAdjustPriceModal(false)}>Cancel</Button>
            <Button type="submit" form="adjust-price-form">Adjust Price</Button>
          </div>
        }
      >
        <form onSubmit={handleAdjustPrice}>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Current price:{' '}
              <span className="font-medium text-foreground">
                ₵{selectedProduct?.yourPrice}
              </span>
            </p>
          </div>
          <Input
            label="New Price (₵)"
            type="number"
            name="adjustedPrice"
            value={adjustedPrice}
            onChange={(e) => setAdjustedPrice(e.target.value)}
            required
            min="0"
            step={0.01}
          />
        </form>
      </Dialog>
    </div>
  )
}
export default CompetitorAnalysis
