import type { ReactNode } from 'react'
import styles from './InputSlider.module.css'

interface Props {
  label: string
  value: number
  min: number
  max: number
  step: number
  prefix?: string
  suffix?: string
  icon?: ReactNode
  onChange: (value: number) => void
}

export function InputSlider({ label, value, min, max, step, prefix, suffix, icon, onChange }: Props) {
  const handleInput = (raw: string) => {
    const num = parseFloat(raw)
    if (!isNaN(num)) onChange(Math.min(max, Math.max(min, num)))
  }

  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
        <span className={styles.label}>{label}</span>
        <div className={styles.inputWrap}>
          {prefix && <span className={styles.affix}>{prefix}</span>}
          <input
            type="number"
            className={styles.numInput}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={e => handleInput(e.target.value)}
          />
          {suffix && <span className={styles.affix}>{suffix}</span>}
        </div>
      </div>
      <div className={styles.sliderTrack}>
        <div className={styles.sliderBg}>
          <div className={styles.sliderFill} style={{ width: `${pct}%` }} />
        </div>
        <div className={styles.thumb} style={{ left: `${pct}%` }} />
        <input
          type="range"
          className={styles.slider}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(parseFloat(e.target.value))}
        />
      </div>
    </div>
  )
}
