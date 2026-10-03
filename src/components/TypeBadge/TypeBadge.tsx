import { badgeStyle } from '../../lib/types'
import { formatName } from '../../lib/format'
import styles from './TypeBadge.module.css'

type Size = 'sm' | 'md' | 'lg'

interface BadgeProps {
  type: string
  size?: Size
  className?: string
}

export function TypeBadge({ type, size = 'md', className = '' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[size]} ${className}`} style={badgeStyle([type])}>
      {formatName(type)}
    </span>
  )
}

interface ListProps {
  types: string[]
  size?: Size
}

export function TypeBadges({ types, size = 'md' }: ListProps) {
  return (
    <span className={styles.list}>
      {types.map((type) => (
        <TypeBadge key={type} type={type} size={size} />
      ))}
    </span>
  )
}
