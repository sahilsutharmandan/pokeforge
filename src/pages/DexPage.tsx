import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState/EmptyState'
import { Pagination } from '../components/Pagination/Pagination'
import { PokemonCard, PokemonCardSkeleton } from '../components/PokemonCard/PokemonCard'
import { DexFilters, type SortKey } from '../components/DexFilters/DexFilters'
import { useDexIndex, useTypeList } from '../hooks/usePokemon'
import type { DexEntry } from '../lib/api'
import { findGeneration, inGeneration } from '../lib/generations'
import { matchesQuery } from '../lib/search'
import styles from './DexPage.module.css'

const PAGE_SIZE = 24

const SORTERS: Record<SortKey, (a: DexEntry, b: DexEntry) => number> = {
  'id-asc': (a, b) => a.id - b.id,
  'id-desc': (a, b) => b.id - a.id,
  'name-asc': (a, b) => a.name.localeCompare(b.name),
  'name-desc': (a, b) => b.name.localeCompare(a.name),
}

export default function DexPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const types = useMemo(() => (params.get('types') ?? '').split(',').filter(Boolean), [params])
  const genId = Number(params.get('gen')) || 0
  const sort = (params.get('sort') as SortKey) || 'id-asc'
  const page = Math.max(1, Number(params.get('page')) || 1)

  const index = useDexIndex()
  const typeData = useTypeList(types)

  const update = (patch: Record<string, string | null>, resetPage = true) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    if (resetPage) next.delete('page')
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    if (!index.data) return []
    const gen = findGeneration(genId)
    const typeSets = types.length && typeData.data ? typeData.data.map((t) => new Set(t.pokemon)) : []
    return index.data
      .filter((e) => (gen ? inGeneration(gen, e.id) : true))
      .filter((e) => typeSets.every((set) => set.has(e.id)))
      .filter((e) => matchesQuery(e, query))
      .sort(SORTERS[sort] ?? SORTERS['id-asc'])
  }, [index.data, genId, types, typeData.data, query, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const loading = index.loading || (types.length > 0 && typeData.loading)

  const goToPage = (p: number) => {
    update({ page: p > 1 ? String(p) : null }, false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasFilters = Boolean(query || types.length || genId)

  return (
    <div className="page">
      <div className={styles.hero}>
        <div>
          <h1 className="page-title">Pokédex</h1>
          <p className="page-subtitle">
            {index.data ? `${index.data.length.toLocaleString()} Pokémon` : 'Every Pokémon'} from Kanto to Paldea.
            Search, filter and add them to your team.
          </p>
        </div>
      </div>

      <DexFilters
        entries={index.data ?? []}
        query={query}
        types={types}
        generation={genId}
        sort={sort}
        onQueryChange={(q) => update({ q: q || null })}
        onTypesChange={(t) => update({ types: t.length ? t.join(',') : null })}
        onGenerationChange={(g) => update({ gen: g ? String(g) : null })}
        onSortChange={(s) => update({ sort: s === 'id-asc' ? null : s }, false)}
        onReset={() => setParams(new URLSearchParams(), { replace: true })}
      />

      {index.error ? (
        <EmptyState
          title="Couldn't reach the Pokédex"
          message="PokeAPI didn't respond. Check your connection and try again."
          action={
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          }
        />
      ) : (
        <>
          <div className={styles.meta} aria-live="polite">
            {loading
              ? 'Loading…'
              : filtered.length === 0
                ? 'No results'
                : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length.toLocaleString()}`}
          </div>

          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 12 }, (_, i) => (
                <PokemonCardSkeleton key={i} />
              ))}
            </div>
          ) : pageItems.length === 0 ? (
            <EmptyState
              title="No Pokémon found"
              message={hasFilters ? 'Try a different name, type or generation.' : undefined}
              action={
                hasFilters && (
                  <button type="button" className="btn" onClick={() => setParams(new URLSearchParams())}>
                    Clear filters
                  </button>
                )
              }
            />
          ) : (
            <div className={styles.grid}>
              {pageItems.map((entry) => (
                <PokemonCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}

          {!loading && <Pagination page={currentPage} pageCount={pageCount} onChange={goToPage} />}
        </>
      )}
    </div>
  )
}
