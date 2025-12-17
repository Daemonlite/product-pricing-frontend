'use client'

import React from 'react'
import { Table } from './table'

interface Product {
  id: number
  uid: string
  name: string
  cost_price: string
  selling_price: string
}

interface PricingCalculator {
  id: number
  uid: string
  products: Product[]
  shipping_cost: string
  import_tax: string
  other_costs: string
  other_cost_type: 'fixed' | 'percentage'
  total_cost: string
  created_at: string
  updated_at: string
  [key: string]: any
}

interface TableRow {
  productsCount: number
  shippingCost: number | null
  importTax: number | null
  otherCosts: number | null
  otherCostType: 'fixed' | 'percentage' | null
  totalCost: number | null
}

const RecentProductsTable: React.FC<{ pricingCalculators?: PricingCalculator[] }> = ({ 
  pricingCalculators = [] 
}) => {
  // Normalize pricing calculator objects from API to the table shape
  const normalized: TableRow[] = pricingCalculators.map((calc) => {
    return {
      productsCount: calc.products ? calc.products.length : 0,
      shippingCost: calc.shipping_cost ? parseFloat(calc.shipping_cost) : null,
      importTax: calc.import_tax ? parseFloat(calc.import_tax) : null,
      otherCosts: calc.other_costs ? parseFloat(calc.other_costs) : null,
      otherCostType: calc.other_cost_type || null,
      totalCost: calc.total_cost ? parseFloat(calc.total_cost) : null,
    }
  })

  console.log('normalized data for debugging:', normalized)

  const formatCurrency = (value: number | null): string => 
    value != null ? `₵${value.toFixed(2)}` : '—'

  // Option 1: If your Table component passes the entire row
  const formatOtherCostsWithRow = (value: number | null, row: TableRow): string => {
    if (value == null) return '—'
    
    // Check if this row has percentage type
    if (row?.otherCostType === 'percentage') {
      return `${value}%`
    }
    
    return formatCurrency(value)
  }

  // Option 2: If your Table component only passes the value
  // We'll include the type in the normalized data
  const formatOtherCostsValueOnly = (value: number | null): string => {
    if (value == null) return '—'
    
    // Since we can't access the row, we need a different approach
    // This won't work for our case since we need the row context
    return formatCurrency(value)
  }

  // Let's try a different approach - pre-format the data
  const preFormattedData = normalized.map(row => ({
    ...row,
    // Pre-format the otherCosts based on the type
    formattedOtherCosts: row.otherCosts != null 
      ? row.otherCostType === 'percentage' 
        ? `${row.otherCosts}%`
        : `₵${row.otherCosts.toFixed(2)}`
      : '—',
    // Format other currency fields
    formattedShippingCost: row.shippingCost != null ? `₵${row.shippingCost.toFixed(2)}` : '—',
    formattedImportTax: row.importTax != null ? `₵${row.importTax.toFixed(2)}` : '—',
    formattedTotalCost: row.totalCost != null ? `₵${row.totalCost.toFixed(2)}` : '—',
  }))

  console.log('preFormattedData:', preFormattedData)

  // Try this first - simpler columns without formatting functions
  const simpleColumns = [
    { 
      key: 'productsCount' as const, 
      label: 'Products Count' 
    },
    { 
      key: 'formattedShippingCost' as const, 
      label: 'Shipping Cost'
    },
    { 
      key: 'formattedImportTax' as const, 
      label: 'Import Tax'
    },
    {
      key: 'formattedOtherCosts' as const,
      label: 'Other Costs'
    },
    { 
      key: 'formattedTotalCost' as const, 
      label: 'Total Cost'
    },
  ]

  // Use the simple approach first to avoid the error
  return <Table className='text-nowrap' data={preFormattedData} columns={simpleColumns} />
}

export default RecentProductsTable