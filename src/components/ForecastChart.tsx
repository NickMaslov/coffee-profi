import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts'
import { useAppState } from '../store/AppContext'
import { calcForecast } from '../utils/calculations'
import styles from './ForecastChart.module.css'

function getCSSVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function fmtDollar(v: number) {
  const abs = Math.abs(v)
  if (abs >= 1000) return `${v < 0 ? '-' : ''}$${(abs / 1000).toFixed(1)}k`
  return `$${v}`
}

export function ForecastChart() {
  const { t } = useTranslation()
  const { state } = useAppState()
  const [growthPct, setGrowthPct] = useState(10)
  const [months, setMonths] = useState<12 | 24>(12)

  const data = calcForecast(state.fixedCosts, state.products, growthPct, months)
  const firstProfitMonth = data.find(d => d.netProfit > 0)?.month

  const colors = {
    profit: getCSSVar('--profit'),
    loss: getCSSVar('--loss'),
    grid: getCSSVar('--chart-grid'),
    text: getCSSVar('--text-muted'),
    accent: getCSSVar('--accent'),
    bg: getCSSVar('--bg-card'),
    border: getCSSVar('--border'),
    textPrimary: getCSSVar('--text-primary'),
  }

  const fillPct = (growthPct / 30) * 100

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{t('forecastTitle')}</h3>
          {firstProfitMonth != null ? (
            <p className={`${styles.subtitle} ${styles.subtitleProfit}`}>
              {t('forecastProfitableFrom', { month: firstProfitMonth })}
            </p>
          ) : (
            <p className={`${styles.subtitle} ${styles.subtitleLoss}`}>
              {t('forecastNeverProfitable')}
            </p>
          )}
        </div>
        <div className={styles.horizonBtns}>
          {([12, 24] as const).map(m => (
            <button
              key={m}
              className={`${styles.horizonBtn} ${months === m ? styles.horizonBtnActive : ''}`}
              onClick={() => setMonths(m)}
            >
              {m} {t('forecastMonthsLabel')}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.growthRow}>
        <span className={styles.growthLabel}>{t('forecastGrowthRate')}</span>
        <div className={styles.sliderWrap}>
          <div className={styles.sliderTrack}>
            <div className={styles.sliderFill} style={{ width: `${fillPct}%` }} />
          </div>
          <input
            type="range"
            className={styles.sliderInput}
            min={0}
            max={30}
            step={1}
            value={growthPct}
            onChange={e => setGrowthPct(Number(e.target.value))}
          />
        </div>
        <span className={styles.growthValue}>
          +{growthPct}%<span className={styles.growthSub}>{t('forecastPerMonth')}</span>
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 16, right: 16, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
          <XAxis
            dataKey="month"
            tickFormatter={v => `M${v}`}
            tick={{ fontSize: 10, fill: colors.text }}
            tickLine={false}
            axisLine={{ stroke: colors.grid }}
            interval={months === 24 ? 1 : 0}
          />
          <YAxis
            tickFormatter={fmtDollar}
            tick={{ fontSize: 10, fill: colors.text }}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <Tooltip
            formatter={(value: number) => [
              `$${value.toLocaleString('en-US')}`,
              t('forecastNetProfit'),
            ]}
            labelFormatter={(label: number) => `${t('forecastMonth')} ${label} · ${
              (data[label - 1]?.unitsPerDay ?? 0).toLocaleString()
            } ${t('forecastUnitsDay')}`}
            contentStyle={{
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: '10px',
              fontSize: '12px',
              color: colors.textPrimary,
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            }}
          />
          <ReferenceLine y={0} stroke={colors.accent} strokeWidth={1.5} strokeDasharray="4 3" />
          {firstProfitMonth != null && (
            <ReferenceLine
              x={firstProfitMonth}
              stroke={colors.profit}
              strokeDasharray="5 4"
              strokeWidth={2}
              label={{
                value: `▶ M${firstProfitMonth}`,
                position: 'top',
                fontSize: 10,
                fontWeight: 700,
                fill: colors.profit,
              }}
            />
          )}
          <Bar dataKey="netProfit" radius={[3, 3, 0, 0]} maxBarSize={40}>
            {data.map(d => (
              <Cell
                key={d.month}
                fill={d.netProfit >= 0 ? colors.profit : colors.loss}
                fillOpacity={0.75}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
