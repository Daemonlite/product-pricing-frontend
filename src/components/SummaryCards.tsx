import React from 'react'
import { Package, Archive, DollarSign, TrendingUp } from 'lucide-react'
import { Product } from '@/types/auth'

interface SummaryCardsProps {
  products: Product[]
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ products }) => {
  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const totalValue = products.reduce((sum, p) => sum + p.cost_price * p.stock, 0)
  const productsWithMargin = products.filter(p => p.margin !== undefined)
  const avgMargin = productsWithMargin.length > 0 ? productsWithMargin.reduce((sum, p) => sum + (p.margin || 0), 0) / productsWithMargin.length : 0

  const cards = [
    {
      icon: Package,
      title: 'Total Products',
      value: totalProducts.toString(),
    },
    {
      icon: Archive,
      title: 'Total Stock',
      value: totalStock.toString(),
    },
    {
      icon: DollarSign,
      title: 'Total Value',
      value: `₵${totalValue.toLocaleString()}`,
    },
    {
      icon: TrendingUp,
      title: 'Avg Margin',
      value: `${avgMargin.toFixed(1)}%`,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className="bg-card p-6 rounded-lg border mb-10" style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}>
            <div className="flex items-center">
              <Icon className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SummaryCards
