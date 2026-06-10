import { useTranslation } from 'react-i18next'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend
} from 'recharts'
import { useAppState } from '../store/AppContext'
import { calcChartData, calcBreakEven } from '../utils/calculations'
import styles from './BreakEvenChart.module.css'

function getCSSVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function fmtDollar(v: number) {
  return `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export function BreakEvenChart() {
  const { t } = useTranslation()
  const { state } = useAppState()
  const data = calcChartData(state.fixedCosts, state.variableCosts, state.revenue)
  const breakEven = calcBreakEven(state.fixedCosts, state.variableCosts, state.revenue)

  const colors = {
    revenue: getCSSVar('--chart-revenue'),
    costs: getCSSVar('--chart-costs'),
    breakeven: getCSSVar('--chart-breakeven'),
    grid: getCSSVar('--chart-grid'),
    text: getCSSVar('--text-muted'),
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{t('chartTitle')}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis
            dataKey="cups"
            tick={{ fontSize: 11, fill: colors.text }}
            tickLine={false}
            axisLine={{ stroke: colors.grid }}
          />
          <YAxis
            tickFormatter={fmtDollar}
            tick={{ fontSize: 11, fill: colors.text }}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <Tooltip
            formatter={(value: number, name: string) => [fmtDollar(value), name]}
            labelFormatter={(label: number) => `${label} cups/day`}
            contentStyle={{
              background: getCSSVar('--bg-card'),
              border: `1px solid ${getCSSVar('--border')}`,
              borderRadius: '8px',
              fontSize: '12px',
              color: getCSSVar('--text-primary'),
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: colors.text, paddingTop: '8px' }}
          />
          {isFinite(breakEven.cupsPerDay) && (
            <ReferenceLine
              x={breakEven.cupsPerDay}
              stroke={colors.breakeven}
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: `BE: ${breakEven.cupsPerDay}`,
                position: 'insideTopRight',
                fontSize: 11,
                fill: colors.breakeven,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="revenue"
            name={t('revenue_line')}
            stroke={colors.revenue}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="totalCosts"
            name={t('costs_line')}
            stroke={colors.costs}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
