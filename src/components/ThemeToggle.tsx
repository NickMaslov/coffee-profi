import { useAppState } from '../store/AppContext'
import styles from './TopBar.module.css'

export function ThemeToggle() {
  const { state, dispatch } = useAppState()
  const isDark = state.theme === 'dark'

  return (
    <button
      className={styles.iconBtn}
      onClick={() => dispatch({ type: 'SET_THEME', value: isDark ? 'light' : 'dark' })}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
