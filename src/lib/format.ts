const capitalise = (word: string) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word)

export const formatName = (slug: string) => capitalise(slug.trim())

export const formatDexNumber = (id: number) => `#${String(id).padStart(4, '0')}`

export const round = (value: number, digits = 1) => Number(value.toFixed(digits))

export const toPercent = (value: number, max = 100) => Math.min(100, Math.max(0, (value / max) * 100))

const formatMeasure = (value: number, unit: string) => `${round(value)} ${unit}`

export const formatHeight = (height: number) => formatMeasure(height / 10, 'm')

export const formatWeight = (weight: number) => formatMeasure(weight / 10, 'kg')

export const formatMultiplier = (value: number) => `${round(value)}×`
