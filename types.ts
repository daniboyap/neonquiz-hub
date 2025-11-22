export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation?: string;
}

export interface Category {
    id: string;
    title: string;
    description: string;
    iconName: string; // Mapping to Lucide icons string key
}

export type ViewState = 'HOME' | 'GAME' | 'ABOUT' | 'SERVICES';

export interface GameState {
    questions: QuizQuestion[];
    currentIndex: number;
    score: number;
    isFinished: boolean;
    selectedOption: number | null;
    isAnswerChecked: boolean;
    timeRemaining: number;
}
