'use client'

import React, { useState } from 'react'
import { useThemeCustomizer, colorPalettes } from '@/components/theme/ThemeProvider';
import {
  BarChart3,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  PieChart,
  LineChart,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import { Chip } from '@/components/ui/chip'
import { Dialog } from '@/components/ui/dialog'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useTheme } from 'next-themes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Column<T> {
  key: keyof T;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  className?: string;
  cellClass?: (item: T) => string;
  format?: (value: any) => string;
  render?: (value: any, row: T) => React.ReactNode;
}

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('month')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null)
  const { primaryColor } = useThemeCustomizer();
  const { resolvedTheme } = useTheme();
  const primaryHex = colorPalettes[primaryColor]?.[500] || '#22c55e';
  const secondaryShade = resolvedTheme === 'dark' ? 800 : 100;
  const secondaryHex = colorPalettes[primaryColor]?.[secondaryShade] || '#fde047';

  const [sortKey, setSortKey] = useState<keyof typeof topProductsData[0] | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleSort = (key: keyof typeof topProductsData[0]) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const topProductsData = [
    {
      id: 1,
      name: 'iPhone 13 Pro',
      category: 'Electronics',
      units: 125,
      revenue: 124875,
      profit: 18731,
      margin: 15.0,
    },
    {
      id: 2,
      name: 'MacBook Air M1',
      category: 'Computers',
      units: 78,
      revenue: 101322,
      profit: 25331,
      margin: 25.0,
    },
    {
      id: 3,
      name: 'Samsung Galaxy S21',
      category: 'Electronics',
      units: 92,
      revenue: 78108,
      profit: 13750,
      margin: 17.6,
    },
    {
      id: 4,
      name: 'AirPods Pro',
      category: 'Audio',
      units: 210,
      revenue: 52290,
      profit: 14489,
      margin: 27.7,
    },
    {
      id: 5,
      name: 'iPad Mini',
      category: 'Tablets',
      units: 65,
      revenue: 32435,
      profit: 8044,
      margin: 24.8,
    },
  ]

  const topProductsColumns: Column<typeof topProductsData[0]>[] = [
    { key: 'name', label: 'Product', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'units', label: 'Units Sold', sortable: true, },
    { key: 'revenue', label: 'Revenue', sortable: true, format: (v: number) => `₵${v.toLocaleString()}` },
    { key: 'profit', label: 'Profit', sortable: true, format: (v: number) => `₵${v.toLocaleString()}` },
    { key: 'margin', label: 'Margin', sortable: true, format: (v: number) => `${v}%` },
  ]

  const salesPerformanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 15000, 14000, 17000, 18000, 19000, 22000, 21000, 23000, 24000, 25000, 27000],
        backgroundColor: hexToRgba(primaryHex, 0.7)
      },
      {
        label: 'Profit',
        data: [3000, 4000, 3500, 4500, 4800, 5000, 5500, 5300, 5800, 6000, 6200, 6500],
        backgroundColor: hexToRgba(secondaryHex, 0.7),
      },
    ],
  }

  const salesPerformanceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground">
          View and analyze your business performance data
        </p>
      </div>

      {/* Report Controls */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0" style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}>
        <div className="flex space-x-2">
          <Button
            variant={dateRange === 'week' ? 'primary' : 'outline'}
            onClick={() => setDateRange('week')}
          >
            Week
          </Button>
          <Button
            variant={dateRange === 'month' ? 'primary' : 'outline'}
            onClick={() => setDateRange('month')}
          >
            Month
          </Button>
          <Button
            variant={dateRange === 'quarter' ? 'primary' : 'outline'}
            onClick={() => setDateRange('quarter')}
          >
            Quarter
          </Button>
          <Button
            variant={dateRange === 'year' ? 'primary' : 'outline'}
            onClick={() => setDateRange('year')}
          >
            Year
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" startIcon={<Download className="h-4 w-4" />}>
            Export
          </Button>
          <Button
            onClick={handleRefresh}
            startIcon={<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden card" style={{ animation: `fadeInUp 0.6s ease-out 0.2s both` }}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Total Revenue
                  </dt>
                  <dd className="text-xl font-semibold text-foreground">
                    ₵125,432
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">vs last period</div>
                <div className="text-sm font-medium text-success">+12.5%</div>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-success"
                  style={{
                    width: '70%',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden card" style={{ animation: `fadeInUp 0.6s ease-out 0.3s both` }}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PieChart className="h-6 w-6 text-info" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Average Margin
                  </dt>
                  <dd className="text-xl font-semibold text-foreground">24.8%</dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">vs last period</div>
                <div className="text-sm font-medium text-success">+2.3%</div>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-info"
                  style={{
                    width: '65%',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden card" style={{ animation: `fadeInUp 0.6s ease-out 0.4s both` }}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Total Products
                  </dt>
                  <dd className="text-xl font-semibold text-foreground">142</dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">vs last period</div>
                <div className="text-sm font-medium text-success">+8.1%</div>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{
                    width: '55%',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden card" style={{ animation: `fadeInUp 0.6s ease-out 0.5s both` }}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Price Adjustments
                  </dt>
                  <dd className="text-xl font-semibold text-foreground">28</dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">vs last period</div>
                <div className="text-sm font-medium text-destructive">-5.2%</div>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-destructive"
                  style={{
                    width: '35%',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Performance Chart */}
      <div className="overflow-hidden bg-card rounded-lg border border-borde" style={{ animation: `fadeInUp 0.6s ease-out 0.6s both` }}>
        <div className="border-b border-border bg-muted px-6 py-4">
          <h2 className="text-lg font-medium text-foreground">
            <BarChart3 className="mr-2 inline h-5 w-5 text-primary" />
            Sales Performance
          </h2>
        </div>
        <div className="p-6">
          <div>
            <Bar options={salesPerformanceOptions} data={salesPerformanceData} />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-6">
            <div className="rounded-lg bg-success/10 p-4">
              <p className="text-sm font-medium text-success">Total Sales</p>
              <p className="mt-1 text-2xl font-semibold text-success">
                ₵125,432
              </p>
              <p className="mt-1 text-sm text-success">
                +12.5% from previous period
              </p>
            </div>
            <div className="rounded-lg bg-info/10 p-4">
              <p className="text-sm font-medium text-info">Total Profit</p>
              <p className="mt-1 text-2xl font-semibold text-info">
                ₵31,358
              </p>
              <p className="mt-1 text-sm text-info">
                +8.2% from previous period
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 p-4">
              <p className="text-sm font-medium text-primary">
                Avg. Transaction
              </p>
              <p className="mt-1 text-2xl font-semibold text-primary">
                ₵287
              </p>
              <p className="mt-1 text-sm text-primary">
                +3.7% from previous period
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden bg-card rounded-lg border border-borde" style={{ animation: `fadeInUp 0.6s ease-out 0.7s both` }}>
          <div className="border-b border-border bg-muted px-6 py-4">
            <h2 className="text-lg font-medium text-foreground">
              Product Category Performance
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                {
                  category: 'Electronics',
                  sales: 45250,
                  percentage: 36,
                },
                {
                  category: 'Computers',
                  sales: 38750,
                  percentage: 31,
                },
                {
                  category: 'Audio',
                  sales: 18750,
                  percentage: 15,
                },
                {
                  category: 'Tablets',
                  sales: 12500,
                  percentage: 10,
                },
                {
                  category: 'Accessories',
                  sales: 10000,
                  percentage: 8,
                },
              ].map((item, index) => (
                <div key={index} style={{ animation: `fadeInUp 0.6s ease-out ${(index + 8) * 0.1}s both` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {item.category}
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ₵{item.sales.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-card rounded-lg border border-border" style={{ animation: `fadeInUp 0.6s ease-out 0.8s both` }}>
          <div className="border-b border-border bg-muted px-6 py-4">
            <h2 className="text-lg font-medium text-foreground">
              Margin Analysis
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '200px' }}>
              {[
                {
                  category: 'Electronics',
                  margin: 17.6,
                  status: 'Low',
                },
                {
                  category: 'Computers',
                  margin: 25.2,
                  status: 'Average',
                },
                {
                  category: 'Audio',
                  margin: 38.3,
                  status: 'High',
                },
                {
                  category: 'Tablets',
                  margin: 24.8,
                  status: 'Average',
                },
                {
                  category: 'Accessories',
                  margin: 42.1,
                  status: 'High',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border p-4 bg-card"
                  style={{ animation: `fadeInUp 0.6s ease-out ${(index + 13) * 0.1}s both` }}
                >
                  <div>
                    <p className="font-medium text-foreground">{item.category}</p>
                    <p className="text-sm text-muted-foreground">Average margin</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">
                      {item.margin}%
                    </p>
                    <Chip
                      variant="tonal"
                      color={
                        item.status === 'High' ? 'success' :
                        item.status === 'Average' ? 'warning' : 'error'
                      }
                    >
                      {item.status}
                    </Chip>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <Table
        data={topProductsData}
        columns={topProductsColumns}
        title="Top Selling Products"
        hoverable
        sortKey={sortKey || undefined}
        sortDirection={sortDirection || undefined}
        onSort={handleSort}
        rowStyle={(item, index) => ({ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` })}
      />
    </div>
  )
}

export default ReportsPage
