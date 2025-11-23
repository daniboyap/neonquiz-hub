import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';

interface NameInputModalProps {
    score: number;
    onSubmit: (name: string) => void;
    onSkip: () => void;
}

export const NameInputModal: React.FC<NameInputModalProps> = ({ score, onSubmit, onSkip }) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length < 2) return;

        setIsSubmitting(true);
        setTimeout(() => {
            onSubmit(name.trim());
        }, 300);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                transition={{ type: 'spring', damping: 20 }}
                className="w-full max-w-md bg-surface border border-neon/30 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Celebration Header */}
                <div className="relative bg-gradient-to-r from-neon/20 to-purple-900/20 p-8 text-center border-b border-white/10">
                    {/* Animated Sparkles */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 100, opacity: 0 }}
                                animate={{
                                    y: -100,
                                    opacity: [0, 1, 0],
                                    x: [0, Math.random() * 40 - 20]
                                }}
                                transition={{
                                    duration: 2,
                                    delay: i * 0.2,
                                    repeat: Infinity,
                                    repeatDelay: 1
                                }}
                                className="absolute text-neon"
                                style={{ left: `${(i + 1) * 15}%` }}
                            >
                                <Sparkles size={16} />
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="relative w-20 h-20 mx-auto mb-4 rounded-full bg-neon/20 flex items-center justify-center border-2 border-neon shadow-neon"
                    >
                        <Trophy className="text-neon" size={40} />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-black text-white mb-2"
                    >
                        Novo Recorde! 🎉
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-400"
                    >
                        Você fez <span className="text-neon font-bold text-xl">{score} pontos</span>
                    </motion.p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <label className="block mb-6">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                            Digite seu nome
                        </span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value.slice(0, 20))}
                            placeholder="Seu nome aqui..."
                            autoFocus
                            maxLength={20}
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20 transition"
                        />
                        <span className="text-xs text-gray-600 mt-1 block">
                            {name.length}/20 caracteres
                        </span>
                    </label>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onSkip}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold hover:bg-white/10 hover:text-white transition disabled:opacity-50"
                        >
                            Pular
                        </button>
                        <button
                            type="submit"
                            disabled={name.trim().length < 2 || isSubmitting}
                            className="flex-1 px-4 py-3 rounded-xl bg-neon text-white font-bold hover:bg-neon/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-neon"
                        >
                            {isSubmitting ? 'Salvando...' : 'Salvar Recorde'}
                        </button>
                    </div>
                </form>

                {/* Hint */}
                <div className="px-6 pb-6 text-center">
                    <p className="text-xs text-gray-600">
                        Seu recorde será salvo localmente neste dispositivo
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};
