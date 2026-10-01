import { fetchDexIndex, fetchEvolutionChain, fetchPokemon, fetchSpecies, fetchType, fetchTypes } from '../lib/api'
import { TYPES } from '../lib/types'
import { useAsync } from './useAsync'

export const useDexIndex = () => useAsync(() => fetchDexIndex(), [])

export const usePokemon = (id: number | undefined) => useAsync(() => (id ? fetchPokemon(id) : null), [id])

export const useSpecies = (id: number | undefined) => useAsync(() => (id ? fetchSpecies(id) : null), [id])

export const useEvolutionChain = (id: number | undefined) =>
  useAsync(() => (id ? fetchEvolutionChain(id) : null), [id])

export const useType = (name: string | undefined) => useAsync(() => (name ? fetchType(name) : null), [name])

export const useTypeList = (names: string[]) => useAsync(() => fetchTypes(names), [names.join(',')])

export const useAllTypes = () => useAsync(() => fetchTypes([...TYPES]), [])

export const usePokemonList = (ids: number[]) =>
  useAsync(() => Promise.all(ids.map((id) => fetchPokemon(id))), [ids.join(',')])
