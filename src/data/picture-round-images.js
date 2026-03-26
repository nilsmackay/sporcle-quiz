const PICTURE_ROUND_IMAGES = [
  {
    title: 'Speed Limit',
    description: 'A familiar road sign with a missing number',
    correctNumber: 60,
    // Inline SVG as a data URI
    image: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260" width="200" height="260">
        <rect x="10" y="10" width="180" height="240" rx="8" fill="white" stroke="#C23B22" stroke-width="6"/>
        <rect x="22" y="22" width="156" height="216" rx="4" fill="white" stroke="#C23B22" stroke-width="2"/>
        <text x="100" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1A1A1A">SPEED</text>
        <text x="100" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1A1A1A">LIMIT</text>
        <text x="100" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="100" font-weight="bold" fill="#C23B22">?</text>
      </svg>
    `.trim())}`,
  },
]

export default PICTURE_ROUND_IMAGES
