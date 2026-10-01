import type { CSSProperties } from 'react'

export const TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const

export type TypeName = (typeof TYPES)[number]

export const TYPE_COLORS: Record<string, string> = {
  normal: '#a8a77a',
  fire: '#ee8130',
  water: '#6390f0',
  electric: '#f2c51b',
  grass: '#62b83f',
  ice: '#7fcfcb',
  fighting: '#c22e28',
  poison: '#a33ea1',
  ground: '#d9b45a',
  flying: '#9a80ee',
  psychic: '#f95587',
  bug: '#9cae1b',
  rock: '#b6a136',
  ghost: '#735797',
  dragon: '#6f35fc',
  dark: '#705746',
  steel: '#9a9ab8',
  fairy: '#d685ad',
}

const DARK_TEXT = new Set(['electric', 'ice', 'ground', 'normal', 'bug', 'rock', 'steel', 'grass'])

export const typeColor = (type: string) => TYPE_COLORS[type] ?? '#8a8a8a'

export const typeTextColor = (type: string) => (DARK_TEXT.has(type) ? '#1d1f2b' : '#ffffff')

export function badgeStyle(types: string[], index: number): CSSProperties {
  const type = types[index] ?? types[0]
  return { '--badge': typeColor(type), '--badge-text': typeTextColor(type) } as CSSProperties
}

export function typeGradient(types: string[]): CSSProperties {
  const first = typeColor(types[0])
  const second = types[1] ? typeColor(types[1]) : first
  return { '--type-1': first, '--type-2': second } as CSSProperties
}
