const SPECIAL_NAMES: Record<string, string> = {
  'nidoran-f': 'Nidoran♀',
  'nidoran-m': 'Nidoran♂',
  'mr-mime': 'Mr. Mime',
  'mime-jr': 'Mime Jr.',
  'mr-rime': 'Mr. Rime',
  farfetchd: 'Farfetch’d',
  sirfetchd: 'Sirfetch’d',
  'type-null': 'Type: Null',
  'ho-oh': 'Ho-Oh',
  'porygon-z': 'Porygon-Z',
  'jangmo-o': 'Jangmo-o',
  'hakamo-o': 'Hakamo-o',
  'kommo-o': 'Kommo-o',
  flabebe: 'Flabébé',
}

const capitalise = (word: string) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word)

export function formatName(slug: string): string {
  if (SPECIAL_NAMES[slug]) return SPECIAL_NAMES[slug]
  return slug.split('-').map(capitalise).join(' ')
}

export const formatDexNumber = (id: number) => `#${String(id).padStart(4, '0')}`

export const formatHeight = (decimetres: number) => `${(decimetres / 10).toFixed(1)} m`

export const formatWeight = (hectograms: number) => `${(hectograms / 10).toFixed(1)} kg`

const FRACTIONS: Record<number, string> = { 0.25: '¼', 0.5: '½' }

export const formatMultiplier = (value: number) => `${FRACTIONS[value] ?? value}×`
