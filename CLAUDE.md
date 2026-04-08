# Sporcle Quiz

## Architecture
- React + Vite + Tailwind CSS
- **Three-round game**: Round 1 (YouTube Views) → Round 2 (Sample Hitster) → Round 3 (The Sporcle Round)
- Components: Header, Setup (SetupRounds, SetupPlayers, SetupSporcleConfig), QuizQuestion, QuestionPicker, PlayerDropdown, RoundResults, Leaderboard, YouTubeQuestion, YouTubeResults, SampleHitsterQuestion, SampleHitsterResults
- **State management**: `useReducer` in App.jsx with reducer logic in `src/gameReducer.js`
  - All 17 state fields live in a single state object, transitions are explicit action types
  - Setup component receives `setField('fieldName')` wrappers that dispatch `SET_FIELD` actions
- App.jsx is a state machine routing phases: setup → youtube-playing → youtube-results → youtube-standings → sample-hitster-playing → sample-hitster-results → sample-hitster-standings → picking/playing → round-results → standings → finished
- App.jsx also renders its own JSX for standings, youtube-standings, and finished states - don't forget these during restyling
- Uses react-select for dropdowns, react-switch for toggles

## Design System: Paper & Ink Editorial
- Fonts: Fraunces (serif display) + Outfit (sans body)
- Colors: paper #F7F3ED, ink #1A1A1A, red #C23B22, gray #6B6560, gold #B8924A, rule #D4CFC7
- Square corners (2px radius), 1px borders, no gradients
- `.editorial-stamp` = circular border badge with serif text
- `.btn-gold` = solid red fill, `.btn-teal` = outlined black border

## Shared Utilities (src/utils/)
- **colors.js**: `interpolateColor(color1, color2, factor)`, `getPercentageColor(percentage, minPercent, maxPercent)`, `badgeStyle(colors)`
  - `getPercentageColor` returns `{ bg, text }` for inline styles — always pass actual min/max from theme.options, not fixed thresholds
  - `badgeStyle(colors)` returns the shared inline style object for score/percentage badges
- **youtube.js**: `extractVideoId`, `formatViews`, `abbreviateViews`, `calculateYouTubeScore`, `getYouTubeScoreColor`, `parseViewsInput`
  - Score formula: `Math.max(guess/actual, actual/guess)` — symmetric ratio, 1.0x = perfect
- **themes.js**: `getThemeIcon(themeName)`, `getThemeById(themeId)` — theme lookup utilities
- **sampleHitster.js**: `calculateSampleHitsterScore(guess, actualYear)`, `getSampleHitsterScoreColor(score)`
  - Score = absolute year difference, green (0-2), gold (3-5), red (6+)
- **scoring.js**: `calculateSporcleTotal`, `calculateYouTubeTotal`, `calculateSampleHitsterTotal`, `calculateGrandTotal`, `getHighestScorer`
  - Shared between App.jsx (via gameReducer) and Leaderboard.jsx — single source of truth for scoring

## YouTube Round (Round 1)
- Data: `src/data/youtube-videos.js` — array of `{ url, title, views }` objects (hardcoded)
- Video titles come from the data file (no runtime metadata fetching)
- Scores added directly to Sporcle percentages for grand total (lower wins)
- State: `youtubeGuesses[player][videoIndex] = number`
- Leaderboard accepts optional `youtubeGuesses`, `youtubeVideos` props for combined display

## Sample Hitster Round (Round 2)
- Data: `src/data/sample-hitster-songs.js` — array of `{ songTitle, songUrl, sampleTitle, sampleUrl, sampleYear }` objects
- Players guess the year the original sample was released
- Scoring: absolute difference in years (|guess - actual|), lower is better
- State: `sampleHitsterGuesses[player][songIndex] = year`, `sampleHitsterIndex`
- Question page shows YouTube embed of the song
- Results page shows sample info + YouTube embed of the original sample
- Leaderboard accepts optional `sampleHitsterGuesses`, `sampleHitsterSongs` props

## Sporcle Round (Round 3) State Management
- gameReducer.js is source of truth for committed answers: `answers[player][questionIndex] = { option, percentage }`
- QuizQuestion buffers answers locally in `pendingAnswers` until submit via `BATCH_ANSWERS` dispatch
- `isLastQuestion` controls button labels and routing

## Key Gotchas
- PlayerDropdown has module-scoped `customStyles` for react-select - update colors there too when restyling
- Don't use `menuPortalTarget={document.body}` with react-select - breaks mobile focus/Enter key. Use `menuPlacement="auto"` instead
- Flex layouts on 375px mobile can overflow - use `min-w-0` on flex children and `overflow-hidden` on parent

## Git Workflow
- **ALWAYS create a feature branch** for changes - never commit directly to main
- All changes must go through a feature branch → PR → main
- Use descriptive branch names (e.g., `feature/`, `fix/`, `design/`)
- Use single line commit messages, that only explain the change. Don't mention it's co-authored by Claude.
- Don't use compound commands with &&, as they will always require approval from the user.

## Build & Test
- `npx vite build` to validate changes
- Test on 375px viewport minimum for mobile
- "Scores" overlay during gameplay should not show current round answers (buffering prevents this)
