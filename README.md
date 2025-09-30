# Trivia Data Visualizer

A React-based web application that visualizes trivia question distributions from the Open Trivia Database API. This tool provides interactive charts showing question distributions by category and difficulty level, with filtering capabilities.

## Features

- 📊 **Interactive Charts**: Bar chart for category distribution and pie chart for difficulty levels
- 🔍 **Category Filtering**: Filter data to view statistics for specific categories
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- 🔄 **Real-time Data**: Fetches fresh trivia questions from Open Trivia DB API
- 🎯 **Minimum 50 Questions**: Ensures statistical significance with at least 50 questions per session
- ⚡ **Fast Loading**: Built with Vite for optimal development and build performance

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Charts**: Recharts library
- **Styling**: CSS Modules with responsive design
- **Testing**: Vitest with React Testing Library
- **Linting**: ESLint with TypeScript support

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd task_1
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## Usage

1. **View All Data**: The app loads 50+ trivia questions and displays:
   - Category distribution bar chart
   - Difficulty level pie chart
   - Summary statistics

2. **Filter by Category**: Use the dropdown to select a specific category and see filtered results

3. **Refresh Data**: Click the "Refresh Data" button to load new questions

## Project Structure

```tree
src/
├── components/
│   ├── CategoryChart.tsx      # Bar chart for category distribution
│   ├── CategoryList.tsx       # List of available categories
│   ├── DifficultyChart.tsx    # Pie chart for difficulty distribution
│   └── FilterControls.tsx     # Category filter dropdown
├── hooks/
│   └── useTriviaData.ts       # Custom hook for API data management
├── utils/
│   ├── api.ts                 # API functions and types
│   └── dataProcessor.ts       # Data processing utilities
├── test/
│   ├── setup.ts              # Test configuration
│   ├── api.test.ts           # API function tests
│   └── dataProcessor.test.ts # Data processing tests
├── App.tsx                   # Main application component
├── main.tsx                  # Application entry point
└── *.css                     # Styling files
```

## API Integration

This app uses the [Open Trivia Database API](https://opentdb.com/api.php):

- **Categories**: Fetched from `/api_category.php`
- **Questions**: Retrieved from `/api.php?amount=50` (minimum 50 questions)
- **Data Processing**: Questions are grouped by category and difficulty for visualization

### API Response Codes Handled

- Code 0: Success
- Code 1: No Results
- Code 4: Token Empty (all questions used)
- Code 5: Rate Limit (5-second cooldown)

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload

  ```bash
  npm run dev
  ```

- `npm run build` - Build for production

  ```bash
  npm run build
  ```

- `npm run preview` - Preview production build locally

  ```bash
  npm run preview
  ```

- `npm run lint` - Run ESLint for code quality

  ```bash
  npm run lint
  ```

- `npm run test` - Run tests with Vitest

  ```bash
  npm run test
  ```

- `npm run test:ui` - Run tests with Vitest UI

  ```bash
  npm run test:ui
  ```

### Code Style

- Uses functional React components with hooks
- TypeScript for type safety
- ESLint configuration for consistent code quality
- Responsive CSS with mobile-first approach

## Testing

The project includes comprehensive tests:

- **Unit Tests**: API functions and data processing utilities
- **Component Tests**: React component behavior
- **Integration Tests**: End-to-end data flow

Run tests:

```bash
npm run test
```

Run tests with UI:

```bash
npm run test:ui
```

## Deployment

### GitHub Pages

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy using GitHub Actions** (recommended)
   - Push to main branch
   - Configure GitHub Pages in repository settings
   - Use the `build/` folder as source

3. **Manual deployment**

   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

### Other Platforms

The built files in `dist/` can be deployed to:

- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Open Trivia Database](https://opentdb.com) for providing the trivia questions API
- [Recharts](https://recharts.org) for the charting library
- [Vite](https://vitejs.dev) for the build tool
- [React](https://reactjs.org) for the UI framework
