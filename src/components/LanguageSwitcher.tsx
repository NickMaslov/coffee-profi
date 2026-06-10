import { useState, useRef, useEffect } from 'react'
import { useAppState } from '../store/AppContext'
import styles from './TopBar.module.css'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'es', label: 'Español' },
] as const

export function LanguageSwitcher() {
  const { state, dispatch } = useAppState()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className={styles.langWrap} ref={ref}>
      <button
        className={styles.langBtn}
        onClick={() => setOpen(o => !o)}
        aria-label="Select language"
        aria-expanded={open}
      >
        <span className={styles.globe}>🌐</span>
      </button>
      {open && (
        <div className={styles.langDropdown}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              className={`${styles.langOption} ${state.language === l.code ? styles.langOptionActive : ''}`}
              onClick={() => { dispatch({ type: 'SET_LANGUAGE', value: l.code }); setOpen(false) }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
