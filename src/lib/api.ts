import { cached } from './cache'

const BASE = 'https://pokeapi.co/api/v2'

export const DEX_SIZE = 1025

export type StatKey = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed'

export interface DexEntry {
  id: number
  name: string
}

export interface Stat {
  key: StatKey
  value: number
}

export interface Ability {
  name: string
  hidden: boolean
}

export interface Pokemon {
  id: number
  name: string
  types: string[]
  stats: Stat[]
  height: number
  weight: number
  abilities: Ability[]
  artwork: string
  shiny: string
  baseExperience: number | null
}

export interface Species {
  id: number
  genus: string
  flavorText: string
  generation: number
  evolutionChainId: number
  isLegendary: boolean
  isMythical: boolean
  captureRate: number
}

export interface EvolutionNode {
  id: number
  name: string
  method: string
  children: EvolutionNode[]
}

export interface TypeData {
  name: string
  damageFrom: Record<string, number>
  damageTo: Record<string, number>
  pokemon: number[]
}

interface NamedRef {
  name: string
  url: string
}

class ApiError extends Error {
  constructor(public status: number, path: string) {
    super(status === 404 ? 'Not found' : `PokeAPI request failed (${status}) for ${path}`)
  }
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/${path}`)
  if (!res.ok) throw new ApiError(res.status, path)
  return (await res.json()) as T
}

export const idFromUrl = (url: string) => Number(url.split('/').filter(Boolean).pop())

export const artworkUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

export function fetchDexIndex(): Promise<DexEntry[]> {
  return cached('dex-index', async () => {
    const data = await getJSON<{ results: NamedRef[] }>(`pokemon-species?limit=${DEX_SIZE}`)
    return data.results.map((r) => ({ id: idFromUrl(r.url), name: r.name })).filter((e) => e.id <= DEX_SIZE)
  })
}

interface RawPokemon {
  id: number
  height: number
  weight: number
  base_experience: number | null
  species: NamedRef
  types: { slot: number; type: NamedRef }[]
  stats: { base_stat: number; stat: NamedRef }[]
  abilities: { is_hidden: boolean; slot: number; ability: NamedRef }[]
  sprites: {
    front_default: string | null
    other?: { 'official-artwork'?: { front_default: string | null; front_shiny: string | null } }
  }
}

export function fetchPokemon(id: number): Promise<Pokemon> {
  return cached(`pokemon:${id}`, async () => {
    const raw = await getJSON<RawPokemon>(`pokemon/${id}`)
    const art = raw.sprites.other?.['official-artwork']
    return {
      id: raw.id,
      name: raw.species.name,
      types: [...raw.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
      stats: raw.stats.map((s) => ({ key: s.stat.name as StatKey, value: s.base_stat })),
      height: raw.height,
      weight: raw.weight,
      abilities: [...raw.abilities]
        .sort((a, b) => a.slot - b.slot)
        .map((a) => ({ name: a.ability.name, hidden: a.is_hidden })),
      artwork: art?.front_default ?? raw.sprites.front_default ?? artworkUrl(raw.id),
      shiny: art?.front_shiny ?? art?.front_default ?? artworkUrl(raw.id),
      baseExperience: raw.base_experience,
    }
  })
}

interface RawSpecies {
  id: number
  capture_rate: number
  is_legendary: boolean
  is_mythical: boolean
  generation: NamedRef
  evolution_chain: { url: string } | null
  genera: { genus: string; language: NamedRef }[]
  flavor_text_entries: { flavor_text: string; language: NamedRef; version: NamedRef }[]
}

const ROMAN: Record<string, number> = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9 }

const cleanFlavor = (text: string) =>
  text
    .replace(/[\f\n\r]/g, ' ')
    .replace(/­ /g, '')
    .replace(/\s+/g, ' ')
    .trim()

export function fetchSpecies(id: number): Promise<Species> {
  return cached(`species:${id}`, async () => {
    const raw = await getJSON<RawSpecies>(`pokemon-species/${id}`)
    const english = raw.flavor_text_entries.filter((f) => f.language.name === 'en')
    const flavor = english[english.length - 1]?.flavor_text ?? ''
    return {
      id: raw.id,
      genus: raw.genera.find((g) => g.language.name === 'en')?.genus ?? '',
      flavorText: cleanFlavor(flavor),
      generation: ROMAN[raw.generation.name.replace('generation-', '')] ?? 0,
      evolutionChainId: raw.evolution_chain ? idFromUrl(raw.evolution_chain.url) : 0,
      isLegendary: raw.is_legendary,
      isMythical: raw.is_mythical,
      captureRate: raw.capture_rate,
    }
  })
}

interface RawEvolutionDetail {
  is_default?: boolean
  trigger: NamedRef | null
  min_level: number | null
  item: NamedRef | null
  held_item: NamedRef | null
  min_happiness: number | null
  min_affection: number | null
  time_of_day: string
  known_move: NamedRef | null
  known_move_type: NamedRef | null
  location: NamedRef | null
  trade_species: NamedRef | null
}

interface RawChainLink {
  species: NamedRef
  evolution_details: RawEvolutionDetail[]
  evolves_to: RawChainLink[]
}

const words = (slug: string) =>
  slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

const TIME_OF_DAY: Record<string, string> = {
  day: 'during the day',
  night: 'at night',
  dusk: 'at dusk',
}

function describeEvolution(details: RawEvolutionDetail[]): string {
  if (details.length === 0) return ''
  const d = details.find((x) => x.is_default) ?? details[details.length - 1]
  const parts: string[] = []
  const trigger = d.trigger?.name

  if (trigger === 'trade') parts.push(d.trade_species ? `Trade for ${words(d.trade_species.name)}` : 'Trade')
  else if (trigger === 'use-item' && d.item) parts.push(words(d.item.name))
  else if (d.min_level) parts.push(`Lv. ${d.min_level}`)
  else if (trigger === 'level-up') parts.push('Level up')
  else if (trigger) parts.push(words(trigger))

  if (d.held_item) parts.push(`holding ${words(d.held_item.name)}`)
  if (d.min_happiness || d.min_affection) parts.push('high friendship')
  if (d.known_move_type) parts.push(`knows a ${words(d.known_move_type.name)} move`)
  if (d.known_move) parts.push(`knows ${words(d.known_move.name)}`)
  if (d.location) parts.push(`at ${words(d.location.name)}`)
  if (d.time_of_day != null) parts.push(TIME_OF_DAY[d.time_of_day] ?? `(${d.time_of_day})`)

  return parts.join(', ').replace(/, (during|at night|at dusk|\()/, ' $1')
}

function toNode(link: RawChainLink): EvolutionNode {
  return {
    id: idFromUrl(link.species.url),
    name: link.species.name,
    method: describeEvolution(link.evolution_details),
    children: link.evolves_to.map(toNode).filter((n) => n.id <= DEX_SIZE),
  }
}

export function fetchEvolutionChain(id: number): Promise<EvolutionNode> {
  return cached(`evolution:${id}`, async () => {
    const raw = await getJSON<{ chain: RawChainLink }>(`evolution-chain/${id}`)
    return toNode(raw.chain)
  })
}

interface RawType {
  name: string
  damage_relations: Record<
    | 'no_damage_to'
    | 'half_damage_to'
    | 'double_damage_to'
    | 'no_damage_from'
    | 'half_damage_from'
    | 'double_damage_from',
    NamedRef[]
  >
  pokemon: { pokemon: NamedRef }[]
}

function relationMap(none: NamedRef[], half: NamedRef[], double: NamedRef[]) {
  const map: Record<string, number> = {}
  for (const t of double) map[t.name] = 2
  for (const t of half) map[t.name] = 0.5
  for (const t of none) map[t.name] = 0
  return map
}

export function fetchType(name: string): Promise<TypeData> {
  return cached(`type:${name}`, async () => {
    const raw = await getJSON<RawType>(`type/${name}`)
    const r = raw.damage_relations
    return {
      name: raw.name,
      damageFrom: relationMap(r.no_damage_from, r.half_damage_from, r.double_damage_from),
      damageTo: relationMap(r.no_damage_to, r.half_damage_to, r.double_damage_to),
      pokemon: raw.pokemon.map((p) => idFromUrl(p.pokemon.url)).filter((id) => id <= DEX_SIZE),
    }
  })
}

export const fetchTypes = (names: string[]) => Promise.all(names.map(fetchType))
