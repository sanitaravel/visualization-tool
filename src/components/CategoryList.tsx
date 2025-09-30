import React from 'react';
import type { TriviaCategory } from '../utils/api';

/**
 * Props for the CategoryList component
 */
interface CategoryListProps {
  /** Array of available trivia categories */
  categories: TriviaCategory[];
  /** Whether data is currently loading */
  loading: boolean;
}

/**
 * Component that displays a list of available trivia categories
 */
const CategoryList: React.FC<CategoryListProps> = ({ categories, loading }) => {
  if (loading) {
    return (
      <div className="category-list">
        <h3>Available Categories</h3>
        <div className="loading">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="category-list">
      <h3>Available Categories ({categories.length})</h3>
      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;