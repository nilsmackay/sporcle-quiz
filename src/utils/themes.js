// Map theme name to an emoji icon
export function getThemeIcon(themeName) {
  const name = themeName?.toLowerCase() || ''
  if (name.includes('africa')) return '🌍'
  if (name.includes('asia')) return '🌏'
  if (name.includes('europe') || name.includes('capital')) return '🏛️'
  if (name.includes('states') || name.includes('america')) return '🗽'
  return '📚'
}
