# Sporcle Quiz

## Architecture
- React + Vite + Tailwind CSS
- **Two-round game**: Round 1 (YouTube Views) → Round 2 (The Sporcle Round)
- Components: Header, Setup, QuizQuestion, QuestionPicker, PlayerDropdown, RoundResults, Leaderboard, YouTubeQuestion, YouTubeResults
- App.jsx is a state machine routing phases: setup → youtube-playing → youtube-results → youtube-standings → picking/playing → round-results → standings → finished
- App.jsx also renders its own JSX for standings, youtube-standings, and finished states - don't forget these during restyling
- Uses react-select for dropdowns, react-switch for toggles

## Design System: Paper & Ink Editorial
- Fonts: Fraunces (serif display) + Outfit (sans body)
- Colors: paper #F7F3ED, ink #1A1A1A, red #C23B22, gray #6B6560, gold #B8924A, rule #D4CFC7
- Square corners (2px radius), 1px borders, no gradients
- `.editorial-stamp` = circular border badge with serif text
- `.btn-gold` = solid red fill, `.btn-teal` = outlined black border

## Shared Utilities (src/utils/)
- **colors.js**: `interpolateColor(color1, color2, factor)` and `getPercentageColor(percentage, minPercent, maxPercent)`
  - Returns `{ bg, text }` for inline styles
  - Always pass actual min/max from theme.options, not fixed thresholds
- **youtube.js**: `extractVideoId`, `formatViews`, `abbreviateViews`, `calculateYouTubeScore`, `fetchVideoMetadata`, `getYouTubeScoreColor`, `parseViewsInput`
  - Score formula: `Math.max(guess/actual, actual/guess)` — symmetric ratio, 1.0x = perfect
  - Metadata fetched from `noembed.com/embed?url=...` (CORS-friendly oEmbed proxy)

## YouTube Round (Round 1)
- Data: `src/data/youtube-videos.js` — array of `{ url, views }` objects (hardcoded)
- Video metadata (title, channel) fetched at runtime via oEmbed
- Scores added directly to Sporcle percentages for grand total (lower wins)
- State: `youtubeGuesses[player][videoIndex] = number`, `videoMetadata[videoIndex] = { title, author_name }`
- Leaderboard accepts optional `youtubeGuesses`, `youtubeVideos`, `videoMetadata` props for combined display

## Sporcle Round (Round 2) State Management
- App.jsx is source of truth for committed answers: `answers[player][questionIndex] = { option, percentage }`
- QuizQuestion buffers answers locally in `pendingAnswers` until submit via `handleBatchAnswers`
- `isLastQuestion` controls button labels and routing

## Key Gotchas
- **getThemeIcon()** is duplicated in Setup, QuizQuestion, RoundResults, Leaderboard - should be extracted to utils
- PlayerDropdown has inline `customStyles` for react-select - update colors there too when restyling
- Don't use `menuPortalTarget={document.body}` with react-select - breaks mobile focus/Enter key. Use `menuPlacement="auto"` instead
- Flex layouts on 375px mobile can overflow - use `min-w-0` on flex children and `overflow-hidden` on parent

## Git Workflow
- **ALWAYS create a feature branch** for changes - never commit directly to main
- All changes must go through a feature branch → PR → main
- Use descriptive branch names (e.g., `feature/`, `fix/`, `design/`)

## Build & Test
- `npx vite build` to validate changes
- Test on 375px viewport minimum for mobile
- "Scores" overlay during gameplay should not show current round answers (buffering prevents this)
