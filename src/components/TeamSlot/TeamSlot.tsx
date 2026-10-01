import { Link } from 'react-router-dom'
import type { Pokemon } from '../../lib/api'
import { formatDexNumber, formatName } from '../../lib/format'
import { typeGradient } from '../../lib/types'
import { CloseIcon, PlusIcon } from '../Icons'
import { TypeBadges } from '../TypeBadge/TypeBadge'
import styles from './TeamSlot.module.css'

interface Props {
  index: number
  pokemon?: Pokemon
  onRemove?: () => void
}

export function TeamSlot({ index, pokemon, onRemove }: Props) {
  if (!pokemon) {
    return (
      <Link to="/" className={`${styles.slot} ${styles.empty}`}>
        <span className={styles.emptyIcon}>
          <PlusIcon size={22} />
        </span>
        <span className={styles.emptyLabel}>Slot {index + 1}</span>
        <span className={styles.emptyHint}>Add from the Pokédex</span>
      </Link>
    )
  }

  const name = formatName(pokemon.name)
  return (
    <div className={styles.slot} style={typeGradient(pokemon.types)}>
      <button type="button" className={styles.remove} onClick={onRemove} aria-label={`Remove ${name} from team`}>
        <CloseIcon size={16} />
      </button>
      <Link to={`/pokemon/${pokemon.id}`} className={styles.link}>
        <span className={styles.position}>{index + 1}</span>
        <div className={styles.art}>
          <img src={pokemon.artwork} alt="" width={120} height={120} className={styles.img} />
        </div>
        <span className={styles.number}>{formatDexNumber(pokemon.id)}</span>
        <span className={styles.name}>{name}</span>
        <TypeBadges types={pokemon.types} size="sm" />
      </Link>
    </div>
  )
}
