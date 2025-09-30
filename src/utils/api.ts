// API types based on Open Trivia DB documentation
export interface TriviaCategory {
  id: number;
  name: string;
}

export interface TriviaQuestion {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface CategoriesResponse {
  trivia_categories: TriviaCategory[];
}

export interface QuestionsResponse {
  response_code: number;
  results: TriviaQuestion[];
}

export interface ApiError {
  code: number;
  message: string;
}

// Response codes from API docs
export const RESPONSE_CODES = {
  SUCCESS: 0,
  NO_RESULTS: 1,
  INVALID_PARAMETER: 2,
  TOKEN_NOT_FOUND: 3,
  TOKEN_EMPTY: 4,
  RATE_LIMIT: 5,
} as const;

/**
 * Custom error class for Open Trivia Database API errors
 */
export class TriviaApiError extends Error {
  public code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = 'TriviaApiError';
    this.code = code;
  }
}

// API base URLs
const BASE_URL = 'https://opentdb.com';
const API_URL = `${BASE_URL}/api.php`;
const CATEGORIES_URL = `${BASE_URL}/api_category.php`;
const TOKEN_URL = `${BASE_URL}/api_token.php`;

// Session token management
let sessionToken: string | null = null;

/**
 * Retrieves a session token from the Open Trivia Database API.
 * Session tokens help prevent getting duplicate questions in subsequent requests.
 * @returns Promise resolving to the session token string
 */
export const getSessionToken = async (): Promise<string> => {
  if (sessionToken) return sessionToken;

  try {
    const response = await fetch(`${TOKEN_URL}?command=request`);
    const data = await response.json();

    if (data.response_code === 0 && data.token) {
      sessionToken = data.token;
      return sessionToken!;
    } else {
      throw new TriviaApiError(data.response_code || -1, 'Failed to get session token');
    }
  } catch (error) {
    console.error('Error getting session token:', error);
    // Continue without token if it fails
    return '';
  }
};

/**
 * Resets the current session token on the Open Trivia Database API.
 * This should be called when the token becomes empty (no more questions available).
 * @returns Promise that resolves when the token is reset
 */
export const resetSessionToken = async (): Promise<void> => {
  if (!sessionToken) return;

  try {
    const response = await fetch(`${TOKEN_URL}?command=reset&token=${sessionToken}`);
    const data = await response.json();

    if (data.response_code === 0) {
      // Token reset successful, keep the same token
    } else {
      // Reset failed, clear token
      sessionToken = null;
    }
  } catch (error) {
    console.error('Error resetting session token:', error);
    sessionToken = null;
  }
};

const handleApiResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Handle response codes
  switch (data.response_code) {
    case RESPONSE_CODES.SUCCESS:
      return data;
    case RESPONSE_CODES.NO_RESULTS:
      throw new TriviaApiError(RESPONSE_CODES.NO_RESULTS, 'No results found for the query');
    case RESPONSE_CODES.INVALID_PARAMETER:
      throw new TriviaApiError(RESPONSE_CODES.INVALID_PARAMETER, 'Invalid parameters provided');
    case RESPONSE_CODES.TOKEN_NOT_FOUND:
      sessionToken = null; // Clear invalid token
      throw new TriviaApiError(RESPONSE_CODES.TOKEN_NOT_FOUND, 'Session token not found');
    case RESPONSE_CODES.TOKEN_EMPTY:
      await resetSessionToken(); // Try to reset token
      throw new TriviaApiError(RESPONSE_CODES.TOKEN_EMPTY, 'Session token has no more questions');
    case RESPONSE_CODES.RATE_LIMIT:
      throw new TriviaApiError(RESPONSE_CODES.RATE_LIMIT, 'Rate limit exceeded. Please wait before making another request');
    default:
      throw new TriviaApiError(data.response_code || -1, 'Unknown API error');
  }
};

/**
 * Fetches the list of available trivia categories from the Open Trivia Database API.
 * @returns Promise resolving to an array of trivia categories
 */
export const fetchCategories = async (): Promise<TriviaCategory[]> => {
  try {
    const response = await fetch(CATEGORIES_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: CategoriesResponse = await response.json();
    return data.trivia_categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetches trivia questions from the Open Trivia Database API.
 * Automatically ensures at least 50 questions are requested as per project requirements.
 * @param amount - Number of questions to fetch (minimum 50 will be enforced)
 * @param category - Optional category ID to filter questions
 * @param difficulty - Optional difficulty level to filter questions
 * @param type - Optional question type to filter questions
 * @returns Promise resolving to an array of trivia questions
 */
export const fetchQuestions = async (
  amount: number = 50,
  category?: number,
  difficulty?: 'easy' | 'medium' | 'hard',
  type?: 'multiple' | 'boolean'
): Promise<TriviaQuestion[]> => {
  try {
    // Ensure we have at least 50 questions as per requirements
    const questionAmount = Math.max(amount, 50);

    const params = new URLSearchParams({
      amount: questionAmount.toString(),
    });

    if (category) params.append('category', category.toString());
    if (difficulty) params.append('difficulty', difficulty);
    if (type) params.append('type', type);

    // Add session token if available
    const token = await getSessionToken();
    if (token) {
      params.append('token', token);
    }

    const url = `${API_URL}?${params.toString()}`;
    const response = await fetch(url);
    const data: QuestionsResponse = await handleApiResponse(response);

    return data.results;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

/**
 * Decodes HTML entities in a string to their corresponding characters.
 * Used to properly display questions and answers that contain HTML encoding.
 * @param html - The HTML-encoded string to decode
 * @returns The decoded string with HTML entities converted to characters
 */
export const decodeHtml = (html: string): string => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

/**
 * Processes an array of trivia questions by decoding HTML entities in all text fields.
 * This ensures questions and answers display correctly in the UI.
 * @param questions - Array of raw trivia questions from the API
 * @returns Array of processed questions with decoded HTML entities
 */
export const processQuestions = (questions: TriviaQuestion[]): TriviaQuestion[] => {
  return questions.map(question => ({
    ...question,
    category: decodeHtml(question.category),
    question: decodeHtml(question.question),
    correct_answer: decodeHtml(question.correct_answer),
    incorrect_answers: question.incorrect_answers.map(decodeHtml),
  }));
};