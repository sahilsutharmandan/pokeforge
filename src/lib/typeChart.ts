import type { TypeData } from './api'
import { TYPES } from './types'

export type Multipliers = Record<string, number>

const damageFactor = (type: TypeData, attacking: string) => type.damageFrom[attacking] ?? 1

export function defensiveMultipliers(defending: TypeData[]): Multipliers {
  return Object.fromEntries(
    TYPES.map((attacking) => [attacking, defending.reduce((m, type) => m * damageFactor(type, attacking), 1)]),
  )
}

export interface EffectivenessGroups {
  weak: [string, number][]
  resist: [string, number][]
  immune: [string, number][]
}

export function groupMultipliers(multipliers: Multipliers): EffectivenessGroups {
  const entries = Object.entries(multipliers)
  return {
    weak: entries.filter(([, m]) => m > 1).sort((a, b) => b[1] - a[1]),
    resist: entries.filter(([, m]) => m > 0 && m < 1).sort((a, b) => a[1] - b[1]),
    immune: entries.filter(([, m]) => m === 0),
  }
}

export function offensiveHits(attacking: TypeData, defending: string): number {
  return attacking.damageTo[defending] ?? 1
}
