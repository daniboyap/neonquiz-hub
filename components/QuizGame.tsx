import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, X, ChevronRight, RotateCcw, Home, LogOut, AlertTriangle, Share2 } from 'lucide-react';
import { GameState, QuizQuestion, Category } from '../types';
import { loadGameQuestions } from '../data/loader';
import { addError } from '../utils/history';
import { isTopScore } from '../utils/ranking';
import { NameInputModal } from './NameInputModal';
import { ShareCard } from './ShareCard';
import html2canvas from 'html2canvas';

interface QuizGameProps {
    category?: Category;
    customQuestions?: QuizQuestion[];
    onExit: () => void;
}

const TIME_PER_QUESTION = 25; // seconds

export const QuizGame: React.FC<QuizGameProps> = ({ category, customQuestions, onExit }) => {
    const [loading, setLoading] = useState(true);
    const [showExitModal, setShowExitModal] = useState(false);
    const [showNameInput, setShowNameInput] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const shareCardRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<GameState>({
        questions: [],
        currentIndex: 0,
        score: 0,
        isFinished: false,
        selectedOption: null,
        isAnswerChecked: false,
        timeRemaining: TIME_PER_QUESTION
    });

    const timerRef = useRef<number | null>(null);

    // Load questions on mount
    useEffect(() => {
        const init = async () => {
            let q: QuizQuestion[] = [];
            if (customQuestions && customQuestions.length > 0) {
                q = customQuestions;
            } else if (category) {
                q = await loadGameQuestions(category.id);
            }

            if (q.length > 0) {
                setState(prev => ({ ...prev, questions: q }));
                setLoading(false);
                startTimer();
            } else {
                setLoading(false); // Handle empty state
            }
        };
        init();
        return () => stopTimer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category?.id, customQuestions]);

    const startTimer = () => {
        stopTimer();
        timerRef.current = window.setInterval(() => {
            setState(prev => {
                if (prev.isFinished || prev.isAnswerChecked) return prev;
                if (prev.timeRemaining <= 1) {
                    // Time's up
                    stopTimer();
                    return { ...prev, timeRemaining: 0, isAnswerChecked: true, selectedOption: -1 }; // -1 indicates timeout
                }
                return { ...prev, timeRemaining: prev.timeRemaining - 1 };
            });
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleOptionClick = (index: number) => {
        if (state.isAnswerChecked) return;

        stopTimer();
        const currentQ = state.questions[state.currentIndex];
        const isCorrect = index === currentQ.correctAnswerIndex;

        setState(prev => ({
            ...prev,
            selectedOption: index,
            isAnswerChecked: true,
            score: isCorrect ? prev.score + 1 : prev.score
        }));

        if (!isCorrect) {
            // Only add to error history if we are NOT in revision mode (to avoid duplicates or infinite loops)
            if (category) {
                addError(currentQ, category.title, index);
            }
        }
    };

    const nextQuestion = () => {
        if (state.currentIndex >= state.questions.length - 1) {
            finishGame();
        } else {
            setState(prev => ({
                ...prev,
                currentIndex: prev.currentIndex + 1,
                selectedOption: null,
                isAnswerChecked: false,
                timeRemaining: TIME_PER_QUESTION
            }));
            startTimer();
        }
    };

    const finishGame = () => {
        setState(prev => ({ ...prev, isFinished: true }));

        // Check for high score (ranking) only if it's a standard category game
        if (category && isTopScore(state.score)) {
            setShowNameInput(true);
        }
    };

    // Logic for Exit Modal
    const handleExitRequest = () => {
        stopTimer(); // Pause game
        setShowExitModal(true);
    };

    const confirmExit = () => {
        onExit();
    };

    const cancelExit = () => {
        setShowExitModal(false);
        if (!state.isFinished && !state.isAnswerChecked) {
            startTimer(); // Resume game
        }
    };

    const handleShare = async () => {
        if (!shareCardRef.current) return;
        setIsSharing(true);

        try {
            const canvas = await html2canvas(shareCardRef.current, {
                scale: 2, // Better quality
                backgroundColor: '#000000',
                useCORS: true
            });

            canvas.toBlob(async (blob) => {
                if (!blob) return;

                // Check if Web Share API is supported and can share files
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'result.png', { type: 'image/png' })] })) {
                    try {
                        const file = new File([blob], 'neonquiz-result.png', { type: 'image/png' });
                        await navigator.share({
                            title: 'Meu Resultado no NeonQuiz Hub',
                            text: `Fiz ${state.score} pontos em ${category ? category.title : 'Revisão'}! Tente superar!`,
                            files: [file]
                        });
                    } catch (err) {
                        console.error('Error sharing:', err);
                    }
                } else {
                    // Fallback to download
                    const link = document.createElement('a');
                    link.download = 'neonquiz-result.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }
                setIsSharing(false);
            }, 'image/png');
        } catch (error) {
            console.error('Error generating image:', error);
            setIsSharing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-neon animate-pulse">
                <div className="w-12 h-12 border-4 border-neon border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Carregando desafio...</p>
            </div>
        );
    }

    if (state.isFinished) {
        const percentage = Math.round((state.score / state.questions.length) * 100);
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full p-6 text-center relative"
            >
                {/* Name Input Modal for High Score */}
                <AnimatePresence>
                    {showNameInput && category && (
                        <NameInputModal
                            score={state.score}
                            category={category.title}
                            totalQuestions={state.questions.length}
                            correctAnswers={state.score}
                            onClose={() => setShowNameInput(false)}
                        />
                    )}
                </AnimatePresence>

                <h2 className="text-3xl font-black text-white mb-2">Resultado</h2>
                <p className="text-gray-400 mb-8">{category ? category.title : "Modo Revisão"}</p>

                <div className="w-40 h-40 rounded-full border-4 border-neon flex items-center justify-center mb-6 shadow-neon bg-surface relative">
                    <div className="absolute inset-0 rounded-full bg-neon/10 animate-pulse-slow"></div>
                    <div className="flex flex-col">
                        <span className="text-5xl font-black text-white">{percentage}%</span>
                        <span className="text-sm text-neon font-bold">{state.score}/{state.questions.length}</span>
                    </div>
                </div>

                <p className="text-xl text-white mb-8 font-medium">
                    {percentage === 100 ? "Perfeito! Você é um mestre." :
                        percentage >= 70 ? "Mandou muito bem!" :
                            percentage >= 50 ? "Na média, continue treinando." : "Vamos tentar de novo?"}
                </p>

                <div className="flex gap-4 w-full max-w-sm">
                    <button onClick={onExit} className="flex-1 py-4 rounded-xl bg-surface border border-gray-700 text-gray-300 font-bold flex items-center justify-center hover:bg-gray-800 transition">
                        <Home className="mr-2" /> Início
                    </button>
                    <button onClick={() => window.location.reload()} className="flex-1 py-4 rounded-xl bg-neon text-white font-bold flex items-center justify-center shadow-neon hover:scale-105 transition">
                        <RotateCcw className="mr-2" /> Repetir
                    </button>
                </div>

                {/* Share Button */}
                <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="mt-4 w-full max-w-sm py-3 rounded-xl bg-purple-900/50 border border-purple-500/30 text-purple-200 font-bold flex items-center justify-center hover:bg-purple-900/80 transition"
                >
                    {isSharing ? (
                        <span className="animate-pulse">Gerando imagem...</span>
                    ) : (
                        <>
                            <Share2 className="mr-2" size={20} /> Compartilhar Resultado
                        </>
                    )}
                </button>

                {/* Hidden Share Card for Capture */}
                <div className="fixed left-[-9999px] top-[-9999px]">
                    <ShareCard
                        ref={shareCardRef}
                        score={state.score}
                        total={state.questions.length}
                        category={category ? category.title : 'Modo Revisão'}
                        percentage={percentage}
                    />
                </div>
            </motion.div>
        );
    }

    if (state.questions.length === 0) return <div className="p-8 text-center">Erro ao carregar perguntas.</div>

    const currentQ = state.questions[state.currentIndex];
    const progress = ((state.currentIndex) / state.questions.length) * 100;

    return (
        <div className="flex flex-col h-full max-w-xl mx-auto p-4 relative">
            {/* Header Game */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <button
                        onClick={handleExitRequest}
                        className="mr-4 p-2 rounded-lg bg-surface/50 text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors border border-white/5 hover:border-red-500/30"
                        aria-label="Sair do Quiz"
                    >
                        <X size={20} />
                    </button>
                    <div className="text-sm text-gray-400 font-mono">
                        Q.{state.currentIndex + 1}/{state.questions.length}
                    </div>
                </div>

                <div className="flex items-center px-3 py-1 rounded-full bg-surface border border-neon/30">
                    <Clock size={16} className="text-neon mr-2" />
                    <span className={`font-bold font-mono ${state.timeRemaining < 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {state.timeRemaining}s
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-800 rounded-full mb-8 overflow-hidden">
                <motion.div
                    className="h-full bg-neon shadow-neon"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Question */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={state.currentIndex}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="flex-1 flex flex-col justify-center"
                >
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-8 leading-tight">
                        {currentQ.question}
                    </h2>

                    <div className="space-y-3">
                        {currentQ.options.map((option, idx) => {
                            let stateClass = "bg-surface border-gray-700 text-gray-300";

                            if (state.isAnswerChecked) {
                                if (idx === currentQ.correctAnswerIndex) {
                                    stateClass = "bg-green-900/30 border-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]";
                                } else if (idx === state.selectedOption) {
                                    stateClass = "bg-red-900/30 border-red-500 text-white";
                                } else {
                                    stateClass = "opacity-50 border-transparent";
                                }
                            } else if (state.selectedOption === idx) {
                                stateClass = "border-neon text-white bg-neon/10";
                            }

                            return (
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    key={idx}
                                    onClick={() => handleOptionClick(idx)}
                                    disabled={state.isAnswerChecked}
                                    className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 flex justify-between items-center ${stateClass} ${!state.isAnswerChecked ? 'hover:border-neon hover:shadow-neon' : ''}`}
                                >
                                    <span>{option}</span>
                                    {state.isAnswerChecked && idx === currentQ.correctAnswerIndex && <Check size={20} className="text-green-500" />}
                                    {state.isAnswerChecked && idx === state.selectedOption && idx !== currentQ.correctAnswerIndex && <X size={20} className="text-red-500" />}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Feedback / Next Button */}
            <AnimatePresence>
                {state.isAnswerChecked && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mt-6"
                    >
                        {currentQ.explanation && (
                            <div className="mb-4 p-3 rounded bg-blue-900/20 border border-blue-500/30 text-sm text-blue-200">
                                💡 {currentQ.explanation}
                            </div>
                        )}
                        <button
                            onClick={nextQuestion}
                            className="w-full py-4 bg-neon text-white font-bold rounded-xl shadow-neon hover:scale-[1.02] transition-transform flex items-center justify-center"
                        >
                            {state.currentIndex === state.questions.length - 1 ? "Finalizar" : "Próxima Pergunta"} <ChevronRight className="ml-2" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Exit Confirmation Modal */}
            <AnimatePresence>
                {showExitModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-surface border border-neon/50 rounded-2xl p-6 w-full max-w-sm shadow-neon-strong relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-neon/20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>

                            <div className="flex items-center mb-4 text-white">
                                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                                    <AlertTriangle className="text-red-500" size={20} />
                                </div>
                                <h3 className="text-xl font-bold">Sair do Quiz?</h3>
                            </div>

                            <p className="text-gray-400 mb-6">Seu progresso atual será perdido. Você tem certeza que deseja voltar ao início?</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={cancelExit}
                                    className="flex-1 py-3 rounded-xl bg-surface border border-gray-700 text-white font-medium hover:bg-gray-800 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmExit}
                                    className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold shadow-lg hover:bg-red-500 transition flex items-center justify-center"
                                >
                                    <LogOut size={18} className="mr-2" /> Sair
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};