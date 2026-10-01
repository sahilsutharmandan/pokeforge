export interface Generation {
  id: number
  label: string
  region: string
  start: number
  end: number
}

export const GENERATIONS: Generation[] = [
  { id: 1, label: 'Gen I', region: 'Kanto', start: 1, end: 151 },
  { id: 2, label: 'Gen II', region: 'Johto', start: 152, end: 251 },
  { id: 3, label: 'Gen III', region: 'Hoenn', start: 252, end: 386 },
  { id: 4, label: 'Gen IV', region: 'Sinnoh', start: 387, end: 493 },
  { id: 5, label: 'Gen V', region: 'Unova', start: 494, end: 649 },
  { id: 6, label: 'Gen VI', region: 'Kalos', start: 650, end: 721 },
  { id: 7, label: 'Gen VII', region: 'Alola', start: 722, end: 809 },
  { id: 8, label: 'Gen VIII', region: 'Galar', start: 810, end: 905 },
  { id: 9, label: 'Gen IX', region: 'Paldea', start: 906, end: 1025 },
]

export const findGeneration = (id: number) => GENERATIONS.find((g) => g.id === id)

export const inGeneration = (gen: Generation, dexId: number) => dexId >= gen.start && dexId <= gen.end
