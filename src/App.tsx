import { useTranslation } from 'react-i18next'
import { AppProvider } from './store/AppContext'
import { CostsPanel } from './components/CostsPanel'
import { MenuPanel } from './components/MenuPanel'
import { BreakEvenResult } from './components/BreakEvenResult'
import { ProfitLossCard } from './components/ProfitLossCard'
import { BreakEvenChart } from './components/BreakEvenChart'
import { SummaryCard } from './components/SummaryCard'
import { ThemeToggle } from './components/ThemeToggle'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { IconCoffee } from './components/icons'
import topBarStyles from './components/TopBar.module.css'
import styles from './App.module.css'

function AppInner() {
  const { t } = useTranslation()
  return (
    <div className={styles.app}>
      <header className={topBarStyles.topbar}>
        <div className={topBarStyles.logoGroup}>
          <div className={topBarStyles.logoCupWrap}>
            <IconCoffee size={18} />
          </div>
          <span className={topBarStyles.logoText}>
            Coffee <span>Profi</span>
          </span>
        </div>
        <div className={topBarStyles.controls}>
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>{t('appSubtitle')}</h1>
          <div className={styles.heroDecor}>
            <span className={styles.decorDot} />
            <span className={styles.decorDot} />
            <span className={styles.decorDot} />
          </div>
        </div>

        <div className={styles.grid}>
          <aside className={styles.sidebar}>
            <CostsPanel />
            <MenuPanel />
          </aside>

          <section className={styles.content}>
            <BreakEvenResult />
            <ProfitLossCard />
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
