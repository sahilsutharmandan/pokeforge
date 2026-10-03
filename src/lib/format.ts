const capitalise = (word: string) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word)

const DISPLAY_NAMES: Record<string, string> = {
  'mr-mime': 'Mr. Mime',
  'mr-rime': 'Mr. Rime',
  'mime-jr': 'Mime Jr.',
  'nidoran-f': 'Nidoran♀',
  'nidoran-m': 'Nidoran♂',
  farfetchd: "Farfetch’d",
  sirfetchd: "Sirfetch’d",
  'type-null': 'Type: Null',
  'ho-oh': 'Ho-Oh',
  'porygon-z': 'Porygon-Z',
  'jangmo-o': 'Jangmo-o',
  'hakamo-o': 'Hakamo-o',
  'kommo-o': 'Kommo-o',
  'wo-chien': 'Wo-Chien',
  'chien-pao': 'Chien-Pao',
  'ting-lu': 'Ting-Lu',
  'chi-yu': 'Chi-Yu',
  flabebe: 'Flabébé',
}

export const formatName = (slug: string) => {
  const name = slug.trim()
  return DISPLAY_NAMES[name] ?? name.split('-').map(capitalise).join(' ')
}

export const formatDexNumber = (id: number) => `#${String(id).padStart(4, '0')}`

export const round = (value: number, digits = 1) => Number(value.toFixed(digits))

export const toPercent = (value: number, max = 100) => Math.max(0, (value / max) * 100)

const formatMeasure = (value: number, unit: string) => `${round(value)} ${unit}`

export const formatHeight = (height: number) => formatMeasure(height, 'm')

export const formatWeight = (weight: number) => formatMeasure(weight, 'kg')

export const formatMultiplier = (value: number) => `${round(value)}×`
