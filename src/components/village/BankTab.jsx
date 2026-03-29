import { useState } from 'react'
import { useStore } from '../../store/index.js'
import { showToast } from '../ui/ToastNotification.jsx'
import styles from './BankTab.module.css'

const RATES = [0, 5, 10, 15, 20, 25, 30, 40, 50]

export default function BankTab() {
  const {
    gold, savingsBalance, savingsGoal, savingsRate, savingsLocked,
    setSavingsRate, setSavingsGoal, setSavingsLocked, withdrawSavings,
  } = useStore()

  const [goalInput, setGoalInput] = useState(savingsGoal > 0 ? String(savingsGoal) : '')
  const [withdrawAmt, setWithdrawAmt] = useState('')

  const goalProgress = savingsGoal > 0 ? Math.min(1, (savingsBalance ?? 0) / savingsGoal) : null
  const goalMet = savingsGoal > 0 && (savingsBalance ?? 0) >= savingsGoal
  const canWithdraw = !savingsLocked || goalMet

  const handleSetGoal = () => {
    const g = Math.max(0, parseInt(goalInput) || 0)
    setSavingsGoal(g)
    showToast(g > 0 ? `Savings goal set: ${g}g` : 'Goal cleared')
  }

  const handleWithdraw = (amount) => {
    const n = Math.min(Math.max(1, parseInt(amount) || 0), savingsBalance ?? 0)
    if (n < 1) return
    const result = withdrawSavings(n)
    if (result.error) {
      showToast(result.error, 'error')
    } else {
      showToast(`Withdrew ${n}g · added to purse`, 'gold')
      setWithdrawAmt('')
    }
  }

  return (
    <div className={styles.bank}>

      {/* Balance hero */}
      <div className={styles.hero}>
        <div className={styles.heroLabel}>Savings Balance</div>
        <div className={styles.heroAmount}>{savingsBalance ?? 0}<span className={styles.heroG}>g</span></div>
        <div className={styles.heroPurse}>Purse: {gold ?? 0}g</div>

        {savingsGoal > 0 && (
          <div className={styles.goalBlock}>
            <div className={styles.goalMeta}>
              <span>Goal: {savingsGoal}g</span>
              <span className={goalMet ? styles.goalMet : styles.goalPct}>
                {goalMet ? '✓ Reached!' : `${Math.round((goalProgress ?? 0) * 100)}%`}
              </span>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={`${styles.progressBar} ${goalMet ? styles.progressDone : ''}`}
                style={{ width: `${Math.round((goalProgress ?? 0) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {savingsLocked && !goalMet && savingsGoal > 0 && (
          <div className={styles.lockedBadge}>&#128274; Locked until goal reached</div>
        )}
        {goalMet && savingsLocked && (
          <div className={styles.unlockedBadge}>&#127881; Goal reached — withdrawals unlocked!</div>
        )}
      </div>

      {/* Auto-save rate */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Auto-Save Rate</span>
          {savingsRate > 0 && (
            <span className={styles.activeRate}>{savingsRate}% active</span>
          )}
        </div>
        <p className={styles.sectionDesc}>
          {savingsRate > 0
            ? `${savingsRate}% of every gold earned is automatically deposited into savings.`
            : 'Select a rate to automatically save a share of every gold earned.'}
        </p>
        <div className={styles.rateGrid}>
          {RATES.map(r => (
            <button
              key={r}
              className={`${styles.rateBtn} ${savingsRate === r ? styles.rateBtnActive : ''}`}
              onClick={() => setSavingsRate(r)}
            >
              {r}%
            </button>
          ))}
        </div>
      </div>

      {/* Goal setter */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Savings Goal</div>
        <p className={styles.sectionDesc}>Set a target and optionally lock your account until it is met.</p>
        <div className={styles.inputRow}>
          <input
            type="number"
            min="0"
            placeholder="e.g. 1000"
            value={goalInput}
            onChange={e => setGoalInput(e.target.value)}
            className={styles.textInput}
          />
          <span className={styles.inputSuffix}>g</span>
          <button className={styles.primaryBtn} onClick={handleSetGoal}>Set</button>
          {savingsGoal > 0 && (
            <button
              className={styles.ghostBtn}
              onClick={() => { setSavingsGoal(0); setGoalInput(''); setSavingsLocked(false) }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Lock toggle */}
      <div className={styles.section}>
        <div className={styles.lockRow}>
          <div className={styles.lockText}>
            <div className={styles.sectionTitle}>Lock Until Goal</div>
            <div className={styles.sectionDesc}>Block withdrawals until your savings goal is reached.</div>
          </div>
          <button
            className={`${styles.toggle} ${savingsLocked ? styles.toggleOn : styles.toggleOff}`}
            onClick={() => setSavingsLocked(!savingsLocked)}
            disabled={savingsGoal === 0}
            title={savingsGoal === 0 ? 'Set a goal first' : undefined}
          >
            <span className={styles.toggleThumb} />
          </button>
        </div>
        {savingsGoal === 0 && (
          <p className={styles.hint}>Set a goal above to enable locking.</p>
        )}
      </div>

      {/* Withdraw */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Withdraw</div>
        {!canWithdraw ? (
          <p className={styles.lockedMsg}>
            &#128274; Account locked. Reach your goal of {savingsGoal}g to withdraw.
          </p>
        ) : (savingsBalance ?? 0) === 0 ? (
          <p className={styles.emptyMsg}>No savings to withdraw yet.</p>
        ) : (
          <div className={styles.inputRow}>
            <input
              type="number"
              min="1"
              max={savingsBalance}
              placeholder="Amount"
              value={withdrawAmt}
              onChange={e => setWithdrawAmt(e.target.value)}
              className={styles.textInput}
            />
            <span className={styles.inputSuffix}>g</span>
            <button
              className={styles.withdrawBtn}
              onClick={() => handleWithdraw(withdrawAmt)}
              disabled={!withdrawAmt || parseInt(withdrawAmt) < 1}
            >
              Withdraw
            </button>
            <button
              className={styles.withdrawAllBtn}
              onClick={() => handleWithdraw(savingsBalance)}
            >
              All ({savingsBalance}g)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
