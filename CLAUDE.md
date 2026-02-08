# Sporcle Quiz

## Architecture
- React + Vite + Tailwind CSS
- Components: Header, Setup, QuizQuestion, QuestionPicker, PlayerDropdown, RoundResults, Leaderboard
- App.jsx is a state machine routing phases: setup -> picking/playing -> round-results -> standings -> finished
- App.jsx also renders its own JSX for standings and finished states - don't forget these during restyling
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

## State Management
- App.jsx is source of truth for committed answers: `answers[player][questionIndex] = { option, percentage }`
- QuizQuestion buffers answers locally in `pendingAnswers` until submit via `handleBatchAnswers`
- `isLastQuestion` controls button labels and routing

## Key Gotchas
- **getThemeIcon()** is duplicated in Setup, QuizQuestion, RoundResults, Leaderboard - should be extracted to utils
- PlayerDropdown has inline `customStyles` for react-select - update colors there too when restyling
- Don't use `menuPortalTarget={document.body}` with react-select - breaks mobile focus/Enter key. Use `menuPlacement="auto"` instead
- Flex layouts on 375px mobile can overflow - use `min-w-0` on flex children and `overflow-hidden` on parent

## Build & Test
- `npx vite build` to validate changes
- Test on 375px viewport minimum for mobile
- "Scores" overlay during gameplay should not show current round answers (buffering prevents this)
