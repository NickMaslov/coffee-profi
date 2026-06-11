import { useAppState } from '../store/AppContext'
import { IconSun, IconMoon } from './icons'
import styles from './TopBar.module.css'

export function ThemeToggle() {
  const { state, dispatch } = useAppState()
  const isDark = state.theme === 'dark'

  const toggle = () => {
    const next = isDark ? 'light' : 'dark'
    // Set the attribute before dispatching so components that read CSS vars
    // during render (Recharts colors) pick up the new theme immediately
    document.documentElement.setAttribute('data-theme', next)
    dispatch({ type: 'SET_THEME', value: next })
  }

  return (
    <button
      className={styles.iconBtn}
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      {isDark ? <IconSun /> : <IconMoon />}
    </button>
  )
}
