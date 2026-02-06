// Interpolate between two hex colors
export function interpolateColor(color1, color2, factor) {
  const c1 = parseInt(color1.slice(1), 16)
  const c2 = parseInt(color2.slice(1), 16)
  const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff
  const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff
  const r = Math.round(r1 + factor * (r2 - r1))
  const g = Math.round(g1 + factor * (g2 - g1))
  const b = Math.round(b1 + factor * (b2 - b1))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// Returns { bg, text } inline style colors for a percentage badge
// percentage: the player's score percentage
// minPercent/maxPercent: the range from the theme's options
export function getPercentageColor(percentage, minPercent, maxPercent) {
  // Invalid answer
  if (percentage === 100 && maxPercent < 100) return { bg: '#C23B22', text: 'white' }

  // Normalize to 0..1 where 0 = best (lowest %), 1 = worst (highest %)
  const normalizedPosition = maxPercent === minPercent ? 0 : (percentage - minPercent) / (maxPercent - minPercent)

  const green = '#2D6A4F'
  const gold = '#B8924A'
  const red = '#C23B22'

  let bgColor
  if (normalizedPosition <= 0.5) {
    bgColor = interpolateColor(green, gold, normalizedPosition * 2)
  } else {
    bgColor = interpolateColor(gold, red, (normalizedPosition - 0.5) * 2)
  }

  return { bg: bgColor, text: 'white' }
}
