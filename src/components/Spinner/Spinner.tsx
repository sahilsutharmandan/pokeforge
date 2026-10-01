import styles from './Spinner.module.css'

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className={styles.wrap} role="status">
      <span className={styles.ball} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  )
}
