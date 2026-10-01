import { Link } from 'react-router-dom'
import { usePokemon } from '../../hooks/usePokemon'
import { artworkUrl, type DexEntry } from '../../lib/api'
import { formatDexNumber, formatName } from '../../lib/format'
import { typeGradient } from '../../lib/types'
import { useFavourites, useTeam } from '../../state/AppContext'
import { HeartIcon, PlusIcon } from '../Icons'
import { TypeBadges } from '../TypeBadge/TypeBadge'
import styles from './PokemonCard.module.css'

interface Props {
  entry: DexEntry
}

export function PokemonCard({ entry }: Props) {
  const { data: pokemon } = usePokemon(entry.id)
  const { isFavourite, toggle } = useFavourites()
  const team = useTeam()
  const favourite = isFavourite(entry.id)
  const name = formatName(entry.name)

  return (
    <article className={styles.card} style={pokemon ? typeGradient(pokemon.types) : undefined}>
      <Link to={`/pokemon/${entry.id}`} className={styles.link} aria-label={`${name}, ${formatDexNumber(entry.id)}`}>
        <div className={styles.art}>
          <img
            src={pokemon?.artwork ?? artworkUrl(entry.id)}
            alt=""
            loading="lazy"
            width={160}
            height={160}
            className={styles.img}
          />
        </div>
        <div className={styles.body}>
          <span className={styles.number}>{formatDexNumber(entry.id)}</span>
          <h3 className={styles.name}>{name}</h3>
          <div className={styles.types}>
            {pokemon ? <TypeBadges types={pokemon.types} size="sm" /> : <span className={styles.typeSkeleton} />}
          </div>
        </div>
      </Link>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.iconBtn} ${favourite ? styles.favourite : ''}`}
          onClick={() => toggle(entry.id)}
          aria-pressed={favourite}
          aria-label={favourite ? `Remove ${name} from favourites` : `Add ${name} to favourites`}
          title={favourite ? 'Remove from favourites' : 'Add to favourites'}
        >
          <HeartIcon size={17} filled={favourite} />
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => team.add(entry.id)}
          disabled={team.isFull}
          aria-label={`Add ${name} to team`}
          title={team.isFull ? 'Team is full' : 'Add to team'}
        >
          <PlusIcon size={17} />
        </button>
      </div>
    </article>
  )
}

export function PokemonCardSkeleton() {
  return (
    <div className={`${styles.card} ${styles.skeleton}`} aria-hidden="true">
      <div className={styles.art}>
        <span className={styles.imgSkeleton} />
      </div>
      <div className={styles.body}>
        <span className={styles.lineSkeleton} style={{ width: '30%' }} />
        <span className={styles.lineSkeleton} style={{ width: '60%', height: 16 }} />
        <span className={styles.typeSkeleton} />
      </div>
    </div>
  )
}
