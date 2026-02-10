import React, { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

const translations = {
  en: {
    // Header
    'header.title': 'Trivia Showdown',
    'header.subtitle': 'Get ready to play!',
    'header.scores': 'Scores',
    'header.hide': 'Hide',
    'header.newGame': 'New Game',
    'header.newGameShort': 'New',
    'header.round1': 'Round 1: YouTube Views',
    'header.round2': 'Round 2: The Sporcle Round',
    'header.round2Named': 'Round 2: {name}',

    // Setup
    'setup.welcome': 'Welcome, Contestants!',
    'setup.subtitle': 'The ultimate trivia challenge awaits',
    'setup.rounds': 'Rounds',
    'setup.roundsDesc': 'Select which rounds to play',
    'setup.youtubeViews': 'YouTube Views',
    'setup.youtubeDesc': 'Guess the view count ({count} videos)',
    'setup.sporcleRound': 'The Sporcle Round',
    'setup.sporcleDesc': 'Pick the most obscure answer',
    'setup.contestants': 'Contestants',
    'setup.ready': '{count} ready',
    'setup.placeholder': 'Enter contestant name...',
    'setup.add': 'Add',
    'setup.emptyState': 'Add contestants to begin',
    'setup.gameMode': 'Game Mode',
    'setup.dynamicMode': 'Dynamic Mode',
    'setup.dynamicDesc': 'Players choose categories during play',
    'setup.numberOfRounds': 'Number of Rounds',
    'setup.themesSelected': 'Up to {count} theme{s} selected',
    'setup.themePool': 'Theme Pool',
    'setup.selected': '{count} selected',
    'setup.categories': 'Categories',
    'setup.answers': '{count} answers',
    'setup.beginQuiz': 'Begin the Quiz',
    'setup.selectRound': 'Select at least one round',
    'setup.addContestant': 'Add at least one contestant',
    'setup.configureRounds': 'Configure rounds & theme pool',
    'setup.selectCategory': 'Select at least one category',
    'setup.configureSettings': 'Configure game settings',
    'setup.tip': 'Pick obscure answers for lower scores!',

    // QuizQuestion
    'quiz.possibleAnswers': '{count} possible answers',
    'quiz.responses': 'Responses:',
    'quiz.tip': 'Pick the most obscure answer you think is correct. Type to search.',
    'quiz.waiting': 'Waiting for {count} more answer{s}...',
    'quiz.finalRound': 'Final Round',
    'quiz.allMustAnswer': 'All Must Answer',
    'quiz.nextRound': 'Next Round',
    'quiz.cancel': 'Cancel',
    'quiz.saveReturn': 'Save & Return',

    // YouTubeQuestion
    'yt.loading': 'Loading video...',
    'yt.video': 'Video:',
    'yt.howManyViews': 'How many views?',
    'yt.guessDesc': 'Enter your best guess for the total view count.',
    'yt.guessPlaceholder': 'Enter your guess...',
    'yt.waiting': 'Waiting for {count} more guess{es}...',
    'yt.finalVideo': 'Final Video',
    'yt.allMustGuess': 'All Must Guess',
    'yt.nextVideo': 'Next Video',
    'yt.cancel': 'Cancel',
    'yt.saveReturn': 'Save & Return',

    // RoundResults
    'results.roundComplete': 'Round Complete',
    'results.playerPicks': 'Player Picks',
    'results.mostObscure': 'most obscure',
    'results.bestTitle': 'Most Obscure',
    'results.worstTitle': 'Most Common',
    'results.viewStandings': 'View Standings',
    'results.noAnswer': 'No answer',

    // YouTubeResults
    'ytResults.roundComplete': 'Round Complete',
    'ytResults.actualViews': 'Actual View Count',
    'ytResults.views': 'views',
    'ytResults.playerGuesses': 'Player Guesses',
    'ytResults.pts': 'pts',
    'ytResults.viewStandings': 'View Standings',

    // QuestionPicker
    'picker.title': 'Pick a Category',
    'picker.round': 'Round {current} of {total}',
    'picker.turn': "{name}'s turn",
    'picker.noThemes': 'No themes left',
    'picker.themesLeft': '{count} theme{s} left',
    'picker.play': 'Play: {name}',
    'picker.footer': 'The player with the highest score picks next.',

    // Leaderboard
    'board.title': 'Leaderboard',
    'board.combined': 'Combined Standings',
    'board.youtubeRound': 'YouTube Round',
    'board.finalStandings': 'Final Standings',
    'board.rank': 'Rank',
    'board.contestant': 'Contestant',
    'board.youtube': 'YouTube',
    'board.sporcle': 'Sporcle',
    'board.grandTotal': 'Grand Total',
    'board.total': 'Total',
    'board.edit': 'edit',
    'board.footerBoth': 'Lower scores win. YouTube points + Sporcle percentages combined.',
    'board.footerYoutube': 'Lower scores win. 0 = perfect guess.',
    'board.footerSporcle': 'Lower scores win. Invalid answers count as 100%.',

    // PlayerDropdown
    'dropdown.search': 'Search answers...',
    'dropdown.invalid': 'Invalid Answer',

    // App.jsx
    'app.quizComplete': 'Quiz Complete!',
    'app.newGame': 'New Game',
    'app.startRound2': 'Start Round 2: The Sporcle Round',
    'app.nextVideo': 'Next Video',
    'app.finalResults': 'Final Results',
    'app.nextQuestion': 'Next Question',

    // Categories
    'cat.sport': 'Sport',
    'cat.geography': 'Geography',
    'cat.general': 'General',
    'cat.nerd': 'Nerd',

    // Rank suffixes
    'rank.st': 'st',
    'rank.nd': 'nd',
    'rank.rd': 'rd',
    'rank.th': 'th',

    // Theme names
    'theme.african-countries': 'Countries of Africa',
    'theme.european-capitals': 'European Capitals',
    'theme.asian-countries': 'Countries of Asia',
    'theme.us-states': 'US States',
    'theme.pokemon-gen1': 'Pokémon (Gen 1)',
    'theme.champions-league-winners': 'Champions League Winners (since 1956)',
    'theme.periodic-table': 'Periodic Table of Elements',
    'theme.us-presidents': 'US Presidents',
    'theme.oscar-best-picture': 'Oscar Best Picture Winners',
    'theme.time-person-of-the-year': 'TIME Person of the Year',
    'theme.f1-champions': 'F1 World Champions',
    'theme.harry-potter-characters': 'Harry Potter Characters (Top 200)',
    'theme.summer-olympics-gold': 'Summer Olympics Gold Medal Countries',
    'theme.grammy-album-of-the-year': 'Grammy Album of the Year Winners',
    'theme.grammy-record-of-the-year': 'Grammy Record of the Year Winners',
    'theme.winter-olympics-gold-medal-countries': 'Winter Olympics Gold Medal Countries',
    'theme.monopoly-streets-dutch': 'Monopoly Streets (Dutch Edition)',
    'theme.winter-olympics-2026-sports': 'Sports at the 2026 Winter Olympics',
    'theme.summer-olympics-2024-sports': 'Sports at the 2024 Summer Olympics',
    'theme.pixar-movies': 'Pixar Movies',
    'theme.disney-animated-movies': 'Disney Animated Movies',
    'theme.james-bond-movies': 'James Bond Movies',
    'theme.greek-alphabet': 'Greek Alphabet',
    'theme.iba-official-cocktails': 'IBA Official Cocktails',
  },

  nl: {
    // Header
    'header.title': 'Trivia Showdown',
    'header.subtitle': 'Maak je klaar om te spelen!',
    'header.scores': 'Scores',
    'header.hide': 'Verberg',
    'header.newGame': 'Nieuw Spel',
    'header.newGameShort': 'Nieuw',
    'header.round1': 'Ronde 1: YouTube Views',
    'header.round2': 'Ronde 2: De Sporcle Ronde',
    'header.round2Named': 'Ronde 2: {name}',

    // Setup
    'setup.welcome': 'Welkom, Deelnemers!',
    'setup.subtitle': 'De ultieme trivia-uitdaging wacht',
    'setup.rounds': 'Rondes',
    'setup.roundsDesc': 'Selecteer welke rondes je wilt spelen',
    'setup.youtubeViews': 'YouTube Views',
    'setup.youtubeDesc': "Raad het aantal views ({count} video's)",
    'setup.sporcleRound': 'De Sporcle Ronde',
    'setup.sporcleDesc': 'Kies het meest obscure antwoord',
    'setup.contestants': 'Deelnemers',
    'setup.ready': '{count} klaar',
    'setup.placeholder': 'Voer naam deelnemer in...',
    'setup.add': 'Voeg toe',
    'setup.emptyState': 'Voeg deelnemers toe om te beginnen',
    'setup.gameMode': 'Spelmodus',
    'setup.dynamicMode': 'Dynamische Modus',
    'setup.dynamicDesc': 'Spelers kiezen categorieën tijdens het spel',
    'setup.numberOfRounds': 'Aantal Rondes',
    'setup.themesSelected': "Maximaal {count} thema'{s} geselecteerd",
    'setup.themePool': 'Thema Pool',
    'setup.selected': '{count} geselecteerd',
    'setup.categories': 'Categorieën',
    'setup.answers': '{count} antwoorden',
    'setup.beginQuiz': 'Start de Quiz',
    'setup.selectRound': 'Selecteer minstens één ronde',
    'setup.addContestant': 'Voeg minstens één deelnemer toe',
    'setup.configureRounds': 'Stel rondes & themapool in',
    'setup.selectCategory': 'Selecteer minstens één categorie',
    'setup.configureSettings': 'Stel spelinstellingen in',
    'setup.tip': 'Kies obscure antwoorden voor lagere scores!',

    // QuizQuestion
    'quiz.possibleAnswers': '{count} mogelijke antwoorden',
    'quiz.responses': 'Antwoorden:',
    'quiz.tip': 'Kies het meest obscure antwoord waarvan je denkt dat het klopt. Typ om te zoeken.',
    'quiz.waiting': 'Wachten op {count} antwoord{en} meer...',
    'quiz.finalRound': 'Laatste Ronde',
    'quiz.allMustAnswer': 'Iedereen moet antwoorden',
    'quiz.nextRound': 'Volgende Ronde',
    'quiz.cancel': 'Annuleer',
    'quiz.saveReturn': 'Opslaan & Terug',

    // YouTubeQuestion
    'yt.loading': 'Video laden...',
    'yt.video': 'Video:',
    'yt.howManyViews': 'Hoeveel views?',
    'yt.guessDesc': 'Voer je beste schatting in voor het totale aantal views.',
    'yt.guessPlaceholder': 'Voer je schatting in...',
    'yt.waiting': 'Wachten op {count} schatting{en} meer...',
    'yt.finalVideo': 'Laatste Video',
    'yt.allMustGuess': 'Iedereen moet raden',
    'yt.nextVideo': 'Volgende Video',
    'yt.cancel': 'Annuleer',
    'yt.saveReturn': 'Opslaan & Terug',

    // RoundResults
    'results.roundComplete': 'Ronde Voltooid',
    'results.playerPicks': 'Keuzes Spelers',
    'results.mostObscure': 'meest obscuur',
    'results.bestTitle': 'Meest Obscuur',
    'results.worstTitle': 'Meest Voorkomend',
    'results.viewStandings': 'Bekijk Stand',
    'results.noAnswer': 'Geen antwoord',

    // YouTubeResults
    'ytResults.roundComplete': 'Ronde Voltooid',
    'ytResults.actualViews': 'Werkelijk Aantal Views',
    'ytResults.views': 'views',
    'ytResults.playerGuesses': 'Schattingen Spelers',
    'ytResults.pts': 'ptn',
    'ytResults.viewStandings': 'Bekijk Stand',

    // QuestionPicker
    'picker.title': 'Kies een Categorie',
    'picker.round': 'Ronde {current} van {total}',
    'picker.turn': 'Beurt van {name}',
    'picker.noThemes': "Geen thema's meer",
    'picker.themesLeft': "{count} thema'{s} over",
    'picker.play': 'Speel: {name}',
    'picker.footer': 'De speler met de hoogste score kiest als volgende.',

    // Leaderboard
    'board.title': 'Klassement',
    'board.combined': 'Gecombineerde Stand',
    'board.youtubeRound': 'YouTube Ronde',
    'board.finalStandings': 'Eindstand',
    'board.rank': 'Rang',
    'board.contestant': 'Deelnemer',
    'board.youtube': 'YouTube',
    'board.sporcle': 'Sporcle',
    'board.grandTotal': 'Eindtotaal',
    'board.total': 'Totaal',
    'board.edit': 'bewerk',
    'board.footerBoth': 'Lagere scores winnen. YouTube-punten + Sporcle-percentages gecombineerd.',
    'board.footerYoutube': 'Lagere scores winnen. 0 = perfecte gok.',
    'board.footerSporcle': 'Lagere scores winnen. Ongeldige antwoorden tellen als 100%.',

    // PlayerDropdown
    'dropdown.search': 'Zoek antwoorden...',
    'dropdown.invalid': 'Ongeldig Antwoord',

    // App.jsx
    'app.quizComplete': 'Quiz Voltooid!',
    'app.newGame': 'Nieuw Spel',
    'app.startRound2': 'Start Ronde 2: De Sporcle Ronde',
    'app.nextVideo': 'Volgende Video',
    'app.finalResults': 'Eindresultaten',
    'app.nextQuestion': 'Volgende Vraag',

    // Categories
    'cat.sport': 'Sport',
    'cat.geography': 'Aardrijkskunde',
    'cat.general': 'Algemeen',
    'cat.nerd': 'Nerd',

    // Rank suffixes (Dutch uses 'e' for all ordinals except 1ste)
    'rank.st': 'ste',
    'rank.nd': 'e',
    'rank.rd': 'e',
    'rank.th': 'e',

    // Theme names
    'theme.african-countries': 'Landen van Afrika',
    'theme.european-capitals': 'Europese Hoofdsteden',
    'theme.asian-countries': 'Landen van Azië',
    'theme.us-states': 'Amerikaanse Staten',
    'theme.pokemon-gen1': 'Pokémon (Gen 1)',
    'theme.champions-league-winners': 'Champions League Winnaars (sinds 1956)',
    'theme.periodic-table': 'Periodiek Systeem der Elementen',
    'theme.us-presidents': 'Amerikaanse Presidenten',
    'theme.oscar-best-picture': 'Oscar Beste Film Winnaars',
    'theme.time-person-of-the-year': 'TIME Persoon van het Jaar',
    'theme.f1-champions': 'F1 Wereldkampioenen',
    'theme.harry-potter-characters': 'Harry Potter Personages (Top 200)',
    'theme.summer-olympics-gold': 'Zomerspelen Gouden Medaille Landen',
    'theme.grammy-album-of-the-year': 'Grammy Album van het Jaar Winnaars',
    'theme.grammy-record-of-the-year': 'Grammy Plaat van het Jaar Winnaars',
    'theme.winter-olympics-gold-medal-countries': 'Winterspelen Gouden Medaille Landen',
    'theme.monopoly-streets-dutch': 'Monopoly Straten (Nederlandse Editie)',
    'theme.winter-olympics-2026-sports': 'Sporten op de Winterspelen 2026',
    'theme.summer-olympics-2024-sports': 'Sporten op de Zomerspelen 2024',
    'theme.pixar-movies': 'Pixar Films',
    'theme.disney-animated-movies': 'Disney Animatiefilms',
    'theme.james-bond-movies': 'James Bond Films',
    'theme.greek-alphabet': 'Grieks Alfabet',
    'theme.iba-official-cocktails': 'IBA Officiële Cocktails',
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const t = (key, params = {}) => {
    let str = translations[language]?.[key] || translations.en[key] || key
    // Replace {param} placeholders
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
    }
    return str
  }

  // Translate a theme name by its ID
  const themeName = (themeId) => {
    const key = `theme.${themeId}`
    return translations[language]?.[key] || translations.en[key] || themeId
  }

  // Translate a category name by its ID
  const categoryName = (catId) => {
    const key = `cat.${catId}`
    return translations[language]?.[key] || translations.en[key] || catId
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, themeName, categoryName }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
