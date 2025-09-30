import { useState, useEffect, useCallback } from 'react';
import { fetchCategories, fetchQuestions, processQuestions, TriviaApiError } from '../utils/api';
import { processTriviaData, filterQuestionsByCategory, getUniqueCategories } from '../utils/dataProcessor';
import type { TriviaQuestion, TriviaCategory } from '../utils/api';
import type { ProcessedData } from '../utils/dataProcessor';

export interface TriviaDataState {
  categories: TriviaCategory[];
  questions: TriviaQuestion[];
  processedData: ProcessedData | null;
  availableCategories: string[];
  selectedCategory: string;
  loading: boolean;
  error: string | null;
}

/**
 * Custom React hook for managing trivia data state and API interactions.
 * Handles loading categories and questions, processing data for visualization,
 * and managing category filtering.
 * @returns Object containing state and methods for trivia data management
 */
export const useTriviaData = () => {
  const [state, setState] = useState<TriviaDataState>({
    categories: [],
    questions: [],
    processedData: null,
    availableCategories: ['All'],
    selectedCategory: 'All',
    loading: false,
    error: null,
  });

  // Load initial data
  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch categories and questions in parallel
      const [categoriesResponse, questionsResponse] = await Promise.allSettled([
        fetchCategories(),
        fetchQuestions(50) // Minimum 50 questions as per requirements
      ]);

      // Handle categories
      let categories: TriviaCategory[] = [];
      if (categoriesResponse.status === 'fulfilled') {
        categories = categoriesResponse.value;
      } else {
        console.warn('Failed to load categories:', categoriesResponse.reason);
      }

      // Handle questions
      let questions: TriviaQuestion[] = [];
      if (questionsResponse.status === 'fulfilled') {
        questions = processQuestions(questionsResponse.value);
      } else {
        throw questionsResponse.reason;
      }

      // Process data for visualization
      const processedData = processTriviaData(questions);
      const availableCategories = getUniqueCategories(questions);

      setState(prev => ({
        ...prev,
        categories,
        questions,
        processedData,
        availableCategories,
        loading: false,
      }));

    } catch (error) {
      console.error('Error loading trivia data:', error);

      let errorMessage = 'Failed to load trivia data';
      if (error instanceof TriviaApiError) {
        switch (error.code) {
          case 1:
            errorMessage = 'No questions available. Please try again later.';
            break;
          case 4:
            errorMessage = 'All questions have been used. Please refresh to get new questions.';
            break;
          case 5:
            errorMessage = 'Too many requests. Please wait a moment before trying again.';
            break;
          default:
            errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  /**
   * Updates the selected category and recalculates processed data for the filtered questions.
   * @param category - The category name to filter by
   */
  const setSelectedCategory = useCallback((category: string) => {
    setState(prev => {
      const filteredQuestions = filterQuestionsByCategory(prev.questions, category);
      const processedData = processTriviaData(filteredQuestions);

      return {
        ...prev,
        selectedCategory: category,
        processedData,
      };
    });
  }, []);

  /**
   * Refreshes the trivia data by fetching new questions from the API.
   */
  const refreshData = useCallback(async () => {
    await loadData();
    setState(prev => ({ ...prev, selectedCategory: 'All' }));
  }, [loadData]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ...state,
    setSelectedCategory,
    refreshData,
  };
};