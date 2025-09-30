import { describe, it, expect } from 'vitest'
import {
  groupByCategory,
  groupByDifficulty,
  filterQuestionsByCategory,
  getUniqueCategories,
  processTriviaData,
  sortCategoriesByCount,
  sortDifficulties
} from '../utils/dataProcessor'
import type { TriviaQuestion } from '../utils/api'

describe('Data Processor Utils', () => {
  const mockQuestions: TriviaQuestion[] = [
    {
      category: 'Science',
      type: 'multiple',
      difficulty: 'easy',
      question: 'What is 2+2?',
      correct_answer: '4',
      incorrect_answers: ['3', '5', '6']
    },
    {
      category: 'Science',
      type: 'boolean',
      difficulty: 'medium',
      question: 'Is Earth round?',
      correct_answer: 'True',
      incorrect_answers: ['False']
    },
    {
      category: 'History',
      type: 'multiple',
      difficulty: 'hard',
      question: 'When was Rome founded?',
      correct_answer: '753 BC',
      incorrect_answers: ['1000 BC', '500 BC', '100 BC']
    },
    {
      category: 'History',
      type: 'multiple',
      difficulty: 'easy',
      question: 'Who was the first president?',
      correct_answer: 'George Washington',
      incorrect_answers: ['Thomas Jefferson', 'Abraham Lincoln', 'John Adams']
    }
  ]

  describe('groupByCategory', () => {
    it('should group questions by category', () => {
      const result = groupByCategory(mockQuestions)

      expect(result).toHaveLength(2)
      expect(result.find(c => c.name === 'Science')).toEqual({
        name: 'Science',
        count: 2,
        id: 0
      })
      expect(result.find(c => c.name === 'History')).toEqual({
        name: 'History',
        count: 2,
        id: 0
      })
    })
  })

  describe('groupByDifficulty', () => {
    it('should group questions by difficulty', () => {
      const result = groupByDifficulty(mockQuestions)

      expect(result).toHaveLength(3)
      expect(result.find(d => d.name === 'Easy')).toEqual({
        name: 'Easy',
        count: 2
      })
      expect(result.find(d => d.name === 'Medium')).toEqual({
        name: 'Medium',
        count: 1
      })
      expect(result.find(d => d.name === 'Hard')).toEqual({
        name: 'Hard',
        count: 1
      })
    })
  })

  describe('filterQuestionsByCategory', () => {
    it('should filter questions by category', () => {
      const result = filterQuestionsByCategory(mockQuestions, 'Science')

      expect(result).toHaveLength(2)
      expect(result.every(q => q.category === 'Science')).toBe(true)
    })

    it('should return all questions when category is "All"', () => {
      const result = filterQuestionsByCategory(mockQuestions, 'All')

      expect(result).toHaveLength(4)
    })

    it('should return all questions when category is empty', () => {
      const result = filterQuestionsByCategory(mockQuestions, '')

      expect(result).toHaveLength(4)
    })
  })

  describe('getUniqueCategories', () => {
    it('should return unique categories with "All" first', () => {
      const result = getUniqueCategories(mockQuestions)

      expect(result).toEqual(['All', 'History', 'Science'])
    })
  })

  describe('processTriviaData', () => {
    it('should process questions into visualization data', () => {
      const result = processTriviaData(mockQuestions)

      expect(result.totalQuestions).toBe(4)
      expect(result.categories).toHaveLength(2)
      expect(result.difficulties).toHaveLength(3)
    })
  })

  describe('sortCategoriesByCount', () => {
    it('should sort categories by count descending', () => {
      const categories = [
        { name: 'A', count: 1, id: 1 },
        { name: 'B', count: 3, id: 2 },
        { name: 'C', count: 2, id: 3 }
      ]

      const result = sortCategoriesByCount(categories)

      expect(result[0].name).toBe('B')
      expect(result[1].name).toBe('C')
      expect(result[2].name).toBe('A')
    })
  })

  describe('sortDifficulties', () => {
    it('should sort difficulties in order: Easy, Medium, Hard', () => {
      const difficulties = [
        { name: 'Hard', count: 1 },
        { name: 'Easy', count: 2 },
        { name: 'Medium', count: 3 }
      ]

      const result = sortDifficulties(difficulties)

      expect(result[0].name).toBe('Easy')
      expect(result[1].name).toBe('Medium')
      expect(result[2].name).toBe('Hard')
    })
  })
})