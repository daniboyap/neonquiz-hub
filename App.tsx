import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Trophy, HelpCircle, Heart, Star } from 'lucide-react';
import { Category, ViewState, QuizQuestion } from './types';
import { categories, getIcon } from './constants';
import { QuizGame } from './components/QuizGame';
import { AboutPage, ServicesPage } from './components/StaticPages';
import { Leaderboard } from './components/Leaderboard';
import { ErrorHistory } from './components/ErrorHistory';

type TabType = 'general' | 'tech' | 'favorites';

interface CategoryCardProps {
    cat: Category;
    isFav: boolean;
    onToggleFavorite: (id: string) => void;
    onStartQuiz: (cat: Category) => void;
}

function CategoryCard({ cat, isFav, onToggleFavorite, onStartQuiz }: CategoryCardProps) {
    const Icon = getIcon(cat.iconName);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="relative group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-neon/20 to-purple-900/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div
                onClick={() => onStartQuiz(cat)}
                className="relative bg-surface border border-white/5 hover:border-neon/50 rounded-2xl p-6 cursor-pointer overflow-hidden transition-all duration-300 shadow-lg hover:shadow-neon"
            >
                <div className="absolute top-0 right-0 p-4 z-10">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(cat.id); }}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <Heart
                            size={20}
                            className={`transition-all duration-300 ${isFav ? 'fill-pink-500 text-pink-500 scale-110' : 'text-gray-500 hover:text-pink-400'}`}
                        />
                    </button>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 group-hover:border-neon/50 transition-colors shadow-inner">
                        <Icon size={40} className="text-neon group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon transition-colors">{cat.title}</h3>
                        <p className="text-xs text-gray-400 line-clamp-2">{cat.description}</p>
                    </div>
                    <div className="w-full pt-3 border-t border-white/5 flex justify-between items-center text-xs text-gray-500 font-mono">
                        <span>15s / questão</span>
                        <span className="px-2 py-1 rounded bg-white/5 text-gray-300">Iniciar</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function App() {
    const [view, setView] = useState<ViewState>('HOME');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [favorites, setFavorites] = useState<string[]>([]);
    const [revisionQuestions, setRevisionQuestions] = useState<QuizQuestion[]>([]);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    // Load favorites from local storage
    useEffect(() => {
        const saved = localStorage.getItem('neonquiz_favorites');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    }, []);

    const toggleFavorite = (id: string) => {
        const newFavs = favorites.includes(id)
            ? favorites.filter(f => f !== id)
            : [...favorites, id];
        setFavorites(newFavs);
        localStorage.setItem('neonquiz_favorites', JSON.stringify(newFavs));
    };

    const handleStartQuiz = (cat: Category) => {
        setSelectedCategory(cat);
        setView('GAME');
    };

    const handleNav = (target: ViewState) => {
        setView(target);
        setIsMenuOpen(false);
        setSelectedCategory(null);
        setRevisionQuestions([]); // Clear revision questions when navigating
    };

    const displayedCategories = categories.filter(c => {
        if (activeTab === 'favorites') return favorites.includes(c.id);
        return c.type === activeTab;
    });

    return (
        <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-neon selection:text-white flex flex-col">
            {/* Header */}
            {view !== 'GAME' && (
                <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
                    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <Menu className="text-white" />
                            </button>
                            <h1 className="text-2xl font-black tracking-tighter text-white cursor-pointer" onClick={() => handleNav('HOME')}>
                                NeonQuiz <span className="text-neon">Hub</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleNav('HISTORY')}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-neon"
                                title="Histórico de Erros"
                            >
                                <HelpCircle size={20} />
                            </button>
                            <button
                                onClick={() => setShowLeaderboard(true)}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-yellow-400"
                                title="Ranking"
                            >
                                <Trophy size={20} />
                            </button>
                        </div>
                    </div>
                </header>
            )}

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-[60]"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-64 bg-surface border-r border-white/10 z-[70] p-6 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <span className="font-bold text-lg">Menu</span>
                                <button onClick={() => setIsMenuOpen(false)}><X className="text-gray-400" /></button>
                            </div>
                            <nav className="flex flex-col space-y-4">
                                <button onClick={() => handleNav('HOME')} className="text-left p-3 rounded hover:bg-white/5 font-medium text-lg">Início</button>
                                <button onClick={() => handleNav('SERVICES')} className="text-left p-3 rounded hover:bg-white/5 font-medium text-lg text-neon">Serviços</button>
                                <button onClick={() => handleNav('ABOUT')} className="text-left p-3 rounded hover:bg-white/5 font-medium text-lg">Sobre</button>
                            </nav>
                            <div className="mt-auto text-xs text-gray-600 text-center pb-4">
                                © 2025 NeonQuiz Hub
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-4xl mx-auto relative">
                {view === 'HOME' && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="pb-12"
                    >
                        <div className="px-4">
                            <div className="text-center mb-6 mt-4">
                                <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Explore o conhecimento</p>
                                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
                                    Escolha seu tema
                                </h2>
                            </div>

                            {/* 3-Way Toggle Section (Tabs) */}
                            <div className="flex justify-center mb-8 sticky top-20 z-40">
                                <div className="bg-surface/80 backdrop-blur-md border border-white/10 p-1 rounded-xl flex relative w-full max-w-md shadow-lg ring-1 ring-white/5">
                                    {['general', 'tech', 'favorites'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab as TabType)}
                                            className={`flex-1 relative px-2 py-3 text-sm font-bold transition-colors z-10 rounded-lg ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            {activeTab === tab && (
                                                <motion.div
                                                    layoutId="active-tab-bg"
                                                    className="absolute inset-0 bg-neon rounded-lg shadow-neon -z-10"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                            <span className="capitalize flex items-center justify-center gap-2">
                                                {tab === 'general' && 'Geral'}
                                                {tab === 'tech' && 'Tech'}
                                                {tab === 'favorites' && 'Favoritos'}
                                                {tab === 'favorites' && <Heart size={14} className={`transition-colors ${activeTab === tab ? 'fill-white text-white' : 'text-gray-500'}`} />}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content Grid or Empty State */}
                            <AnimatePresence mode="wait">
                                {activeTab === 'favorites' && displayedCategories.length === 0 ? (
                                    <motion.div
                                        key="empty-favorites"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-surface/30"
                                    >
                                        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                            <Star className="text-gray-600" size={36} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Nenhum favorito ainda</h3>
                                        <p className="text-gray-400 max-w-xs mx-auto leading-relaxed">
                                            Clique no coração <Heart size={14} className="inline text-pink-500 fill-pink-500 mx-1" /> nos cards das abas <span className="text-white font-bold">Geral</span> ou <span className="text-white font-bold">Tech</span> para criar sua coleção personalizada.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={activeTab} // Force re-render on tab change for animation
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                    >
                                        {displayedCategories.map((cat) => (
                                            <CategoryCard
                                                key={cat.id}
                                                cat={cat}
                                                isFav={favorites.includes(cat.id)}
                                                onToggleFavorite={toggleFavorite}
                                                onStartQuiz={handleStartQuiz}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {view === 'GAME' && (selectedCategory || revisionQuestions.length > 0) && (
                    <QuizGame
                        category={selectedCategory || undefined}
                        customQuestions={revisionQuestions.length > 0 ? revisionQuestions : undefined}
                        onExit={() => handleNav('HOME')}
                    />
                )}

                {view === 'ABOUT' && <AboutPage onBack={() => handleNav('HOME')} />}

                {view === 'SERVICES' && <ServicesPage onBack={() => handleNav('HOME')} />}

                {view === 'HISTORY' && (
                    <ErrorHistory
                        onBack={() => handleNav('HOME')}
                        onStartRevision={(questions) => {
                            setRevisionQuestions(questions);
                            setSelectedCategory(null);
                            setView('GAME');
                        }}
                    />
                )}

            </main>

            {/* Footer */}
            {view === 'HOME' && (
                <footer className="py-8 text-center text-gray-600 text-xs border-t border-white/5 mt-auto">
                    <p>© 2025 NeonQuiz Hub</p>
                    <p className="mt-1">Powered by DL Service</p>
                </footer>
            )}
        </div>
    );
}