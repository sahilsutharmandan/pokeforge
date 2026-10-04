import type { Pokemon, TypeData } from '../../lib/api'
import { formatName } from '../../lib/format'
import { defensiveMultipliers } from '../../lib/typeChart'
import { TYPES } from '../../lib/types'
import { TypeBadge } from '../TypeBadge/TypeBadge'
import styles from './TeamCoverage.module.css'

interface Props {
  members: Pokemon[]
  allTypes: TypeData[]
}

export function TeamCoverage({ members, allTypes }: Props) {
  const byName = new Map(allTypes.map((t) => [t.name, t]))
  const perMember = members.map((m) =>
    defensiveMultipliers(m.types.map((t) => byName.get(t)).filter((t): t is TypeData => Boolean(t))),
  )

  const rows = TYPES.map((type) => {
    const values = perMember.map((mults) => mults[type])
    const weak = values.filter((v) => v > 1).length
    const resist = values.filter((v) => v > 0 && v < 1).length
    const immune = values.filter((v) => v === 0).length
    return { type, weak, resist, immune, risk: weak >= 3 && resist === 0 }
  })

  const teamTypes = [...new Set(members.flatMap((m) => m.types))]
  const hit = (attacking: string, defending: string) => byName.get(attacking)?.damageFrom[defending] ?? 1
  const covered = TYPES.filter((def) => teamTypes.some((atk) => hit(atk, def) > 1))
  const uncovered = TYPES.filter((t) => !covered.includes(t))
  const risks = rows.filter((r) => r.risk)

  return (
    <div className={styles.coverage}>
      <section className={`card ${styles.panel}`}>
        <div className={styles.panelHead}>
          <h2 className={styles.title}>Defensive coverage</h2>
          <p className={styles.sub}>How many team members are weak to, resist or are immune to each attacking type.</p>
        </div>
        {risks.length > 0 && (
          <div className={styles.alert}>
            <strong>Shared weakness:</strong> {risks.map((r) => formatName(r.type)).join(', ')} hits three or more of your
            Pokémon and nothing on the team resists it.
          </div>
        )}
        <div className={styles.table} role="table" aria-label="Defensive coverage">
          <div className={`${styles.tr} ${styles.thead}`} role="row">
            <span role="columnheader">Attacking type</span>
            <span role="columnheader">Weak</span>
            <span role="columnheader">Resist</span>
            <span role="columnheader">Immune</span>
          </div>
          {rows.map((r) => (
            <div key={r.type} className={`${styles.tr} ${r.risk ? styles.riskRow : ''}`} role="row">
              <span role="cell">
                <TypeBadge type={r.type} size="sm" />
              </span>
              <span role="cell" className={r.weak ? styles.weak : styles.zero}>
                {r.weak}
              </span>
              <span role="cell" className={r.resist ? styles.resist : styles.zero}>
                {r.resist}
              </span>
              <span role="cell" className={r.immune ? styles.immune : styles.zero}>
                {r.immune}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={`card ${styles.panel}`}>
        <div className={styles.panelHead}>
          <h2 className={styles.title}>Offensive coverage</h2>
          <p className={styles.sub}>Types your team hits super effectively with same-type moves.</p>
        </div>
        <div className={styles.meter}>
          <div className={styles.meterFill} style={{ width: `${(covered.length / TYPES.length) * 100}%` }} />
        </div>
        <p className={styles.meterLabel}>
          {covered.length} of {TYPES.length} types covered
        </p>
        <h3 className={styles.listTitle}>Super effective against</h3>
        <div className={styles.badges}>
          {covered.length ? covered.map((t) => <TypeBadge key={t} type={t} size="sm" />) : <span className={styles.zero}>None yet</span>}
        </div>
        <h3 className={styles.listTitle}>Not covered</h3>
        <div className={styles.badges}>
          {uncovered.length ? (
            uncovered.map((t) => <TypeBadge key={t} type={t} size="sm" className={styles.faded} />)
          ) : (
            <span className={styles.zero}>Full coverage!</span>
          )}
        </div>
      </section>
    </div>
  )
}
