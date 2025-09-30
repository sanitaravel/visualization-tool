# Trivia Data Visualizer - AI Coding Guidelines

## Project Overview
This is a React-based visualization tool for Open Trivia Database API data. The app displays trivia question distributions by category and difficulty, with filtering capabilities.

## Architecture
- **Frontend**: React functional components with hooks
- **Data Source**: Open Trivia DB API (https://opentdb.com/api.php)
- **Charts**: Recharts library for data visualization
- **Build Tool**: Create React App or Vite (prefer Vite for faster development)
- **Deployment**: GitHub Pages as static site

## Key Components Structure
```
src/
├── components/
│   ├── CategoryList.jsx      # Displays available categories
│   ├── CategoryChart.jsx     # Bar chart for category distribution
│   ├── DifficultyChart.jsx   # Pie chart for difficulty distribution
│   └── FilterControls.jsx    # Category filter dropdown
├── hooks/
│   └── useTriviaData.js      # Custom hook for API fetching and data processing
├── utils/
│   └── dataProcessor.js      # Functions to group/filter questions
└── App.jsx
```

## Data Flow
1. Fetch categories from `/api_category.php`
2. Fetch questions from `/api.php?amount=50` (minimum 50 questions)
3. Process data: group by category and difficulty
4. Render charts with filtered data based on user selection

## Development Patterns
- Use functional components with hooks (useState, useEffect)
- Handle API loading states and errors gracefully
- Process raw API data into chart-friendly format:
  ```javascript
  // Example: Group questions by category
  const categoryCounts = questions.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {});
  ```
- Use Recharts components: `<BarChart>`, `<PieChart>`, `<ResponsiveContainer>`

## Common Workflows
- **Start development**: `npm start` or `npm run dev`
- **Build for production**: `npm run build`
- **Deploy to GitHub Pages**: Use `gh-pages` package or GitHub Actions
- **API testing**: Use browser dev tools or Postman for Open Trivia DB endpoints

## Code Style
- Prefer arrow functions for components and hooks
- Use descriptive variable names (e.g., `selectedCategory` not `cat`)
- Keep components focused on single responsibilities
- Handle edge cases: empty data, API failures, no questions in category

## Dependencies
- `react`: Core framework
- `recharts`: Chart library
- `axios` or native `fetch`: API calls (prefer fetch for simplicity)

## Deployment Notes
- Build outputs to `build/` directory
- Configure GitHub Pages to serve from `build/` folder
- Ensure all assets are bundled (no external CDN dependencies)