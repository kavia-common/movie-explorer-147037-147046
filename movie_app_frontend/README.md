# Movie Explorer - Frontend

A modern React web app to browse, search, and view details about movies.

- Ocean Professional theme with blue (#2563EB) and amber (#F59E0B) accents
- Clean, minimalist UI with rounded corners, soft gradients, and smooth transitions
- Search with URL query param syncing
- Grid of movie cards and a modal detail view
- Router-based structure (React Router v6)

## Scripts

- npm start – Start dev server at http://localhost:3000
- npm run build – Production build
- npm test – Run tests

## Structure

- src/App.js – App entry (routing, pages, components)
- src/App.css – Theme and component styles
- src/index.js – React bootstrap
- src/index.css – Resets/base styles

## Notes

- The app uses a static movie dataset for demo purposes. Replace useMovies() with your API integration later.
- Theme supports a light/dark toggle (stored in state).

## Accessibility

- Semantic roles for search, cards, and modal dialog
- Keyboard support for opening cards (Enter) and closing modal (Esc)
