import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Play, AlertTriangle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { ErrorEntry, loadErrorHistory, removeError, clearErrorHistory } from '../utils/history';
import { QuizQuestion } from '../types';

interface ErrorHistoryProps {
    onBack: () => void;
    onStartRevision: (questions: QuizQuestion[]) => void;
}

export const ErrorHistory: React.FC<ErrorHistoryProps> = ({ onBack, onStartRevision }) => {
    const [history, setHistory] = useState<ErrorEntry[]>([]);
    const [selectedErrors, setSelectedErrors] = useState<string[]>([]);

    useEffect(() => {
        setHistory(loadErrorHistory());
    }, []);

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        removeError(id);
        setHistory(prev => prev.filter(item => item.id !== id));
        setSelectedErrors(prev => prev.filter(item => item !== id));
    };

    const handleClearAll = () => {
        if (window.confirm('Tem certeza que deseja limpar todo o histórico de erros?')) {
            clearErrorHistory();
            setHistory([]);
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedErrors(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const startRevision = () => {
        const questionsToRevise = history
            .filter(entry => selectedErrors.length === 0 || selectedErrors.includes(entry.id))
            .map(entry => entry.question);

        onStartRevision(questionsToRevise);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full max-w-4xl mx-auto p-4"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                            <AlertTriangle className="text-red-500" />
                            Histórico de Erros
                        </h2>
                        <p className="text-sm text-gray-400">
                            {history.length} questões para revisar
                        </p>
                    </div>
                </div>

                {history.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="px-4 py-2 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 transition text-sm font-bold flex items-center gap-2"
                    >
                        <Trash2 size={16} /> Limpar Tudo
                    </button>
                )}
            </div>

            {/* Content */}
            {history.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-800 rounded-2xl bg-surface/30">
                    <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
                        <CheckCircle className="text-green-500" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Tudo Limpo!</h3>
                    <p className="text-gray-400 max-w-xs mx-auto">
                        Você não tem erros registrados. Continue jogando para testar seus conhecimentos!
                    </p>
                    <button
                        onClick={onBack}
                        className="mt-6 px-6 py-3 bg-neon text-white font-bold rounded-xl shadow-neon hover:scale-105 transition"
                    >
                        Voltar ao Início
                    </button>
                </div>
            ) : (
                <>
                    {/* Action Bar */}
                    <div className="flex gap-4 mb-6 sticky top-0 z-20 bg-black/80 backdrop-blur-md py-4 border-b border-white/10">
                        <button
                            onClick={startRevision}
                            className="flex-1 py-4 bg-neon text-white font-bold rounded-xl shadow-neon hover:scale-[1.02] transition flex items-center justify-center gap-2"
                        >
                            <Play size={20} fill="currentColor" />
                            {selectedErrors.length > 0
                                ? `Revisar Selecionadas (${selectedErrors.length})`
                                : "Revisar Todas Agora"}
                        </button>
                    </div>

                    {/* List */}
                    <div className="grid gap-4 pb-20">
                        <AnimatePresence>
                            {history.map((entry) => (
                                <motion.div
                                    key={entry.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={() => toggleSelection(entry.id)}
                                    className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${selectedErrors.includes(entry.id)
                                            ? 'bg-neon/10 border-neon shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                            : 'bg-surface border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-bold px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">
                                                    {entry.categoryTitle}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(entry.date).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-white mb-3 leading-relaxed">
                                                {entry.question.question}
                                            </h3>

                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2 text-red-400 bg-red-900/10 p-2 rounded border border-red-900/20">
                                                    <XCircle size={16} />
                                                    <span className="font-medium">Sua resposta:</span>
                                                    <span className="line-through opacity-75">
                                                        {entry.question.options[entry.userAnswerIndex]}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-green-400 bg-green-900/10 p-2 rounded border border-green-900/20">
                                                    <CheckCircle size={16} />
                                                    <span className="font-medium">Correta:</span>
                                                    <span>
                                                        {entry.question.options[entry.question.correctAnswerIndex]}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => handleDelete(entry.id, e)}
                                            className="p-2 rounded-lg text-gray-600 hover:bg-red-500 hover:text-white transition opacity-0 group-hover:opacity-100"
                                            title="Remover do histórico"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Selection Checkbox */}
                                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedErrors.includes(entry.id)
                                            ? 'bg-neon border-neon'
                                            : 'border-gray-600 bg-transparent'
                                        }`}>
                                        {selectedErrors.includes(entry.id) && <CheckCircle size={14} className="text-white" />}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </motion.div>
    );
};
