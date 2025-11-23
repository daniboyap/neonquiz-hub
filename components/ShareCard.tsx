import React, { forwardRef } from 'react';
import { Trophy, Star } from 'lucide-react';

interface ShareCardProps {
    score: number;
    total: number;
    category: string;
    percentage: number;
    playerName?: string;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ score, total, category, percentage, playerName }, ref) => {
    return (
        <div
            ref={ref}
            className="w-[600px] h-[400px] bg-black relative overflow-hidden flex flex-col items-center justify-center p-8 font-sans"
            style={{
                background: 'linear-gradient(135deg, #000000 0%, #1a0b2e 100%)',
            }}
        >
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] bg-neon/20 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-[-50px] right-[-50px] w-[200px] h-[200px] bg-blue-500/20 rounded-full blur-[80px]"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full"></div>
            </div>

            {/* Logo Area */}
            <div className="mb-6 text-center z-10">
                <h1 className="text-3xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                    NeonQuiz <span className="text-neon">Hub</span>
                </h1>
            </div>

            {/* Main Score Circle */}
            <div className="relative z-10 mb-6">
                <div className="w-40 h-40 rounded-full border-4 border-neon flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                    <span className="text-6xl font-black text-white leading-none">{percentage}%</span>
                    <span className="text-sm text-neon font-bold mt-1">{score}/{total} Acertos</span>
                </div>
                {percentage === 100 && (
                    <div className="absolute -top-4 -right-4 bg-yellow-400 text-black p-2 rounded-full shadow-lg animate-bounce">
                        <Trophy size={24} fill="black" />
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="z-10 text-center space-y-2">
                <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                    <span className="text-gray-300 font-medium uppercase tracking-wider text-sm">{category}</span>
                </div>

                <div className="pt-4">
                    <p className="text-white font-bold text-lg">
                        {percentage === 100 ? "PERFEITO! 🏆" :
                            percentage >= 80 ? "EXCELENTE! 🌟" :
                                percentage >= 60 ? "MANDOU BEM! 👍" : "CONTINUE TREINANDO! 💪"}
                    </p>
                    {playerName && (
                        <p className="text-neon text-sm mt-1">Player: {playerName}</p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 text-gray-500 text-xs uppercase tracking-widest z-10">
                neonquiz-hub.vercel.app
            </div>
        </div>
    );
});

ShareCard.displayName = 'ShareCard';
