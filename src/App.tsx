import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AppProvider } from './store/AppContext'
import { CostsPanel } from './components/CostsPanel'
import { MenuPanel } from './components/MenuPanel'
import { ScenariosPanel } from './components/ScenariosPanel'
import { BreakEvenResult } from './components/BreakEvenResult'
import { ProfitLossCard } from './components/ProfitLossCard'
import { BreakEvenChart } from './components/BreakEvenChart'
import { SummaryCard } from './components/SummaryCard'
import { ThemeToggle } from './components/ThemeToggle'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { ForecastChart } from './components/ForecastChart'
import { OnboardingWizard } from './components/OnboardingWizard'
import { IconCoffee, IconWand, IconBeer, IconCake, IconSandwich, IconBean, IconStar, IconZap } from './components/icons'
import topBarStyles from './components/TopBar.module.css'
import styles from './App.module.css'

function EditableText({ storageKey, fallback, className }: { storageKey: string; fallback: string; className: string }) {
  const [value, setValue] = useState(() => localStorage.getItem(storageKey) ?? fallback)
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  function commit(v: string) {
    const trimmed = v.trim() || fallback
    setValue(trimmed)
    localStorage.setItem(storageKey, trimmed)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className={`${className} ${topBarStyles.editableInput}`}
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={e => commit(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') commit(value); if (e.key === 'Escape') { setValue(localStorage.getItem(storageKey) ?? fallback); setEditing(false) } }}
      />
    )
  }

  return (
    <span className={`${className} ${topBarStyles.editable}`} onClick={() => setEditing(true)} title="Click to edit">
      {value}
    </span>
  )
}

type LogoIconKey = 'coffee' | 'beer' | 'cake' | 'sandwich' | 'bean' | 'star' | 'zap'

const LOGO_ICONS: { key: LogoIconKey; icon: React.ReactNode; label: string }[] = [
  { key: 'coffee',   icon: <IconCoffee size={18} />,   label: 'Coffee' },
  { key: 'beer',     icon: <IconBeer size={18} />,     label: 'Bar' },
  { key: 'cake',     icon: <IconCake size={18} />,     label: 'Bakery' },
  { key: 'sandwich', icon: <IconSandwich size={18} />, label: 'Deli' },
  { key: 'bean',     icon: <IconBean size={18} />,     label: 'Roastery' },
  { key: 'star',     icon: <IconStar size={18} />,     label: 'General' },
  { key: 'zap',      icon: <IconZap size={18} />,      label: 'Juice bar' },
]

function LogoPicker() {
  const [selected, setSelected] = useState<LogoIconKey>(
    () => (localStorage.getItem('logoIcon') as LogoIconKey) ?? 'coffee'
  )
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  function pick(key: LogoIconKey) {
    setSelected(key)
    localStorage.setItem('logoIcon', key)
    setOpen(false)
  }

  const current = LOGO_ICONS.find(l => l.key === selected)!

  return (
    <div ref={wrapRef} className={topBarStyles.logoPickerWrap}>
      <div
        className={`${topBarStyles.logoCupWrap} ${topBarStyles.logoCupPickable}`}
        onClick={() => setOpen(o => !o)}
        title="Click to change logo"
      >
        {current.icon}
      </div>
      {open && (
        <div className={topBarStyles.logoPicker}>
          {LOGO_ICONS.map(({ key, icon, label }) => (
            <button
              key={key}
              className={`${topBarStyles.logoOption} ${key === selected ? topBarStyles.logoOptionActive : ''}`}
              onClick={() => pick(key)}
              title={label}
            >
              {icon}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function AppInner() {
  const { t } = useTranslation()
  const [wizardStep, setWizardStep] = useState<number | null>(
    () => localStorage.getItem('wizardDone') ? null : 0
  )

  function closeWizard() {
    localStorage.setItem('wizardDone', 'true')
    setWizardStep(null)
  }

  return (
    <div className={styles.app}>
      <header className={topBarStyles.topbar}>
        <div className={topBarStyles.logoGroup}>
          <LogoPicker />
          <EditableText storageKey="appTitle" fallback="Coffee Profi" className={topBarStyles.logoText} />
        </div>
        <EditableText storageKey="appSubtitle" fallback={t('appSubtitle')} className={topBarStyles.subtitle} />
        <div className={topBarStyles.controls}>
          <button
            className={topBarStyles.iconBtn}
            onClick={() => setWizardStep(0)}
            title={t('wizardGetStarted')}
          >
            <IconWand size={16} />
          </button>
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          <aside className={styles.sidebar}>
            <CostsPanel />
            <MenuPanel />
            <ScenariosPanel />
          </aside>

          <section className={styles.content}>
            <BreakEvenResult />
            <ProfitLossCard />
            <BreakEvenChart />
            <ForecastChart />
            <SummaryCard />
          </section>
        </div>
      </main>

      {wizardStep !== null && (
        <OnboardingWizard
          step={wizardStep}
          onNext={() => setWizardStep(s => (s ?? 0) + 1)}
          onBack={() => setWizardStep(s => Math.max(1, (s ?? 1) - 1))}
          onClose={closeWizard}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
