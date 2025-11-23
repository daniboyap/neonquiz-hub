import { QuizQuestion } from '../types';

export interface ErrorEntry {
    id: string;
    question: QuizQuestion;
    categoryTitle: string;
    date: string;
    userAnswerIndex: number; // The wrong answer the user selected
}

const HISTORY_KEY = 'neonquiz_error_history';

/**
 * Load error history from localStorage
 */
export function loadErrorHistory(): ErrorEntry[] {
    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    } catch (error) {
        console.error('Error loading history:', error);
        return [];
    }
}

/**
 * Save error history to localStorage
 */
function saveHistory(history: ErrorEntry[]): void {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Error saving history:', error);
    }
}

/**
 * Add an error to the history
 * Avoids duplicates based on question text
 */
export function addError(question: QuizQuestion, categoryTitle: string, userAnswerIndex: number): void {
    const history = loadErrorHistory();
    
    // Check if already exists
    const exists = history.some(e => e.question.question === question.question);
    if (exists) return;

    const newEntry: ErrorEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        question,
        categoryTitle,
        date: new Date().toISOString(),
        userAnswerIndex
    };

    // Add to beginning of list
    history.unshift(newEntry);
    
    // Limit to last 100 errors to avoid storage issues
    if (history.length > 100) {
        history.pop();
    }

    saveHistory(history);
}

/**
 * Remove an error by ID
 */
export function removeError(id: string): void {
    const history = loadErrorHistory();
    const newHistory = history.filter(e => e.id !== id);
    saveHistory(newHistory);
}

/**
 * Clear all history
 */
export function clearErrorHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
}
