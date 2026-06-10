import { useTranslation } from 'react-i18next'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ReferenceArea, ResponsiveContainer, Legend
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
  const maxCups = data[data.length - 1]?.cups ?? 200

  const colors = {
    revenue: getCSSVar('--chart-revenue'),
    costs: getCSSVar('--chart-costs'),
    breakeven: getCSSVar('--chart-breakeven'),
    grid: getCSSVar('--chart-grid'),
    text: getCSSVar('--text-muted'),
    lossZone: getCSSVar('--loss'),
    profitZone: getCSSVar('--profit'),
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{t('chartTitle')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.lossZone} stopOpacity={0.07} />
              <stop offset="100%" stopColor={colors.lossZone} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.profitZone} stopOpacity={0.07} />
              <stop offset="100%" stopColor={colors.profitZone} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />

          {isFinite(breakEven.cupsPerDay) && (
            <ReferenceArea x1={0} x2={breakEven.cupsPerDay} fill="url(#lossGrad)" />
          )}
          {isFinite(breakEven.cupsPerDay) && (
            <ReferenceArea x1={breakEven.cupsPerDay} x2={maxCups} fill="url(#profitGrad)" />
          )}

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
            width={60}
          />
          <Tooltip
            formatter={(value: number, name: string) => [fmtDollar(value), name]}
            labelFormatter={(label: number) => `${label} cups/day`}
            contentStyle={{
              background: getCSSVar('--bg-card'),
              border: `1px solid ${getCSSVar('--border')}`,
              borderRadius: '10px',
              fontSize: '12px',
              color: getCSSVar('--text-primary'),
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: colors.text, paddingTop: '10px' }}
          />

          {isFinite(breakEven.cupsPerDay) && (
            <ReferenceLine
              x={breakEven.cupsPerDay}
              stroke={colors.breakeven}
              strokeDasharray="5 4"
              strokeWidth={2}
              label={{
                value: `BE: ${breakEven.cupsPerDay}`,
                position: 'insideTopRight',
                fontSize: 11,
                fontWeight: 700,
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
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="totalCosts"
            name={t('costs_line')}
            stroke={colors.costs}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
