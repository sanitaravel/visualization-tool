import CategoryList from './components/CategoryList';
import CategoryChart from './components/CategoryChart';
import DifficultyChart from './components/DifficultyChart';
import FilterControls from './components/FilterControls';
import { useTriviaData } from './hooks/useTriviaData';
import './App.css';

/**
 * Main application component for the Trivia Data Visualizer
 */
function App() {
  const {
    categories,
    processedData,
    availableCategories,
    selectedCategory,
    loading,
    error,
    setSelectedCategory,
    refreshData,
  } = useTriviaData();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Trivia Data Visualizer</h1>
        <p>Explore question distributions from the Open Trivia Database</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={refreshData} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        <div className="controls-section">
          <FilterControls
            availableCategories={availableCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <button onClick={refreshData} className="refresh-button" disabled={loading}>
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>

        <div className="stats-section">
          {processedData && (
            <div className="stats-summary">
              <h3>Data Summary for {selectedCategory === 'All' ? 'All' : selectedCategory}</h3>
              <p>Total Questions: {processedData.totalQuestions}</p>
              {selectedCategory === 'All' && (
                <p>Categories: {processedData.categories.length}</p>
              )}
            </div>
          )}
        </div>

        <div className="charts-section">
          <div className="chart-row">
            <CategoryChart
              data={processedData?.categories || []}
              loading={loading}
            />
            <DifficultyChart
              data={processedData?.difficulties || []}
              loading={loading}
            />
          </div>
        </div>

        <div className="categories-section">
          <CategoryList
            categories={categories}
            loading={loading}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>Data sourced from <a href="https://opentdb.com" target="_blank" rel="noopener noreferrer">Open Trivia Database</a></p>
      </footer>
    </div>
  );
}

export default App;
