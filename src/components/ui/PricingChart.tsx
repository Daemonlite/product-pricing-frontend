'use client'

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useThemeCustomizer, colorPalettes } from '@/components/theme/ThemeProvider'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

interface LineChartData {
  labels?: string[]
  data?: number[]
}

const PricingChart: React.FC<{ chartData?: LineChartData }> = ({ chartData }) => {
  const { primaryColor } = useThemeCustomizer()
  const primaryHex = colorPalettes[primaryColor]?.[500] || '#465fff'
  const primaryRgb = hexToRgb(primaryHex)

  const labels = chartData?.labels ?? []
  const values = chartData?.data ?? []

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Profit',
        data: values,
        borderColor: primaryRgb,
        backgroundColor: `rgba(${primaryRgb.slice(4, -1)}, 0.2)`,
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  )
}

export default PricingChart
