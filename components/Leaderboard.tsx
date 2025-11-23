import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Award, TrendingUp, Calendar } from 'lucide-react';
import { loadRanking, getPositionDisplay, formatDate, type RankingEntry } from '../utils/ranking';

interface LeaderboardProps {
    onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onClose }) => {
    const ranking = loadRanking();
    const hasEntries = ranking.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-neon/20 to-purple-900/20 border-b border-white/10 p-6">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-neon/20 flex items-center justify-center border border-neon/30 shadow-neon">
                                <Trophy className="text-neon" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Ranking Local</h2>
                                <p className="text-sm text-gray-400">Top 10 Melhores Pontuações</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {!hasEntries ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                <Award className="text-gray-600" size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Nenhum recorde ainda</h3>
                            <p className="text-gray-400 max-w-sm mx-auto">
                                Complete um quiz para aparecer no ranking! 🚀
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <AnimatePresence>
                                {ranking.map((entry, index) => (
                                    <RankingCard
                                        key={entry.id}
                                        entry={entry}
                                        position={index + 1}
                                        index={index}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Footer Stats */}
                {hasEntries && (
                    <div className="border-t border-white/10 p-4 bg-black/30">
                        <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={14} className="text-neon" />
                                <span>Melhor: {ranking[0].score} pts</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Trophy size={14} className="text-yellow-500" />
                                <span>{ranking.length} recordes</span>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

interface RankingCardProps {
    entry: RankingEntry;
    position: number;
    index: number;
}

const RankingCard: React.FC<RankingCardProps> = ({ entry, position, index }) => {
    const positionDisplay = getPositionDisplay(position);
    const accuracy = Math.round((entry.correctAnswers / entry.questionsAnswered) * 100);
    const isTopThree = position <= 3;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className={`relative rounded-xl p-4 border transition-all ${isTopThree
                    ? 'bg-gradient-to-r from-neon/10 to-purple-900/10 border-neon/30 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
        >
            <div className="flex items-center gap-4">
                {/* Position Badge */}
                <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-black text-lg ${isTopThree
                            ? 'bg-neon/20 text-neon border border-neon/30'
                            : 'bg-white/5 text-gray-400 border border-white/10'
                        }`}
                >
                    {positionDisplay}
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="font-bold text-white truncate">{entry.playerName}</h3>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={10} />
                            {formatDate(entry.date)}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="truncate">{entry.category}</span>
                        <span>•</span>
                        <span>{accuracy}% acerto</span>
                        <span>•</span>
                        <span>{entry.questionsAnswered} questões</span>
                    </div>
                </div>

                {/* Score */}
                <div className="flex-shrink-0 text-right">
                    <div className={`text-2xl font-black ${isTopThree ? 'text-neon' : 'text-white'}`}>
                        {entry.score}
                    </div>
                    <div className="text-xs text-gray-500">pontos</div>
                </div>
            </div>

            {/* Top 3 Glow Effect */}
            {isTopThree && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon/5 to-purple-500/5 pointer-events-none" />
            )}
        </motion.div>
    );
};
