import type { TriviaQuestion } from './api';

export interface CategoryData {
  name: string;
  count: number;
  id: number;
  [key: string]: any; // Allow additional properties for Recharts compatibility
}

export interface DifficultyData {
  name: string;
  count: number;
  [key: string]: any; // Allow additional properties for Recharts compatibility
}

export interface ProcessedData {
  categories: CategoryData[];
  difficulties: DifficultyData[];
  totalQuestions: number;
}

/**
 * Groups trivia questions by their category and counts occurrences.
 * @param questions - Array of trivia questions to group
 * @returns Array of category data with names and counts
 */
export const groupByCategory = (questions: TriviaQuestion[]): CategoryData[] => {
  const categoryMap = new Map<string, { count: number; id?: number }>();

  questions.forEach(question => {
    const current = categoryMap.get(question.category) || { count: 0 };
    categoryMap.set(question.category, {
      count: current.count + 1,
      id: current.id // We'll set this later if needed
    });
  });

  return Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    count: data.count,
    id: data.id || 0
  }));
};

/**
 * Groups trivia questions by their difficulty level and counts occurrences.
 * @param questions - Array of trivia questions to group
 * @returns Array of difficulty data with names and counts
 */
export const groupByDifficulty = (questions: TriviaQuestion[]): DifficultyData[] => {
  const difficultyMap = new Map<string, number>();

  questions.forEach(question => {
    const current = difficultyMap.get(question.difficulty) || 0;
    difficultyMap.set(question.difficulty, current + 1);
  });

  return Array.from(difficultyMap.entries()).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
    count
  }));
};

/**
 * Filters trivia questions by category name.
 * Returns all questions if category is "All" or empty.
 * @param questions - Array of trivia questions to filter
 * @param categoryName - Name of the category to filter by
 * @returns Filtered array of questions
 */
export const filterQuestionsByCategory = (
  questions: TriviaQuestion[],
  categoryName: string
): TriviaQuestion[] => {
  if (!categoryName || categoryName === 'All') {
    return questions;
  }
  return questions.filter(question => question.category === categoryName);
};

/**
 * Extracts unique category names from questions and returns them sorted with "All" first.
 * @param questions - Array of trivia questions
 * @returns Array of unique category names with "All" as the first option
 */
export const getUniqueCategories = (questions: TriviaQuestion[]): string[] => {
  const categories = new Set(questions.map(q => q.category));
  return ['All', ...Array.from(categories).sort()];
};

/**
 * Processes raw trivia questions into structured data for visualization.
 * Groups questions by category and difficulty, and calculates totals.
 * @param questions - Array of trivia questions to process
 * @returns Processed data containing categories, difficulties, and total count
 */
export const processTriviaData = (questions: TriviaQuestion[]): ProcessedData => {
  const categories = groupByCategory(questions);
  const difficulties = sortDifficulties(groupByDifficulty(questions));

  return {
    categories,
    difficulties,
    totalQuestions: questions.length
  };
};

// Sort categories by count (descending)
export const sortCategoriesByCount = (categories: CategoryData[]): CategoryData[] => {
  return [...categories].sort((a, b) => b.count - a.count);
};

// Sort difficulties in order: Easy, Medium, Hard
export const sortDifficulties = (difficulties: DifficultyData[]): DifficultyData[] => {
  const order = ['Easy', 'Medium', 'Hard'];
  return difficulties.sort((a, b) => {
    const aIndex = order.indexOf(a.name);
    const bIndex = order.indexOf(b.name);
    return aIndex - bIndex;
  });
};