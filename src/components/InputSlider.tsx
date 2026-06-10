import styles from './InputSlider.module.css'

interface Props {
  label: string
  value: number
  min: number
  max: number
  step: number
  prefix?: string
  suffix?: string
  onChange: (value: number) => void
}

export function InputSlider({ label, value, min, max, step, prefix, suffix, onChange }: Props) {
  const handleInput = (raw: string) => {
    const num = parseFloat(raw)
    if (!isNaN(num)) onChange(Math.min(max, Math.max(min, num)))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
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
  )
}
