const base = import.meta.env.BASE_URL

const CATEGORIES = [
  {
    id: 'sport',
    name: 'Sport',
    icon: '🏆',
    image: `${base}categories/sport.png`,
    themes: [
      'champions-league-winners',
      'f1-champions',
      'summer-olympics-gold',
      'winter-olympics-gold-medal-countries',
      'winter-olympics-2026-sports',
      'summer-olympics-2024-sports'
    ]
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: '🌍',
    image: `${base}categories/geography.svg`,
    themes: [
      'african-countries',
      'european-capitals',
      'asian-countries',
      'us-states'
    ]
  },
  {
    id: 'general',
    name: 'General',
    icon: '📰',
    image: `${base}categories/general.png`,
    themes: [
      'us-presidents',
      'oscar-best-picture',
      'time-person-of-the-year',
      'grammy-album-of-the-year',
      'grammy-record-of-the-year',
      'pixar-movies',
      'disney-animated-movies',
      'james-bond-movies',
      'iba-official-cocktails'
    ]
  },
  {
    id: 'nerd',
    name: 'Nerd',
    icon: '🧪',
    image: `${base}categories/nerd.svg`,
    themes: [
      'pokemon-gen1',
      'periodic-table',
      'harry-potter-characters',
      'monopoly-streets-dutch',
      'greek-alphabet'
    ]
  }
]

export default CATEGORIES
