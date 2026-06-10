import { useTranslation } from 'react-i18next'
import { AppProvider } from './store/AppContext'
import { CostsPanel } from './components/CostsPanel'
import { RevenuePanel } from './components/RevenuePanel'
import { BreakEvenResult } from './components/BreakEvenResult'
import { BreakEvenChart } from './components/BreakEvenChart'
import { SummaryCard } from './components/SummaryCard'
import { ThemeToggle } from './components/ThemeToggle'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import topBarStyles from './components/TopBar.module.css'
import styles from './App.module.css'

function AppInner() {
  const { t } = useTranslation()
  return (
    <div className={styles.app}>
      <header className={topBarStyles.topbar}>
        <div className={topBarStyles.logo}>☕ {t('appTitle')}</div>
        <div className={topBarStyles.controls}>
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.subtitle}>{t('appSubtitle')}</div>

        <div className={styles.grid}>
          <aside className={styles.sidebar}>
            <CostsPanel />
            <RevenuePanel />
          </aside>

          <section className={styles.content}>
            <BreakEvenResult />
            <BreakEvenChart />
            <SummaryCard />
          </section>
        </div>
      </main>
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
