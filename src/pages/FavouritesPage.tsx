import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState/EmptyState'
import { PokemonCard } from '../components/PokemonCard/PokemonCard'
import { useDexIndex } from '../hooks/usePokemon'
import { useFavourites } from '../state/AppContext'
import dexStyles from './DexPage.module.css'
import styles from './FavouritesPage.module.css'

type Order = 'added' | 'number'

export default function FavouritesPage() {
  const { favourites } = useFavourites()
  const index = useDexIndex()
  const [order, setOrder] = useState<Order>('added')

  const entries = useMemo(() => {
    if (!index.data) return []
    const byId = new Map(index.data.map((e) => [e.id, e]))
    const list = favourites.map((id) => byId.get(id)).filter((e) => e !== undefined)
    return order === 'number' ? [...list].sort((a, b) => a.id - b.id) : [...list].reverse()
  }, [favourites, index.data, order])

  return (
    <div className="page">
      <div className={styles.head}>
        <div>
          <h1 className="page-title">Favourites</h1>
          <p className="page-subtitle">
            {favourites.length
              ? `${favourites.length} Pokémon you've hearted.`
              : 'Tap the heart on any Pokémon to keep it here.'}
          </p>
        </div>
        {favourites.length > 1 && (
          <div className={styles.segmented} role="group" aria-label="Order">
            {(['added', 'number'] as Order[]).map((o) => (
              <button
                key={o}
                type="button"
                className={order === o ? styles.segActive : ''}
                aria-pressed={order === o}
                onClick={() => setOrder(o)}
              >
                {o === 'added' ? 'Recently added' : 'Dex number'}
              </button>
            ))}
          </div>
        )}
      </div>

      {favourites.length === 0 ? (
        <EmptyState
          title="No favourites yet"
          message="Browse the Pokédex and heart the Pokémon you love."
          action={
            <Link to="/" className="btn btn-primary">
              Open the Pokédex
            </Link>
          }
        />
      ) : (
        <div className={dexStyles.grid}>
          {entries.map((entry) => (
            <PokemonCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
