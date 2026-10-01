import { useTypeList } from '../../hooks/usePokemon'
import { formatMultiplier, formatName } from '../../lib/format'
import { defensiveMultipliers, groupMultipliers } from '../../lib/typeChart'
import { TYPES, badgeStyle } from '../../lib/types'
import { TypeBadge } from '../TypeBadge/TypeBadge'
import styles from './TypeEffectiveness.module.css'

function tone(multiplier: number) {
  if (multiplier === 0) return styles.immune
  if (multiplier >= 4) return styles.x4
  if (multiplier >= 2) return styles.x2
  if (multiplier <= 0.25) return styles.quarter
  if (multiplier < 1) return styles.half
  return styles.neutral
}

export function TypeEffectiveness({ types }: { types: string[] }) {
  const { data, loading, error } = useTypeList(types)

  if (error) return <p className={styles.message}>Type data is unavailable right now.</p>
  if (loading || !data) return <p className={styles.message}>Loading type matchups…</p>

  const multipliers = defensiveMultipliers(data)
  const groups = groupMultipliers(multipliers)

  const summary: { title: string; items: [string, number][]; empty: string }[] = [
    { title: 'Weak to', items: groups.weak, empty: 'No weaknesses' },
    { title: 'Resists', items: groups.resist, empty: 'No resistances' },
    { title: 'Immune to', items: groups.immune, empty: 'No immunities' },
  ]

  return (
    <div className={styles.wrap}>
      <div className={styles.summary}>
        {summary.map((group) => (
          <div key={group.title} className={styles.group}>
            <h3 className={styles.groupTitle}>
              {group.title} <span className={styles.count}>{group.items.length}</span>
            </h3>
            {group.items.length === 0 ? (
              <p className={styles.none}>{group.empty}</p>
            ) : (
              <ul className={styles.groupList}>
                {group.items.map(([type, m]) => (
                  <li key={type} className={styles.groupItem}>
                    <TypeBadge type={type} size="sm" />
                    <span className={`${styles.pill} ${tone(m)}`}>{formatMultiplier(m)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className={styles.gridTitle}>Damage taken from each attacking type</div>
      <div className={styles.grid}>
        {TYPES.map((type) => {
          const m = multipliers[type]
          return (
            <div key={type} className={`${styles.cell} ${tone(m)}`} style={badgeStyle([type], 0)}>
              <span className={styles.cellType}>{formatName(type).slice(0, 3)}</span>
              <span className={styles.cellValue}>{formatMultiplier(m)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
