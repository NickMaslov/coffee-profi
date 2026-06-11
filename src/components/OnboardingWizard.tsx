import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../store/AppContext'
import { InputSlider } from './InputSlider'
import { ProductCard } from './ProductCard'
import { calcBreakEven, calcTotalUnitsPerDay } from '../utils/calculations'
import {
  IconCoffee, IconBuilding, IconUsers, IconZap, IconTool, IconMegaphone, IconTrendingUp,
} from './icons'
import styles from './OnboardingWizard.module.css'

interface Props {
  step: number
  onNext: () => void
  onBack: () => void
  onClose: () => void
}

export function OnboardingWizard({ step, onNext, onBack, onClose }: Props) {
  const { t } = useTranslation()
  const { state, dispatch } = useAppState()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    modalRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      // Trap Tab inside the modal so background controls stay unreachable
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, input, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement

        if (!modalRef.current.contains(active)) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const result = calcBreakEven(state.fixedCosts, state.products)
  const currentUnits = calcTotalUnitsPerDay(state.products)
  const isProfitable = currentUnits >= result.unitsPerDay

  return (
    <div
      className={styles.overlay}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true" ref={modalRef} tabIndex={-1}>

        {/* Header: progress dots + skip */}
        {step > 0 && (
          <div className={styles.header}>
            <div className={styles.dots}>
              {[1, 2, 3].map(i => (
                <span
                  key={i}
                  className={[
                    styles.dot,
                    i === step ? styles.dotActive : '',
                    i < step ? styles.dotDone : '',
                  ].join(' ')}
                />
              ))}
            </div>
            {step < 3 && (
              <button className={styles.skipBtn} onClick={onClose}>
                {t('wizardSkip')}
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={styles.body}>

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className={styles.welcome}>
              <div className={styles.welcomeIconWrap}>
                <IconCoffee size={36} />
              </div>
              <h2 className={styles.welcomeTitle}>{t('wizardWelcomeTitle')}</h2>
              <p className={styles.welcomeSubtitle}>{t('wizardWelcomeSubtitle')}</p>
              <ol className={styles.welcomeList}>
                <li>{t('wizardStep1Label')}</li>
                <li>{t('wizardStep2Label')}</li>
                <li>{t('wizardStep3Label')}</li>
              </ol>
              <button className={styles.primaryBtn} onClick={onNext}>
                {t('wizardGetStarted')}
              </button>
              <button className={styles.ghostBtn} onClick={onClose}>
                {t('wizardSkip')}
              </button>
            </div>
          )}

          {/* Step 1: Fixed Costs */}
          {step === 1 && (
            <>
              <div className={styles.stepHead}>
                <h2 className={styles.stepTitle}>{t('wizardCostsTitle')}</h2>
                <p className={styles.stepDesc}>{t('wizardCostsDesc')}</p>
              </div>
              <div className={styles.sliders}>
                <InputSlider icon={<IconBuilding />} label={t('rent')} value={state.fixedCosts.rent} min={500} max={20000} step={100} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'rent', value: v })} />
                <InputSlider icon={<IconUsers />} label={t('salaries')} value={state.fixedCosts.salaries} min={1000} max={30000} step={100} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'salaries', value: v })} />
                <InputSlider icon={<IconZap />} label={t('utilities')} value={state.fixedCosts.utilities} min={100} max={5000} step={50} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'utilities', value: v })} />
                <InputSlider icon={<IconTool />} label={t('equipmentAmortization')} value={state.fixedCosts.equipmentAmortization} min={50} max={5000} step={50} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'equipmentAmortization', value: v })} />
                <InputSlider icon={<IconMegaphone />} label={t('marketing')} value={state.fixedCosts.marketing} min={0} max={5000} step={50} prefix="$" suffix={t('perMonth')} onChange={v => dispatch({ type: 'SET_FIXED', key: 'marketing', value: v })} />
              </div>
            </>
          )}

          {/* Step 2: Menu Items */}
          {step === 2 && (
            <>
              <div className={styles.stepHead}>
                <h2 className={styles.stepTitle}>{t('wizardMenuTitle')}</h2>
                <p className={styles.stepDesc}>{t('wizardMenuDesc')}</p>
              </div>
              <div className={styles.products}>
                {state.products.map(product => (
                  <ProductCard key={product.id} product={product} canDelete={state.products.length > 1} />
                ))}
                <button
                  className={styles.addProductBtn}
                  onClick={() => dispatch({ type: 'ADD_PRODUCT' })}
                >
                  + {t('addItem')}
                </button>
              </div>
            </>
          )}

          {/* Step 3: Results */}
          {step === 3 && (
            <>
              <div className={styles.stepHead}>
                <h2 className={styles.stepTitle}>{t('wizardResultTitle')}</h2>
                <p className={styles.stepDesc}>{t('wizardResultDesc')}</p>
              </div>
              <div className={`${styles.resultCard} ${isProfitable ? styles.resultProfit : styles.resultLoss}`}>
                <div className={styles.resultTop}>
                  <span className={`${styles.resultBadge} ${isProfitable ? styles.badgeProfit : styles.badgeLoss}`}>
                    <IconTrendingUp size={12} />
                    {isProfitable ? t('profitZone') : t('lossZone')}
                  </span>
                </div>
                <div className={styles.resultNumbers}>
                  <div className={styles.resultBlock}>
                    <div className={styles.resultLabel}>{t('breakEvenTitle')}</div>
                    <div className={styles.resultBig}>
                      {isFinite(result.unitsPerDay) ? result.unitsPerDay : '∞'}
                    </div>
                    <div className={styles.resultUnit}>{t('breakEvenCupsDay')}</div>
                  </div>
                  <div className={styles.resultDivider} />
                  <div className={styles.resultBlock}>
                    <div className={styles.resultLabel}>{t('currentSales')}</div>
                    <div className={styles.resultBig}>{currentUnits}</div>
                    <div className={styles.resultUnit}>{t('breakEvenCupsDay')}</div>
                  </div>
                </div>
              </div>
              <p className={styles.resultHint}>{t('wizardResultHint')}</p>
            </>
          )}
        </div>

        {/* Footer: back / next / finish */}
        {step > 0 && (
          <div className={styles.footer}>
            <button className={styles.backBtn} onClick={onBack}>
              {t('wizardBack')}
            </button>
            {step < 3 ? (
              <button className={styles.primaryBtn} onClick={onNext}>
                {t('wizardNext')}
              </button>
            ) : (
              <button className={styles.primaryBtn} onClick={onClose}>
                {t('wizardFinish')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
