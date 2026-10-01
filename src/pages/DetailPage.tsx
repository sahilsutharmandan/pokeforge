import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState/EmptyState'
import { ChevronLeftIcon, ChevronRightIcon, CompareIcon, HeartIcon, PlusIcon, SparkleIcon } from '../components/Icons'
import { Spinner } from '../components/Spinner/Spinner'
import { StatBars } from '../components/StatBars/StatBars'
import { TypeBadges } from '../components/TypeBadge/TypeBadge'
import { useDexIndex, usePokemon, useSpecies } from '../hooks/usePokemon'
import { DEX_SIZE } from '../lib/api'
import { formatDexNumber, formatHeight, formatName, formatWeight } from '../lib/format'
import { findGeneration } from '../lib/generations'
import { typeGradient } from '../lib/types'
import { useFavourites, useTeam } from '../state/AppContext'
import styles from './DetailPage.module.css'

export default function DetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const valid = Number.isInteger(id) && id >= 1 && id <= DEX_SIZE

  const pokemon = usePokemon(valid ? id : undefined)
  const species = useSpecies(valid ? id : undefined)
  const index = useDexIndex()
  const team = useTeam()
  const { isFavourite, toggle } = useFavourites()
  const navigate = useNavigate()
  const [shinyFor, setShinyFor] = useState<number | null>(null)
  const shiny = shinyFor === id

  if (!valid || pokemon.error) {
    return (
      <div className="page">
        <EmptyState
          title="Pokémon not found"
          message={valid ? 'PokeAPI could not load this Pokémon right now.' : `There is no Pokémon #${params.id}.`}
          action={
            <Link to="/" className="btn btn-primary">
              Back to the Pokédex
            </Link>
          }
        />
      </div>
    )
  }

  const p = pokemon.data?.id === id ? pokemon.data : undefined
  const s = species.data?.id === id ? species.data : undefined
  if (!p) {
    return (
      <div className="page">
        <Spinner label="Loading Pokémon…" />
      </div>
    )
  }

  const name = formatName(p.name)
  const prev = id > 1 ? index.data?.[id - 2] : undefined
  const next = id < DEX_SIZE ? index.data?.[id] : undefined
  const favourite = isFavourite(id)
  const generation = s ? findGeneration(s.generation) : undefined

  return (
    <div className="page">
      <div className={styles.topBar}>
        <Link to="/" className={styles.back}>
          <ChevronLeftIcon size={18} /> Pokédex
        </Link>
        <div className={styles.siblings}>
          {prev && (
            <Link to={`/pokemon/${prev.id}`} className={styles.sibling}>
              <ChevronLeftIcon size={16} />
              <span className={styles.siblingNumber}>{formatDexNumber(prev.id)}</span>
              <span className={styles.siblingName}>{formatName(prev.name)}</span>
            </Link>
          )}
          {next && (
            <Link to={`/pokemon/${next.id}`} className={styles.sibling}>
              <span className={styles.siblingName}>{formatName(next.name)}</span>
              <span className={styles.siblingNumber}>{formatDexNumber(next.id)}</span>
              <ChevronRightIcon size={16} />
            </Link>
          )}
        </div>
      </div>

      <section className={`card ${styles.hero}`} style={typeGradient(p.types)}>
        <div className={styles.artPanel}>
          <img
            key={`${id}-${shiny}`}
            src={shiny ? p.shiny : p.artwork}
            alt={shiny ? `Shiny ${name}` : name}
            className={styles.artwork}
            width={475}
            height={475}
          />
          <button
            type="button"
            className={`${styles.shinyToggle} ${shiny ? styles.shinyOn : ''}`}
            onClick={() => setShinyFor(shiny ? null : id)}
            aria-pressed={shiny}
          >
            <SparkleIcon size={16} />
            {shiny ? 'Shiny' : 'Normal'}
          </button>
        </div>

        <div className={styles.heroInfo}>
          <span className={styles.number}>{formatDexNumber(p.id)}</span>
          <h1 className={styles.name}>{name}</h1>
          {s?.genus && <p className={styles.genus}>{s.genus}</p>}
          <div className={styles.badges}>
            <TypeBadges types={p.types} size="lg" />
            {s?.isLegendary && <span className={styles.tag}>Legendary</span>}
            {s?.isMythical && <span className={styles.tag}>Mythical</span>}
          </div>
          <p className={styles.flavor}>{s ? s.flavorText || 'No Pokédex entry yet.' : '…'}</p>

          <div className={styles.actions}>
            <button type="button" className="btn btn-primary" onClick={() => team.add(id)} disabled={team.isFull}>
              <PlusIcon size={18} /> {team.isFull ? 'Team full' : 'Add to team'}
            </button>
            <button
              type="button"
              className={`btn ${favourite ? styles.favourite : ''}`}
              onClick={() => toggle(id)}
              aria-pressed={favourite}
            >
              <HeartIcon size={18} filled={favourite} /> {favourite ? 'Favourited' : 'Favourite'}
            </button>
            <button type="button" className="btn" onClick={() => navigate(`/compare?a=${id}`)}>
              <CompareIcon size={18} /> Compare
            </button>
          </div>
        </div>
      </section>

      <div className={styles.columns}>
        <section className={`card ${styles.panel}`}>
          <h2 className={styles.panelTitle}>About</h2>
          <dl className={styles.facts}>
            <div>
              <dt>Height</dt>
              <dd>{formatHeight(p.height)}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{formatWeight(p.weight)}</dd>
            </div>
            <div>
              <dt>Generation</dt>
              <dd>{generation ? `${generation.label} · ${generation.region}` : '—'}</dd>
            </div>
            <div>
              <dt>Capture rate</dt>
              <dd>{s ? s.captureRate : '—'}</dd>
            </div>
            <div>
              <dt>Base exp.</dt>
              <dd>{p.baseExperience ?? '—'}</dd>
            </div>
          </dl>
          <h3 className={styles.subTitle}>Abilities</h3>
          <ul className={styles.abilities}>
            {p.abilities.map((a) => (
              <li key={a.name} className={a.hidden ? styles.hiddenAbility : ''}>
                {formatName(a.name)}
                {a.hidden && <span className={styles.hiddenTag}>Hidden</span>}
              </li>
            ))}
          </ul>
        </section>

        <section className={`card ${styles.panel}`}>
          <h2 className={styles.panelTitle}>Base stats</h2>
          <StatBars stats={p.stats} />
        </section>
      </div>
    </div>
  )
}
