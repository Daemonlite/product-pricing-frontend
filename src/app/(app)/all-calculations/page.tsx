'use client'

import React, { useState, useEffect } from 'react'
import {
  Download,
  Grid3X3,
  Zap,
  Headphones,
  Monitor,
  Tablet,
  Package,
  RefreshCw,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import DatePicker from '@/components/ui/date-picker'
import { Dialog } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getAllPricings } from '@/store/slices/pricingSlice'
import { fetchCategories } from '@/store/slices/categoriesSlice'
import { useAuth } from '@/hooks/useAuth'

type Calculation = {
  id: number
  name: string
  category: string
  cost_price: number
  selling_price: number
  margin: number
  profit: number
  created_at: string
  created_at_date: Date | null
  other_costs: number
  stock: number
  import_tax: number
  shipping_cost: number
  total_cost: number
}

const AllCalculations: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { pricings, loading, error } = useAppSelector((state) => state.pricing)
  const { categories: storeCategories } = useAppSelector((state) => state.categories)

  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof Calculation>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedCalculation, setSelectedCalculation] = useState<Calculation | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  

  useEffect(() => {
    if (user?.token) {
      dispatch(getAllPricings(user.token))
      dispatch(fetchCategories(user.token))
    }
  }, [dispatch, user?.token])

  console.log('all:', getAllPricings)

  const columns: { key: keyof Calculation; label: string; sortable?: boolean; format?: (value: number) => string }[] = [
    { key: 'created_at', label: 'Date', sortable: true },
    { key: 'name', label: 'Product', sortable: true },
    { key: 'category', label: 'Category' },
    { key: 'cost_price', label: 'Cost Price', sortable: true, format: (value: number) => `₵${value}` },
    { key: 'selling_price', label: 'Selling Price', sortable: true, format: (value: number) => `₵${value}` },
    { key: 'margin', label: 'Margin', sortable: true, format: (value: number) => `${value.toFixed(1)}%` },
    { key: 'stock', label: 'Quantity', sortable: true },
    { key: 'profit', label: 'Profit', sortable: true, format: (value: number) => `₵${value}` },
  ]

  const handleViewDetails = (item: Calculation) => {
    setSelectedCalculation(item)
    setIsDialogOpen(true)
  }



  const actions = (item: Calculation, index: number) => (
    <div className="flex space-x-2">
      <Button variant="ghost" color="info" size="sm" onClick={() => handleViewDetails(item)}>
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  )

  const onSort = (key: keyof Calculation) => {
    if (key === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(key)
      setSortDirection('asc')
    }
  }

  // Transform API data
  const dataToUse = pricings && pricings.length > 0 ? pricings.map((pricing: any) => {
    const sellingPrice = pricing.products && pricing.products.length > 0 ? pricing.products[0].selling_price : 0;
    const profit = pricing.products && pricing.products.length > 0 ? pricing.products[0].profit || 0 : 0;
    const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
    const createdDate = pricing.created_at ? new Date(pricing.created_at) : null;
    return {
      id: pricing.id,
      name: pricing.products && pricing.products.length > 0 ? pricing.products[0].name : 'Unknown Product',
      category: pricing.products && pricing.products.length > 0 && pricing.products[0].category ? pricing.products[0].category.name : 'Unknown Category',
      cost_price: pricing.products && pricing.products.length > 0 ? pricing.products[0].cost_price : 0,
      selling_price: sellingPrice,
      margin: margin,
      profit: profit,
      created_at: createdDate ? createdDate.toLocaleDateString() : 'N/A',
      created_at_date: createdDate,
      other_costs: pricing.other_costs || 0,
      stock: pricing.products && pricing.products.length > 0 ? pricing.products[0].stock || 1 : 1,
      import_tax: pricing.import_tax || 0,
      shipping_cost: pricing.shipping_cost || 0,
      total_cost: pricing.total_cost || 0,
    };
  }) : []

  // Get categories
  const storeCategoryNames = storeCategories.map(cat => cat.name)
  const uniqueCategories = Array.from(new Set(dataToUse.map(item => item.category)))
  const categories = ['All', ...(storeCategoryNames.length > 0 ? storeCategoryNames : uniqueCategories)]

  const categoryIcons = {
    All: Grid3X3,
    Electronics: Zap,
    Audio: Headphones,
    Computers: Monitor,
    Tablets: Tablet,
    Accessories: Package,
  }

  // Filter calculations by category, date range
  const filteredCalculations = dataToUse
    .filter((calc) => {
      if (selectedCategory === 'All') return true
      return calc.category === selectedCategory
    })
    .filter((calc) => {
      if (!dateRange[0] || !dateRange[1]) return true
      if (!calc.created_at_date) return false
      return calc.created_at_date >= dateRange[0] && calc.created_at_date <= dateRange[1]
    })


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between" style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}>

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold">
            All Pricing Calculations
          </h1>
          <p className="text-sm text-muted-foreground">
            View and analyze all pricing calculations performed in the system
          </p>
        </div>

        {/* Actions */}
        {/* <div className="flex items-center space-x-2">
          <DatePicker id='date' mode='range' placeholder='Select Date' onChange={(dates) => setDateRange(dates as [Date | null, Date | null])} />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div> */}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-card" style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}>
        <div className="px-6 py-6">
          <div className="flex items-center gap-1 scroll-auto overflow-x-auto w-[860px] no-scrollbar">
            {loading ? (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-24" />
                ))}
              </div>
            ) : (
              categories.map((category, index) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons] || Grid3X3
                return (
                  <button
                    key={category}
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    }}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex text-nowrap items-center text-base font-medium cursor-pointer rounded px-6 py-1 transition duration-300 ${selectedCategory === category ? 'text-white bg-primary' : 'text-foreground hover:text-primary'}`}
                  >
                    <Icon className="mr-1 h-4 w-4" />
                    {category}
                  </button>
                )
              })
            )}
          </div>
        </div>
        {loading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ) : (
          <Table searchable data={filteredCalculations} actions={actions} columns={columns} pagination={true} itemsPerPage={10} sortKey={sortField} sortDirection={sortDirection} onSort={onSort} currentPage={currentPage} onPageChange={setCurrentPage} rowStyle={(item, index) => ({ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` })} />
        )}
      </div>

      {/* Margin Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {loading ? (
          <>
            <div className="overflow-hidden rounded-lg bg-card" style={{ animation: `fadeInUp 0.6s ease-out 0.2s both` }}>
              <div className="border-b border-border bg-muted px-6 py-4">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-card" style={{ animation: `fadeInUp 0.6s ease-out 0.4s both` }}>
              <div className="border-b border-border bg-muted px-6 py-4">
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-2 w-full mt-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-card" style={{ animation: `fadeInUp 0.6s ease-out 0.5s both` }}>
              <div className="border-b border-border bg-muted px-6 py-4">
                <Skeleton className="h-6 w-36" />
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-20 mt-1" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-4 w-16 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg bg-card" style={{ animation: `fadeInUp 0.6s ease-out 0.2s both` }}>
              <div className="border-b border-border bg-muted px-6 py-4">
                <h2 className="text-lg font-medium">
                  Margin Summary
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dataToUse.length > 0 ? (
                    <>
                      <div>
                        <p className="text-sm font-medium">
                          Average Margin
                        </p>
                        <p className="text-3xl font-semibold">
                          {(
                            dataToUse.reduce((acc, curr) => acc + curr.margin, 0) /
                            dataToUse.length
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                      {(() => {
                        const knownProducts = dataToUse.filter(item => item.name !== 'Unknown Product')
                        const highest = knownProducts.length > 0 ? knownProducts.reduce(
                          (max, curr) => (curr.margin > max.margin ? curr : max),
                          knownProducts[0],
                        ) : null
                        const lowest = knownProducts.length > 0 ? knownProducts.reduce(
                          (min, curr) => (curr.margin < min.margin ? curr : min),
                          knownProducts[0],
                        ) : null
                        return (
                          <>
                            <div>
                              <p className="text-sm font-medium">
                                Highest Margin
                              </p>
                              <p className="text-lg font-medium">
                                {highest ? `${highest.name} (${highest.margin.toFixed(1)}%)` : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Lowest Margin
                              </p>
                              <p className="text-lg font-medium">
                                {lowest ? `${lowest.name} (${lowest.margin.toFixed(1)}%)` : 'N/A'}
                              </p>
                            </div>
                          </>
                        )
                      })()}
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <p>No pricing data available</p>
                      <p className="text-sm">Perform some pricing calculations to see analytics</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Margin Distribution */}
            <div className="overflow-hidden rounded-lg bg-card" style={{ animation: `fadeInUp 0.6s ease-out 0.4s both` }}>
              <div className="border-b border-border bg-muted px-6 py-4">
                <h2 className="text-lg font-medium">
                  Margin Distribution
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    {
                      range: 'Below 15%',
                      count: dataToUse.filter((c) => c.margin < 15).length,
                      color: 'bg-red-500',
                    },
                    {
                      range: '15% - 20%',
                      count: dataToUse.filter(
                        (c) => c.margin >= 15 && c.margin < 20,
                      ).length,
                      color: 'bg-yellow-500',
                    },
                    {
                      range: '20% - 25%',
                      count: dataToUse.filter(
                        (c) => c.margin >= 20 && c.margin < 25,
                      ).length,
                      color: 'bg-green-500',
                    },
                    {
                      range: 'Above 25%',
                      count: dataToUse.filter((c) => c.margin >= 25).length,
                      color: 'bg-blue-500',
                    },
                  ].map((item, index) => (
                    <div key={index} style={{ animation: `fadeInUp 0.6s ease-out ${(index + 3) * 0.1}s both` }}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {item.range}
                        </span>
                        <span className="text-sm font-medium">
                          {item.count} products
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{
                            width: `${(item.count / dataToUse.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Analysis */}
            <div className="overflow-hidden rounded-lg bg-card" style={{ animation: `fadeInUp 0.6s ease-out 0.5s both` }}>
              <div className="border-b border-border bg-muted px-6 py-4">
                <h2 className="text-lg font-medium">
                  Category Analysis
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '12rem' }}>
                  {(() => {
                    const totalProducts = dataToUse.length
                    return categories
                      .filter((category) => category !== 'All')
                      .map((category, index) => {
                        const categoryCalculations = dataToUse.filter(
                          (c) => c.category === category,
                        )
                        const share = (categoryCalculations.length / totalProducts) * 100
                        return (
                          <div
                            key={category}
                            style={{
                              animation: `fadeInUp 0.6s ease-out ${(index + 4) * 0.1}s both`
                            }}
                            className="flex items-center justify-between rounded-lg border border-border p-4"
                          >
                            <div>
                              <p className="font-medium">{category}</p>
                              <p className="text-sm">
                                {categoryCalculations.length} products
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold">
                                {share.toFixed(1)}%
                              </p>
                              <p className="text-sm">Product Share</p>
                            </div>
                          </div>
                        )
                      })
                  })()}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dialog for detailed view */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Calculation Details"
        size="lg"
      >
        {selectedCalculation && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Product</p>
                <p className="text-lg font-semibold">{selectedCalculation.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="text-lg font-semibold">{selectedCalculation.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost Price</p>
                <p className="text-lg font-semibold">₵{selectedCalculation.cost_price}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Selling Price</p>
                <p className="text-lg font-semibold">₵{selectedCalculation.selling_price}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Margin</p>
                <p className="text-lg font-semibold">{selectedCalculation.margin.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profit</p>
                <p className="text-lg font-semibold">₵{selectedCalculation.profit}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                <p className="text-lg font-semibold">{selectedCalculation.stock}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-lg font-semibold">{selectedCalculation.created_at}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Others</p>
                <p className="text-lg font-semibold">₵{selectedCalculation.other_costs}</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-2">Calculation Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Cost (Cost Price + Others):</span>
                  <span>₵{(Number(selectedCalculation.total_cost) + Number(selectedCalculation.other_costs)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selling Price:</span>
                  <span>₵{selectedCalculation.selling_price}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Profit:</span>
                  <span>₵{selectedCalculation.profit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Margin Percentage:</span>
                  <span>{selectedCalculation.margin.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>


    </div>
  )
}

export default AllCalculations
