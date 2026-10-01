import type { Stat, StatKey } from './api'

export const STAT_LABELS: Record<StatKey, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

export const STAT_ORDER: StatKey[] = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']

export const MAX_BASE_STAT = 255

export const statTotal = (stats: Stat[]) => stats.reduce((sum, s) => sum + s.value, 0)

export const statValue = (stats: Stat[], key: StatKey) => stats.find((s) => s.key === key)?.value ?? 0

export function statPercent(value: number, max = MAX_BASE_STAT) {
  return Math.max(0, Math.min(100, (value / max) * 100))
}

export function statTone(value: number) {
  if (value < 50) return 'low'
  if (value < 80) return 'mid'
  if (value < 110) return 'good'
  return 'high'
}
