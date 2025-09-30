import React from 'react';

/**
 * Props for the FilterControls component
 */
interface FilterControlsProps {
  /** Array of available category names for filtering */
  availableCategories: string[];
  /** Currently selected category */
  selectedCategory: string;
  /** Callback when category selection changes */
  onCategoryChange: (category: string) => void;
}

/**
 * Component that provides filtering controls for trivia data
 */
const FilterControls: React.FC<FilterControlsProps> = ({
  availableCategories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="filter-controls">
      <label htmlFor="category-filter">
        Filter by Category:
      </label>
      <select
        id="category-filter"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="category-select"
      >
        {availableCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterControls;