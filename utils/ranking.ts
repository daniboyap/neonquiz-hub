// Ranking System Utilities
// Manages local leaderboard with localStorage persistence

export interface RankingEntry {
    id: string;
    playerName: string;
    score: number;
    category: string;
    date: string;
    questionsAnswered: number;
    correctAnswers: number;
}

const RANKING_KEY = 'neonquiz_ranking';
const MAX_ENTRIES = 10;

/**
 * Load ranking from localStorage
 */
export function loadRanking(): RankingEntry[] {
    try {
        const stored = localStorage.getItem(RANKING_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    } catch (error) {
        console.error('Error loading ranking:', error);
        return [];
    }
}

/**
 * Save ranking to localStorage
 */
export function saveRanking(ranking: RankingEntry[]): void {
    try {
        localStorage.setItem(RANKING_KEY, JSON.stringify(ranking));
    } catch (error) {
        console.error('Error saving ranking:', error);
    }
}

/**
 * Check if a score qualifies for the top 10
 */
export function isTopScore(score: number): boolean {
    const ranking = loadRanking();
    if (ranking.length < MAX_ENTRIES) return true;
    return score > ranking[ranking.length - 1].score;
}

/**
 * Add a new entry to the ranking
 * Returns the position (1-indexed) or null if not in top 10
 */
export function addToRanking(entry: Omit<RankingEntry, 'id' | 'date'>): number | null {
    const ranking = loadRanking();

    // Create full entry with ID and date
    const fullEntry: RankingEntry = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
    };

    // Add to ranking
    ranking.push(fullEntry);

    // Sort by score (descending)
    ranking.sort((a, b) => b.score - a.score);

    // Find position
    const position = ranking.findIndex(e => e.id === fullEntry.id) + 1;

    // Keep only top 10
    const trimmedRanking = ranking.slice(0, MAX_ENTRIES);

    // Check if entry made it to top 10
    if (position > MAX_ENTRIES) {
        return null;
    }

    saveRanking(trimmedRanking);
    return position;
}

/**
 * Get ranking position for display (with medal emoji)
 */
export function getPositionDisplay(position: number): string {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
}

/**
 * Format date for display
 */
export function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

/**
 * Clear all ranking data (for testing/reset)
 */
export function clearRanking(): void {
    localStorage.removeItem(RANKING_KEY);
}
