import React, { useState, useEffect } from 'react';
import { Menu, X, HelpCircle, Heart, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MAIN_CATEGORIES, TECH_CATEGORIES, getIcon } from './constants';
import { Category, ViewState } from './types';
import { QuizGame } from './components/QuizGame';
import { AboutPage, ServicesPage } from './components/StaticPages';

interface CategoryCardProps {
    cat: Category;
    isFav: boolean;
    onToggleFavorite: (id: string, e: React.MouseEvent) => void;
    onStartQuiz: (cat: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ cat, isFav, onToggleFavorite, onStartQuiz }) => {
    const Icon = getIcon(cat.iconName);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02, borderColor: '#a855f7' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStartQuiz(cat)}
            className="relative rounded-2xl p-5 cursor-pointer group overflow-hidden border transition-all duration-300 bg-surface border-white/10 hover:border-neon/50 flex flex-col h-full min-h-[180px]"
        >
            {/* Background Icon decoration */}
            <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition text-neon pointer-events-none rotate-12">
                <Icon size={100} />
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 flex-1">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center transition bg-neon/10 text-neon group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                        <Icon size={20} />
                    </div>
                    <h3 className="ml-3 font-bold text-lg text-white truncate pr-2">{cat.title}</h3>
                </div>
                
                {/* Description with padding bottom to avoid overlap with heart */}
                <p className="text-sm text-gray-400 leading-relaxed pb-8 line-clamp-3">
                    {cat.description}
                </p>
                
                {isFav && (
                    <div className="absolute top-0 right-0 flex items-center text-[10px] text-neon font-bold uppercase tracking-wider bg-neon/10 px-2 py-1 rounded-bl-lg border-b border-l border-neon/20">
                        <Sparkles size={10} className="mr-1" /> Salvo
                    </div>
                )}
            </div>

            {/* Favorite Button - Explicit Bottom Right Positioning with High Z-Index */}
            <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={(e) => onToggleFavorite(cat.id, e)}
                className="absolute bottom-3 right-3 z-30 p-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-neon/50 transition-all shadow-lg group-hover:scale-110"
                aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
                <Heart 
                    size={20} 
                    className={`transition-all duration-300 ${isFav ? 'fill-pink-500 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]' : 'text-gray-500 group-hover:text-gray-300'}`} 
                />
            </motion.button>
        </motion.div>
    );
};

type TabType = 'general' | 'tech' | 'favorites';

export default function App() {
    const [view, setView] = useState<ViewState>('HOME');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [favorites, setFavorites] = useState<string[]>([]);

    // Load favorites on mount
    useEffect(() => {
        const storedFavs = localStorage.getItem('neonquiz_favorites');
        if (storedFavs) {
            try {
                setFavorites(JSON.parse(storedFavs));
            } catch (e) {
                console.error("Error loading favorites", e);
            }
        }
        // PWA body color
        document.body.style.backgroundColor = '#000000';
    }, []);

    const toggleFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        let newFavs;
        if (favorites.includes(id)) {
            newFavs = favorites.filter(favId => favId !== id);
        } else {
            newFavs = [...favorites, id];
        }
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
    };

    // Combine all categories to find favorites easily
    const ALL_CATEGORIES = [...MAIN_CATEGORIES, ...TECH_CATEGORIES];
    
    // Determine which categories to display
    let displayedCategories: Category[] = [];
    if (activeTab === 'general') {
        displayedCategories = MAIN_CATEGORIES;
    } else if (activeTab === 'tech') {
        displayedCategories = TECH_CATEGORIES;
    } else {
        displayedCategories = ALL_CATEGORIES.filter(cat => favorites.includes(cat.id));
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden flex flex-col">
            
            {/* Navigation Header */}
            {view !== 'GAME' && (
                <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
                    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                        <button onClick={() => setIsMenuOpen(true)} className="p-2 text-neon hover:bg-white/5 rounded-lg transition">
                            <Menu size={24} />
                        </button>
                        
                        <div className="text-center cursor-pointer" onClick={() => handleNav('HOME')}>
                            <h1 className="text-xl font-black tracking-tighter text-white drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
                                NeonQuiz <span className="text-neon">Hub</span>
                            </h1>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon to-purple-900 flex items-center justify-center shadow-neon">
                            <HelpCircle size={20} className="text-white" />
                        </div>
                    </div>
                </header>
            )}

            {/* Mobile Drawer Menu */}
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

                {view === 'GAME' && selectedCategory && (
                    <QuizGame category={selectedCategory} onExit={() => handleNav('HOME')} />
                )}

                {view === 'ABOUT' && <AboutPage onBack={() => handleNav('HOME')} />}
                
                {view === 'SERVICES' && <ServicesPage onBack={() => handleNav('HOME')} />}

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