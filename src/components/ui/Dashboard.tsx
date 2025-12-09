'use client'

import React from 'react'
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  TruckElectric,
  ShipIcon,
} from 'lucide-react'
// Import mock components instead of potentially API-dependent components
import PricingChart from './PricingChart'
import CompetitorComparisonChart from './CompetitorComparisonChart'
import RecentProductsTable from './RecentProductsTable'
import AlertsWidget from './AlertsWidget'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardProps {
  data?: any
  loading?: boolean
}

const Dashboard: React.FC<DashboardProps> = ({ data, loading }) => {
  const products = data?.dasboard_cards?.products
  const profits = data?.dasboard_cards?.profits
  const revenue = data?.dasboard_cards?.revenue
  const shipping = data?.dasboard_cards?.shipping
  const notifications = data?.notifications || []

  const avgMargin = (() => {
    if (products?.total_products) {
      return (
        (
          (products?.total_products_with_margin * 100) /
          products?.total_products
        ).toFixed(1) + '%'
      )
    }
  })()

  const stats = [
    {
      title: 'Total Products',
      value: products?.total_products ?? '—',
      icon: <Package className="h-8 w-8 text-primary" />,
      change: `${products?.from_last_month ?? 0}${products?.from_last_month >= 0 ? '%' : '%'}`,
      isPositive: (products?.from_last_month ?? 0) >= 0,
      bgPattern: 'radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.08) 0%, transparent 50%)',
      iconBg: 'bg-primary/10',
    },
    {
      title: 'Profit',
      value: profits?.total_profit ?? '—',
      icon: <TrendingUp className="h-8 w-8 text-success" />,
      change: `${profits?.from_last_month ?? 0}%`,
      isPositive: (profits?.from_last_month ?? 0) >= 0,
      bgPattern: 'radial-gradient(circle at 80% 50%, hsl(var(--success) / 0.08) 0%, transparent 50%)',
      iconBg: 'bg-success/10',
    },
    {
      title: 'Total Revenue',
      value: revenue?.total_revenue ?? 0,
      icon: <DollarSign className="h-8 w-8 text-warning" />,
      change: `${revenue?.from_last_month ?? 0}%`,
      isPositive: false,
      bgPattern: 'radial-gradient(circle at 50% 20%, hsl(var(--warning) / 0.08) 0%, transparent 50%)',
      iconBg: 'bg-warning/10',
    },
    {
      title: 'Total Shippment',
      value: shipping?.total_shipping_made ?? '—',
      icon: <ShipIcon className="h-8 w-8 text-info" />,
      change: `${shipping?.from_last_month ?? 0}%`,
      isPositive: (shipping?.from_last_month ?? 0) >= 0,
      bgPattern: 'radial-gradient(circle at 50% 80%, hsl(var(--info) / 0.08) 0%, transparent 50%)',
      iconBg: 'bg-info/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your pricing data.
        </p>
      </div>

      {/* Dashboard Grid Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="group relative overflow-hidden card transition-all duration-300"
                style={{ animation: `fadeInUp 0.6s ease-out ${(index + 1) * 0.1}s both` }}
              >
                <div className="absolute inset-0 opacity-20 bg-muted rounded-lg" />
                <div className="relative p-4 space-y-4">
                  <Skeleton shape="circle" size="lg" className="mb-3" />
                  <Skeleton shape="text" size="sm" width="60%" />
                  <Skeleton size="xl" width="40%" />
                  <Skeleton size="sm" width="30%" />
                  <Skeleton size="sm" width="100%" height="6px" className="rounded-full mt-3" />
                </div>
              </div>
            ))
          : stats.map((stat, index) => (
              <div
                key={index}
                className="group relative overflow-hidden card transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${(index + 1) * 0.1}s both`
                }}
              >
                {/* Background Pattern */}
                <div
                  className="absolute inset-0 opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: stat.bgPattern }}
                />

                {/* Animated Border Glow */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${stat.iconBg.includes('primary') ? 'hsl(var(--primary) / 0.3)' : stat.iconBg.includes('success') ? 'hsl(var(--success) / 0.3)' : stat.iconBg.includes('warning') ? 'hsl(var(--warning) / 0.3)' : 'hsl(var(--info) / 0.3)'} 0%, transparent 100%)`,
                    padding: '1px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    borderRadius: 'inherit'
                  }}
                />

                <div className="relative">
                  {/* Icon with enhanced background */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`rounded-xl ${stat.iconBg} p-3 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md`}>
                      {stat.icon}
                    </div>

                    {/* Mini sparkline indicator */}
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full ${stat.iconBg.replace('/10', '/40')}`}
                          style={{
                            height: `${12 + Math.sin(i) * 8}px`,
                            animation: `pulse 2s ease-in-out ${i * 0.2}s infinite`
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {stat.title}
                  </p>

                  {/* Value with enhanced animation */}
                  <p className="text-3xl font-semibold text-foreground mb-4 transition-all duration-300 group-hover:scale-105 origin-left">
                    {stat.value}
                  </p>

                  {/* Change indicator */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`inline-flex items-center text-sm font-medium transition-all duration-300 ${
                        stat.isPositive ? 'text-success' : 'text-error'
                      }`}
                    >
                      {stat.isPositive ? (
                        <ArrowUpRight className="mr-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                      )}
                      {stat.change}
                    </div>
                    <span className="text-xs text-muted-foreground opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                      from last month
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${stat.iconBg.replace('/10', '')} transition-all duration-1000 ease-out rounded-full`}
                      style={{
                        width: stat.isPositive ? '75%' : '45%',
                        animation: 'slideIn 1.5s ease-out'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Pricing Trends and Competitor Comparison */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {loading ? (
          <>
            <div className="overflow-hidden card p-4" style={{ animation: 'fadeInUp 0.6s ease-out 0.5s both' }}>
              <Skeleton size="2xl" width="100%" height="200px" />
            </div>
            <div className="overflow-hidden card p-4" style={{ animation: 'fadeInUp 0.6s ease-out 0.6s both' }}>
              <Skeleton size="2xl" width="100%" height="200px" />
            </div>
          </>
        ) : (
          <>
            {/* Pricing Trends(Line Chart) */}
            <div className="overflow-hidden card" style={{ animation: 'fadeInUp 0.6s ease-out 0.5s both' }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-foreground">
                  Pricing Trends
                </h2>
                <div className="flex items-center text-sm text-muted-foreground">
                  <BarChart3 className="mr-1 h-4 w-4" />
                  Last 30 days
                </div>
              </div>
              <PricingChart chartData={data?.line_chart} />
            </div>

            {/* Competitor Comparison(Bar Chart) */}
            <div className="overflow-hidden card" style={{ animation: 'fadeInUp 0.6s ease-out 0.6s both' }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-foreground">
                  Most Shipped Products Comparison
                </h2>
                <div className="flex items-center text-sm text-muted-foreground">
                  <BarChart3 className="mr-1 h-4 w-4" />
                  Top 5 products
                </div>
              </div>
              <CompetitorComparisonChart barData={data?.bar_chart} />
            </div>
          </>
        )}
      </div>

      {/* Recent Products Table and Alerts Widget */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {loading ? (
          <>
            {/* Skeleton for Recent Products Table */}
            <div className="col-span-2 overflow-hidden p-4" style={{ animation: 'fadeInUp 0.6s ease-out 0.7s both' }}>
              <Skeleton size="2xl" width="100%" height="250px" />
            </div>

            {/* Skeleton for Alerts Widget */}
            <div className="overflow-hidden card p-4" style={{ animation: 'fadeInUp 0.6s ease-out 0.8s both' }}>
              <Skeleton size="lg" width="40%" height="30px" className="mb-4" />
              <Skeleton size="xl" width="100%" height="150px" />
            </div>
          </>
        ) : (
          <>
            {/* Calculated Pricing */}
            <div className="col-span-2 overflow-hidden" style={{ animation: 'fadeInUp 0.6s ease-out 0.7s both' }}>
              <RecentProductsTable
                pricingCalculators={
                  (data?.pricing_calculators || [])
                }
              />
            </div>

            {/* Notifications */}
            <div className="overflow-hidden card" style={{ animation: 'fadeInUp 0.6s ease-out 0.8s both' }}>
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-medium text-foreground">Price Alerts</h2>
              </div>
              <AlertsWidget notifications={data?.notifications} />
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            width: 0%;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
