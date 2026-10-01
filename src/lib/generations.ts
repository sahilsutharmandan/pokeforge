export interface Generation {
  id: number
  label: string
  region: string
  start: number
  end: number
}

const REGIONS: [region: string, size: number][] = [
  ['Kanto', 151],
  ['Johto', 100],
  ['Hoenn', 135],
  ['Sinnoh', 107],
  ['Unova', 156],
  ['Kalos', 72],
  ['Alola', 88],
  ['Galar', 96],
  ['Paldea', 120],
]

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']

let offset = 0

export const GENERATIONS: Generation[] = REGIONS.map(([region, size], i) => {
  const start = offset
  offset += size
  return { id: i + 1, label: `Gen ${NUMERALS[i]}`, region, start, end: start + size - 1 }
})

export const findGeneration = (id: number) => GENERATIONS.find((g) => g.id === id)

export const inGeneration = (gen: Generation, dexId: number) => dexId >= gen.start && dexId <= gen.end
