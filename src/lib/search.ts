import type { DexEntry } from './api'
import { formatName } from './format'

export const normaliseQuery = (q: string) => q.trim().toLowerCase().replace(/^#/, '')

function score(entry: DexEntry, q: string): number {
  if (!q) return 1
  if (/^\d+$/.test(q)) {
    const id = String(entry.id)
    if (id === String(Number(q))) return 3
    return id.startsWith(String(Number(q))) ? 2 : 0
  }
  const slug = entry.name.toLowerCase()
  const display = formatName(slug).toLowerCase()
  const dashed = q.replace(/\s+/g, '-')
  const cleanQ = q.replace(/[^a-z0-9]/g, '')
  const cleanDisplay = display.replace(/[^a-z0-9]/g, '')
  const cleanSlug = slug.replace(/[^a-z0-9]/g, '')

  if (
    slug.startsWith(dashed) ||
    display.startsWith(q) ||
    (cleanQ && (cleanDisplay.startsWith(cleanQ) || cleanSlug.startsWith(cleanQ)))
  ) {
    return 3
  }
  if (display.split(/[\s.:'’/-]+/).some((w) => w.startsWith(q))) return 2
  if (
    slug.includes(dashed) ||
    display.includes(q) ||
    (cleanQ && (cleanDisplay.includes(cleanQ) || cleanSlug.includes(cleanQ)))
  ) {
    return 1
  }
  return 0
}

export function matchesQuery(entry: DexEntry, query: string) {
  return score(entry, normaliseQuery(query)) > 0
}

export function rankMatches(entries: DexEntry[], query: string, limit = Infinity): DexEntry[] {
  const q = normaliseQuery(query)
  if (!q) return entries.slice(0, limit)
  return entries
    .map((entry) => ({ entry, s: score(entry, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.entry.id - b.entry.id)
    .slice(0, limit)
    .map((x) => x.entry)
}
