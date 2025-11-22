import { Category } from './types';
import { 
    Globe, Monitor, Tv, History, Trophy, BookOpen, Leaf, 
    Camera, Palette, MapPin, Zap, Sparkles, Music, Heart, Calculator, 
    Cpu, Database, Network, Code, Layout, Cloud, Lock, ClipboardCheck
} from 'lucide-react';

export const APP_NAME = "NeonQuiz Hub";

// Subcategories for IT
export const TECH_CATEGORIES: Category[] = [
    { id: 'tech_logic', title: 'Lógica e Algoritmos', description: 'Desafie seu raciocínio lógico', iconName: 'Cpu' },
    { id: 'tech_db', title: 'Banco de Dados', description: 'SQL e modelagem', iconName: 'Database' },
    { id: 'tech_network', title: 'Redes', description: 'Infraestrutura e protocolos', iconName: 'Network' },
    { id: 'tech_prog', title: 'Programação', description: 'Python, Java, JS', iconName: 'Code' },
    { id: 'tech_eng', title: 'Eng. de Software', description: 'Processos e padrões', iconName: 'Layout' },
    { id: 'tech_cloud', title: 'Cloud Computing', description: 'AWS, Azure, Conceitos', iconName: 'Cloud' },
    { id: 'tech_sec', title: 'Segurança da Info', description: 'Cybersecurity e LGPD', iconName: 'Lock' },
    { id: 'tech_concursos', title: 'Informática p/ Concursos', description: 'Questões de bancas como CESPE, FGV', iconName: 'ClipboardCheck' },
];

export const MAIN_CATEGORIES: Category[] = [
    { id: 'general', title: 'Geral e Atualidades', description: 'Fatos recentes e curiosidades', iconName: 'Globe' },
    { id: 'pop', title: 'Cultura Pop 2025', description: 'Séries, filmes e trends', iconName: 'Tv' },
    { id: 'history', title: 'História e Geografia', description: 'Brasil e mundo', iconName: 'History' },
    { id: 'sports', title: 'Esportes', description: 'Futebol e Olimpíadas', iconName: 'Trophy' },
    { id: 'enem', title: 'ENEM e Vestibulares', description: 'Revisão e simulados', iconName: 'BookOpen' },
    { id: 'env', title: 'Meio Ambiente', description: 'Clima e sustentabilidade', iconName: 'Leaf' },
    { id: 'influencers', title: 'Influenciadores', description: 'Personalidades da internet', iconName: 'Camera' },
    { id: 'art', title: 'Línguas e Arte', description: 'Literatura e cultura geek', iconName: 'Palette' },
    { id: 'cities', title: 'Cidades e Capitais', description: 'Turismo e cultura local', iconName: 'MapPin' },
    { id: 'tech_general', title: 'Tecnologia e Inovação', description: 'IA, Gadgets e Startups', iconName: 'Zap' },
    { id: 'myths', title: 'Mitos Brasileiros', description: 'Folclore e lendas', iconName: 'Sparkles' },
    { id: 'music', title: 'Música', description: 'Hits e virais', iconName: 'Music' },
    { id: 'health', title: 'Saúde e Bem-Estar', description: 'Qualidade de vida', iconName: 'Heart' },
    { id: 'math', title: 'Matemática', description: 'Cálculos e desafios', iconName: 'Calculator' },
];

// Helper to get icon component
export const getIcon = (name: string) => {
    const icons: any = { 
        Globe, Monitor, Tv, History, Trophy, BookOpen, Leaf, 
        Camera, Palette, MapPin, Zap, Sparkles, Music, Heart, Calculator,
        Cpu, Database, Network, Code, Layout, Cloud, Lock, ClipboardCheck
    };
    return icons[name] || Sparkles;
};