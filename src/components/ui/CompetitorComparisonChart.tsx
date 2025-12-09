'use client'

import React from 'react'
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
import { useThemeCustomizer, colorPalettes } from '@/components/theme/ThemeProvider'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

interface BarChartData {
  labels?: string[]
  datasets?: Array<{ label?: string; data?: number[] }>
}

const CompetitorComparisonChart: React.FC<{ barData?: BarChartData }> = ({ barData }) => {
  const { primaryColor } = useThemeCustomizer()
  const primaryHex = colorPalettes[primaryColor]?.[500] || '#465fff'
  const primaryRgb = hexToRgb(primaryHex)

  const labels = barData?.labels ?? []
  const values = barData?.datasets && barData.datasets[0]?.data ? barData.datasets[0].data : []

  const data = {
    labels,
    datasets: [
      {
        label: barData?.datasets?.[0]?.label ?? 'Count',
        data: values,
        backgroundColor: labels.map((_, i) => `rgba(${(i % 2) ? '54,162,235' : '255,99,132'}, 0.2)`),
        borderColor: labels.map(() => primaryRgb),
        borderWidth: 1,
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
      title: {
        display: true,
        text: 'Shipment Product Count Comparison',
      },
    },
  }

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  )
}

export default CompetitorComparisonChart
