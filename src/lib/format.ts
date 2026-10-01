const capitalise = (word: string) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word)

export const formatName = (slug: string) => capitalise(slug.trim())

export const formatDexNumber = (id: number) => `#${String(id).padStart(4, '0')}`

export const formatHeight = (decimetres: number) => `${(decimetres / 10).toFixed(1)} m`

export const formatWeight = (hectograms: number) => `${(hectograms / 10).toFixed(1)} kg`

const FRACTIONS: Record<number, string> = { 0.25: '¼', 0.5: '½' }

export const formatMultiplier = (value: number) => `${FRACTIONS[value] ?? value}×`
