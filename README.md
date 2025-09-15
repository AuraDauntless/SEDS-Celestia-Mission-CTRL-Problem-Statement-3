# Galactic Star Catalogue (Frontend)

An interactive React (Vite + TypeScript) app to explore stars: grid, HR diagram, and a 3D galaxy map. No backend; data is loaded from `public/data/stars.json`. Favorites and annotations persist in localStorage.

## Galactic Star Catalogue Challenge
### Backstory
It’s 2040. Humanity’s DeepSkyNet scans the galaxy every second, identifying millions of stars—from tiny red dwarfs to massive blue giants and rare neutron stars. Mission CTRL needs a public-facing, interactive catalogue to help researchers, students, and enthusiasts explore stellar data quickly and beautifully.

### Your Mission
Build an interactive web-based star catalogue that:
- Displays star information in an engaging, readable format
- Enables fast searching, filtering, and visual analysis
- Provides immersive visualizations (HR diagram, 3D galaxy map)

### Evaluation Criteria
- **Design & UI/UX**: Futuristic, clean, accessible, and easy to navigate
- **Data Representation**: Meaningful, accurate display of stellar properties
- **Interactivity**: Smooth filtering, searching, selection, and visualization
- **Technical Quality**: Well-structured, maintainable code with modern tooling
- **Creativity & Wow Factor**: 3D visuals, animations, storytelling polish

## Tech Stack
- React 18 + Vite + TypeScript
- Tailwind CSS (dark, futuristic theme)
- Framer Motion (animations)
- React Three Fiber + drei (3D galaxy map)
- Recharts (HR diagram)
- React Router (navigation)

## Getting Started
1. Install Node 18+.
2. Install deps:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
4. Open the URL printed in the terminal (typically http://localhost:5173).

## Project Structure
```
/public
  index.html
  /data/stars.json
/src
  main.tsx, App.tsx
  /components (UI views & widgets)
  /hooks/useStars.tsx (data, filters, selection, favorites, annotations)
  /context/SelectedStarContext.tsx
  /utils (colors, seeded RNG, temp → color)
  /types.ts
```

## Comprehensive Feature List
### Navigation & Layout
- Collapsible left sidebar with routes: Explore, HR Diagram, 3D Map, Compare, Favorites
- Header with global search, sort dropdown, and quick type filters
- Dark, futuristic theme; responsive layout and keyboard-accessible controls

### Data & Persistence
- Single data source at `public/data/stars.json`
- Local persistence in `localStorage`:
  - Favorites: `gsc_favorites_v1` (array of star IDs)
  - Annotations: `gsc_annotations_v1` ({ [starId]: [{ id, text, createdAt }] })
  - 3D focus intent for Jump-to-3D: `gsc_focus_star_pos`

### Explore (Grid)
- Responsive grid of star cards (up to 50 per page)
- Each card shows: name, type badge, distance, temperature, luminosity, type color
- Hover lift with subtle glow; favorite toggle on card
- Pagination controls; keyboard navigable
- Clicking a card selects the star and opens the detail modal

### Star Detail Modal
- Shows name, type, constellation, distance, mass, radius, temperature, luminosity
- Spectral color representation and description
- Buttons: Favorite, Add to Compare, Jump to 3D Map
- Annotations panel to add/edit/delete notes (persisted locally)
- Framer Motion animated open/close; Esc and backdrop close
- Jump to 3D navigates to `/map`, closes the modal, and smoothly centers the camera on the star

### Search & Advanced Filters
- Debounced text search by name (header)
- Filters:
  - Type multi-select chips
  - Distance (ly) range
  - Temperature (K) range
  - Luminosity (L☉) range
- Sorting: by name, distance, temperature, luminosity
- All views (Grid, HR, 3D) reflect the current filtered/star set

### HR Diagram
- Scatter plot: X = Temperature (K) reversed; Y = log10(Luminosity)
- Points colored by star type; size approximates radius
- Tooltip on hover shows name, type, temperature, log10(L)
- Click-to-select a star (opens the detail modal)
- Legend showing color mapping by type

### 3D Galaxy Map
- React Three Fiber point cloud with deterministic positions using seeded RNG
- Circular sprite rendering for stars; additive “halo + core” glow layers
- Glow intensity scales with luminosity buckets (dim → very bright)
- Hover tooltip shows the star’s name near the cursor
- Click selects and opens the modal; OrbitControls for navigation
- Jump-to-3D recenters the camera smoothly to the selected star

### Compare Mode
- Add up to 3 stars to compare from cards or modal
- Side-by-side metrics: type, distance, mass, radius, temperature, luminosity
- Visual radius comparison with scaled circles
- Export the comparison table as CSV; share via `?cmp=` in URL

### Favorites & Annotations
- Favorite stars from cards or modal; Favorites view lists them
- Annotations per star with inline editing and deletion; optimistic UI updates

### Accessibility & UX
- Semantic elements, ARIA labels, focus styles, and keyboard navigation support
- Subtle micro-interactions and motion for delightful feel

## Screens/Routes
- `/explore` — Star grid
- `/hr` — HR Diagram
- `/map` — 3D Galaxy Map
- `/compare` — Compare Mode
- `/favorites` — Favorites

## Acceptance Checklist
- [ ] `npm install` completes without fatal errors
- [ ] `npm run dev` serves the app locally
- [ ] Explore view displays star cards from `public/data/stars.json`
- [ ] Searching by name filters results
- [ ] Advanced filters (type/distance/temperature/luminosity) filter correctly
- [ ] Clicking a card opens detail modal with correct data
- [ ] Jump to 3D closes modal and recenters camera
- [ ] Annotations persist after refresh (localStorage)
- [ ] Favorite toggling persists after refresh
- [ ] HR Diagram renders, hover shows star name, and clicking opens modal
- [ ] 3D Map renders, stars glow by luminosity, hover shows name, and clicking opens modal
- [ ] Compare mode displays up to 3 stars with visual size comparison and CSV export
- [ ] Sidebar navigation works and collapses responsively
- [ ] All interactive elements are reachable with keyboard

## Development Tips
- Add more stars to `public/data/stars.json` to stress-test performance
- Tweak color mapping in `src/utils/colorMapping.ts`
- Temperature color approximation lives in `src/utils/tempToColor.ts`
