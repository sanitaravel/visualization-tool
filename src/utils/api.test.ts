import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchCategories, fetchQuestions, processQuestions, decodeHtml, RESPONSE_CODES } from '../utils/api'

// Mock fetch globally
const mockFetch = vi.fn()
;(globalThis as any).fetch = mockFetch

describe('API Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock session token request by default
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('api_token.php')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ response_code: 0, token: 'test-token' })
        })
      }
      return Promise.reject(new Error('Unhandled URL'))
    })
  })

  describe('decodeHtml', () => {
    it('should decode HTML entities', () => {
      expect(decodeHtml('&amp;')).toBe('&')
      expect(decodeHtml('&lt;')).toBe('<')
      expect(decodeHtml('&gt;')).toBe('>')
      expect(decodeHtml('&quot;')).toBe('"')
      expect(decodeHtml('&#039;')).toBe("'")
    })

    it('should handle mixed content', () => {
      expect(decodeHtml('Tom &amp; Jerry')).toBe('Tom & Jerry')
    })
  })

  describe('processQuestions', () => {
    it('should decode HTML entities in questions and answers', () => {
      const questions = [
        {
          category: 'Test',
          type: 'multiple' as const,
          difficulty: 'easy' as const,
          question: 'What is 2 &amp; 2?',
          correct_answer: '4',
          incorrect_answers: ['3', '5']
        }
      ]

      const processed = processQuestions(questions)

      expect(processed[0].question).toBe('What is 2 & 2?')
      expect(processed[0].correct_answer).toBe('4')
      expect(processed[0].incorrect_answers).toEqual(['3', '5'])
    })
  })

  describe('fetchCategories', () => {
    it('should fetch categories successfully', async () => {
      const mockCategories = [
        { id: 1, name: 'General Knowledge' },
        { id: 2, name: 'Science' }
      ]

      mockFetch.mockImplementation((url: string) => {
        if (url === 'https://opentdb.com/api_category.php') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              trivia_categories: mockCategories
            })
          })
        }
        return Promise.reject(new Error('Unhandled URL'))
      })

      const result = await fetchCategories()

      expect(result).toEqual(mockCategories)
    })

    it('should handle fetch errors', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url === 'https://opentdb.com/api_category.php') {
          return Promise.reject(new Error('Network error'))
        }
        return Promise.reject(new Error('Unhandled URL'))
      })

      await expect(fetchCategories()).rejects.toThrow('Network error')
    })
  })

  describe('fetchQuestions', () => {
    it('should fetch questions with minimum amount', async () => {
      const mockQuestions = [
        {
          category: 'Test',
          type: 'multiple',
          difficulty: 'easy',
          question: 'Test question?',
          correct_answer: 'A',
          incorrect_answers: ['B', 'C', 'D']
        }
      ]

      mockFetch.mockImplementation((url: string) => {
        if (url.includes('api.php?amount=50')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              response_code: RESPONSE_CODES.SUCCESS,
              results: mockQuestions
            })
          })
        }
        if (url.includes('api_token.php')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ response_code: 0, token: 'test-token' })
          })
        }
        return Promise.reject(new Error('Unhandled URL'))
      })

      const result = await fetchQuestions(10) // Less than 50

      expect(result).toEqual(mockQuestions)
    })

    it('should handle API errors', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('api.php?')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              response_code: RESPONSE_CODES.NO_RESULTS
            })
          })
        }
        if (url.includes('api_token.php')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ response_code: 0, token: 'test-token' })
          })
        }
        return Promise.reject(new Error('Unhandled URL'))
      })

      await expect(fetchQuestions()).rejects.toThrow('No results found for the query')
    })

    it('should handle rate limiting', async () => {
      mockFetch.mockImplementation((url: string) => {
        if (url.includes('api.php?')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              response_code: RESPONSE_CODES.RATE_LIMIT
            })
          })
        }
        if (url.includes('api_token.php')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ response_code: 0, token: 'test-token' })
          })
        }
        return Promise.reject(new Error('Unhandled URL'))
      })

      await expect(fetchQuestions()).rejects.toThrow('Rate limit exceeded')
    })
  })
})