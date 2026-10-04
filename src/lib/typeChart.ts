import type { TypeData } from './api'
import { TYPES } from './types'

export type Multipliers = Record<string, number>

export function defensiveMultipliers(defending: TypeData[]): Multipliers {
  const result: Multipliers = {}
  for (const attacking of TYPES) {
    let multiplier = 1
    for (const type of defending) {
      multiplier *= type.damageFrom[attacking] ?? 1
    }
    result[attacking] = multiplier
  }
  return result
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
