import type { ReactNode } from 'react'
import { Logo } from '../Layout/Logo'
import styles from './EmptyState.module.css'

interface Props {
  title: string
  message?: ReactNode
  action?: ReactNode
  compact?: boolean
}

export function EmptyState({ title, message, action, compact }: Props) {
  return (
    <div className={`${styles.empty} ${compact ? styles.compact : ''}`}>
      <div className={styles.icon}>
        <Logo size={compact ? 36 : 52} />
      </div>
      <h2 className={styles.title}>{title}</h2>
      {message && <p className={styles.message}>{message}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
