import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CompareChart } from '../components/CompareChart/CompareChart'
import { Combobox } from '../components/Combobox/Combobox'
import { Spinner } from '../components/Spinner/Spinner'
import { TypeBadges } from '../components/TypeBadge/TypeBadge'
import { useDexIndex, usePokemon } from '../hooks/usePokemon'
import { DEX_SIZE, type DexEntry, type Pokemon } from '../lib/api'
import { formatDexNumber, formatHeight, formatName, formatWeight } from '../lib/format'
import { STAT_LABELS, STAT_ORDER, statTotal, statValue } from '../lib/stats'
import { typeGradient } from '../lib/types'
import styles from './ComparePage.module.css'

const parseId = (value: string | null, fallback: number) => {
  const n = Number(value)
  return Number.isInteger(n) && n >= 1 && n <= DEX_SIZE ? n : fallback
}

function Picker({
  side,
  pokemon,
  options,
  onPick,
}: {
  side: 'a' | 'b'
  pokemon?: Pokemon
  options: DexEntry[]
  onPick: (entry: DexEntry) => void
}) {
  const [query, setQuery] = useState('')
  return (
    <div className={`card ${styles.picker} ${styles[side]}`} style={pokemon ? typeGradient(pokemon.types) : undefined}>
      <Combobox
        label={side === 'a' ? 'First Pokémon' : 'Second Pokémon'}
        options={options}
        value={query}
        onChange={setQuery}
        onSelect={(entry) => {
          onPick(entry)
          setQuery('')
        }}
        placeholder="Change Pokémon"
        size="md"
      />
      {pokemon ? (
        <Link to={`/pokemon/${pokemon.id}`} className={styles.pickerBody}>
          <img src={pokemon.artwork} alt="" width={150} height={150} className={styles.pickerImg} />
          <div className={styles.pickerInfo}>
            <span className={styles.pickerNumber}>{formatDexNumber(pokemon.id)}</span>
            <span className={styles.pickerName}>
              <span className={`${styles.dot} ${styles[`dot${side}`]}`} />
              {formatName(pokemon.name)}
            </span>
            <TypeBadges types={pokemon.types} size="sm" />
            <span className={styles.pickerTotal}>
              Stat total <strong>{statTotal(pokemon.stats)}</strong>
            </span>
          </div>
        </Link>
      ) : (
        <Spinner />
      )}
    </div>
  )
}

interface Row {
  label: string
  av: number
  bv: number
  a: string
  b: string
  neutral?: boolean
}

export default function ComparePage() {
  const [params, setParams] = useSearchParams()
  const aId = parseId(params.get('a'), 6)
  const bId = parseId(params.get('b'), 9)
  const index = useDexIndex()
  const aState = usePokemon(aId)
  const bState = usePokemon(bId)
  const a = aState.data?.id === aId ? aState.data : undefined
  const b = bState.data?.id === bId ? bState.data : undefined

  const set = (key: 'a' | 'b', id: number) => {
    const next = new URLSearchParams(params)
    next.set('a', String(key === 'a' ? id : aId))
    next.set('b', String(key === 'b' ? id : bId))
    setParams(next, { replace: true })
  }

  const swap = () => setParams(new URLSearchParams({ a: String(bId), b: String(aId) }), { replace: true })

  const rows: Row[] =
    a && b
      ? [
          ...STAT_ORDER.map((k) => ({
            label: STAT_LABELS[k],
            av: statValue(a.stats, k),
            bv: statValue(b.stats, k),
            a: String(statValue(a.stats, k)),
            b: String(statValue(b.stats, k)),
          })),
          { label: 'Total', av: statTotal(a.stats), bv: statTotal(b.stats), a: String(statTotal(a.stats)), b: String(statTotal(b.stats)) },
          { label: 'Height', av: a.height, bv: b.height, a: formatHeight(a.height), b: formatHeight(b.height), neutral: true },
          { label: 'Weight', av: a.weight, bv: b.weight, a: formatWeight(a.weight), b: formatWeight(b.weight), neutral: true },
        ]
      : []

  return (
    <div className="page">
      <h1 className="page-title">Compare</h1>
      <p className="page-subtitle">Put two Pokémon side by side and see who comes out ahead.</p>

      <div className={styles.pickers}>
        <Picker side="a" pokemon={a} options={index.data ?? []} onPick={(e) => set('a', e.id)} />
        <button type="button" className={styles.swap} onClick={swap} aria-label="Swap Pokémon" title="Swap">
          ⇄
        </button>
        <Picker side="b" pokemon={b} options={index.data ?? []} onPick={(e) => set('b', e.id)} />
      </div>

      {a && b ? (
        <div className={styles.results}>
          <section className={`card ${styles.panel}`}>
            <h2 className={styles.panelTitle}>Base stats</h2>
            <CompareChart a={a} b={b} />
          </section>

          <section className={`card ${styles.panel}`}>
            <h2 className={styles.panelTitle}>Head to head</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Stat</th>
                  <th scope="col">{formatName(a.name)}</th>
                  <th scope="col">{formatName(b.name)}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className={r.label === 'Total' ? styles.totalRow : ''}>
                    <th scope="row">{r.label}</th>
                    <td className={!r.neutral && r.av > r.bv ? styles.win : ''}>{r.a}</td>
                    <td className={!r.neutral && r.bv > r.av ? styles.win : ''}>{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      ) : (
        <Spinner label="Loading Pokémon…" />
      )}
    </div>
  )
}
