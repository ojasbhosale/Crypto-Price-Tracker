"use client"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type ChartOptions,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

interface PriceChartProps {
  data: number[]
  color: string
}

export function PriceChart({ data, color }: PriceChartProps) {
  // Create labels (just empty strings for a sparkline)
  const labels = Array(data.length).fill("")

  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: color,
        borderWidth: 1.5,
        fill: true,
        backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D } }) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 50)
          gradient.addColorStop(0, `${color}33`) // Add alpha for transparency
          gradient.addColorStop(1, `${color}00`)
          return gradient
        },
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  }

  return (
    <div className="h-full w-full">
      <Line data={chartData} options={options} />
    </div>
  )
}
