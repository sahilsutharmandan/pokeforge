import type { DexEntry } from '../../lib/api'
import { formatName } from '../../lib/format'
import { GENERATIONS } from '../../lib/generations'
import { TYPES, badgeStyle } from '../../lib/types'
import { useNavigate } from 'react-router-dom'
import { Combobox } from '../Combobox/Combobox'
import styles from './DexFilters.module.css'

export type SortKey = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id-asc', label: 'Lowest number' },
  { value: 'id-desc', label: 'Highest number' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
]

const MAX_TYPES = 2

interface Props {
  entries: DexEntry[]
  query: string
  types: string[]
  generation: number
  sort: SortKey
  onQueryChange: (q: string) => void
  onTypesChange: (types: string[]) => void
  onGenerationChange: (gen: number) => void
  onSortChange: (sort: SortKey) => void
  onReset: () => void
}

export function DexFilters(props: Props) {
  const { query, types, generation, sort } = props
  const navigate = useNavigate()

  const selectedTypes = TYPES.filter((t) => types.includes(t))
  const otherTypes = TYPES.filter((t) => !types.includes(t))

  const addType = (type: string) => props.onTypesChange([...types, type].slice(-MAX_TYPES))
  const removeType = (index: number) => props.onTypesChange(types.filter((_, i) => i !== index))

  const active = Boolean(query || types.length || generation || sort !== 'id-asc')

  return (
    <section className={`card ${styles.panel}`} aria-label="Filters">
      <div className={styles.row}>
        <div className={styles.search}>
          <Combobox
            label="Search Pokémon"
            options={props.entries}
            value={query}
            onChange={props.onQueryChange}
            onSelect={(entry) => navigate(`/pokemon/${entry.id}`)}
            placeholder="Search by name or number"
          />
        </div>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Generation</span>
          <select
            className={styles.select}
            value={generation}
            onChange={(e) => props.onGenerationChange(Number(e.target.value))}
          >
            <option value={0}>All generations</option>
            {GENERATIONS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label} · {g.region}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Sort</span>
          <select
            className={styles.select}
            value={sort}
            onChange={(e) => props.onSortChange(e.target.value as SortKey)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.typesRow}>
        <span className={styles.typesLabel}>
          Types <span className={styles.hint}>(up to {MAX_TYPES})</span>
        </span>
        <div className={styles.chips} role="group" aria-label="Filter by type">
          {selectedTypes.map((type, i) => (
            <button
              key={type}
              type="button"
              className={`${styles.chip} ${styles.chipSelected}`}
              style={badgeStyle([type], 0)}
              aria-pressed
              onClick={() => removeType(i)}
            >
              <span className={styles.dot} />
              {formatName(type)}
            </button>
          ))}
          {otherTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={styles.chip}
              style={badgeStyle([type], 0)}
              aria-pressed={false}
              onClick={() => addType(type)}
            >
              <span className={styles.dot} />
              {formatName(type)}
            </button>
          ))}
        </div>
        {active && (
          <button type="button" className={styles.reset} onClick={props.onReset}>
            Reset
          </button>
        )}
      </div>
    </section>
  )
}
