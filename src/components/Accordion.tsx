import { useState, useEffect, type ReactNode } from 'react'
import styles from './Accordion.module.css'

interface Props {
  title: string
  desc?: string
  collapsedDesc?: string
  defaultOpen?: boolean
  children: ReactNode
}

export function Accordion({ title, desc, collapsedDesc, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const [showCollapsed, setShowCollapsed] = useState(!defaultOpen)

  useEffect(() => {
    if (open) {
      setShowCollapsed(false)
    } else {
      const timer = setTimeout(() => setShowCollapsed(true), 500)
      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <div className={`${styles.wrap} ${open ? styles.open : ''}`}>
      <button className={styles.header} onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <div className={styles.titleRow}>
          <span className={styles.accent} />
          <span className={styles.title}>{title}</span>
        </div>
        <svg
          className={styles.chevron}
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {desc && open && <p className={styles.desc}>{desc}</p>}
      {collapsedDesc && showCollapsed && <p className={styles.collapsedDesc}>{collapsedDesc}</p>}
      <div className={styles.body}>
        <div className={styles.bodyInner}>
          {children}
        </div>
      </div>
    </div>
  )
}
