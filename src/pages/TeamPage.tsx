import { useState, type CSSProperties } from 'react'
import { Combobox } from '../components/Combobox/Combobox'
import { TrashIcon } from '../components/Icons'
import { Spinner } from '../components/Spinner/Spinner'
import { TeamCoverage } from '../components/TeamCoverage/TeamCoverage'
import { TeamSlot } from '../components/TeamSlot/TeamSlot'
import { useAllTypes, useDexIndex, usePokemonList } from '../hooks/usePokemon'
import { statTotal } from '../lib/stats'
import { TEAM_SIZE, useTeam } from '../state/AppContext'
import styles from './TeamPage.module.css'

export default function TeamPage() {
  const { team, add, remove, clear, isFull } = useTeam()
  const index = useDexIndex()
  const members = usePokemonList(team.map((m) => m.id))
  const allTypes = useAllTypes()
  const [query, setQuery] = useState('')

  const byId = new Map((members.data ?? []).map((p) => [p.id, p]))
  const loaded = team.map((m) => byId.get(m.id)).filter((p) => p !== undefined)
  const averageBst = loaded.length ? Math.round(loaded.reduce((s, p) => s + statTotal(p.stats), 0) / loaded.length) : 0

  return (
    <div className="page">
      <div className={styles.head}>
        <div>
          <h1 className="page-title">Team builder</h1>
          <p className="page-subtitle">
            Pick up to {TEAM_SIZE} Pokémon and check how well they cover each other.
          </p>
        </div>
        <div className={styles.headActions}>
          {team.length > 0 && (
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (window.confirm('Remove every Pokémon from your team?')) clear()
              }}
            >
              <TrashIcon size={17} /> Clear team
            </button>
          )}
        </div>
      </div>

      <div className={`card ${styles.toolbar}`}>
        <div className={styles.picker}>
          <Combobox
            label="Add a Pokémon to your team"
            options={index.data ?? []}
            value={query}
            onChange={setQuery}
            onSelect={(entry) => {
              add(entry.id)
              setQuery('')
            }}
            placeholder={isFull ? 'Your team is full' : 'Add a Pokémon by name or number'}
            size="md"
          />
        </div>
        <div className={styles.stats}>
          <div>
            <span className={styles.statValue}>
              {team.length}/{TEAM_SIZE}
            </span>
            <span className={styles.statLabel}>Members</span>
          </div>
          <div>
            <span className={styles.statValue}>{averageBst || '—'}</span>
            <span className={styles.statLabel}>Avg. stat total</span>
          </div>
          <div>
            <span className={styles.statValue}>{new Set(loaded.flatMap((p) => p.types)).size}</span>
            <span className={styles.statLabel}>Types</span>
          </div>
        </div>
      </div>

      <div className={styles.slots} style={{ '--team-size': TEAM_SIZE } as CSSProperties}>
        {Array.from({ length: TEAM_SIZE }, (_, i) => {
          const member = team[i]
          return (
            <TeamSlot
              key={member?.key ?? `empty-${i}`}
              index={i}
              pokemon={member ? byId.get(member.id) : undefined}
              onRemove={member ? () => remove(member.id) : undefined}
            />
          )
        })}
      </div>

      <h2 className={styles.sectionTitle}>Type coverage</h2>
      {team.length === 0 ? (
        <p className={styles.muted}>Add Pokémon to see your team's strengths and weaknesses.</p>
      ) : !members.data || !allTypes.data ? (
        <Spinner label="Crunching type matchups…" />
      ) : (
        <TeamCoverage members={loaded} allTypes={allTypes.data} />
      )}
    </div>
  )
}
