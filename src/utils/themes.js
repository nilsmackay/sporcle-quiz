import themes from '../data/themes.json'

// Look up a theme object by its ID
export function getThemeById(themeId) {
  return themes.find(t => t.id === themeId) || null
}

// Map theme name to an emoji icon
export function getThemeIcon(themeName) {
  const name = themeName?.toLowerCase() || ''
  if (name.includes('africa')) return '🌍'
  if (name.includes('asia')) return '🌏'
  if (name.includes('europe') || name.includes('capital')) return '🏛️'
  if (name.includes('states') || name.includes('america')) return '🗽'
  return '📚'
}
