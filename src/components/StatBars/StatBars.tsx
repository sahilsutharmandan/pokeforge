import type { Stat } from '../../lib/api'
import { STAT_LABELS, statPercent, statTone, statTotal } from '../../lib/stats'
import styles from './StatBars.module.css'

export function StatBars({ stats }: { stats: Stat[] }) {
  const total = statTotal(stats)
  return (
    <div className={styles.stats}>
      {stats.map((stat) => (
        <div key={stat.key} className={styles.row}>
          <span className={styles.label}>{STAT_LABELS[stat.key]}</span>
          <span className={styles.value}>{stat.value}</span>
          <div
            className={styles.track}
            role="meter"
            aria-label={STAT_LABELS[stat.key]}
            aria-valuenow={stat.value}
            aria-valuemin={0}
            aria-valuemax={255}
          >
            <div
              className={`${styles.fill} ${styles[statTone(stat.value)]}`}
              style={{ width: `${statPercent(stat.value)}%` }}
            />
          </div>
        </div>
      ))}
      <div className={`${styles.row} ${styles.totalRow}`}>
        <span className={styles.label}>Total</span>
        <span className={styles.value}>{total}</span>
        <span className={styles.totalHint}>Base stat total</span>
      </div>
    </div>
  )
}
