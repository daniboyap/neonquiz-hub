
import { QuizQuestion } from "../types";
import { questions as generalQuestions } from "./questions/general";

// OTIMIZAÇÃO DE PERFORMANCE (LAZY LOADING)
// Em vez de importar todos os arquivos no topo (o que deixaria o app pesado),
// usamos import() dinâmico dentro do switch. 
// O Next.js/Webpack divide isso em pedaços menores (chunks).
// O celular do usuário só baixa o arquivo de 'história' se ele clicar em 'história'.

const getRawQuestions = async (categoryId: string): Promise<QuizQuestion[]> => {
    // Pequeno delay artificial para dar sensação de processamento e permitir animação de loading
    await new Promise(resolve => setTimeout(resolve, 400));

    try {
        switch (categoryId) {
            // --- CATEGORIAS DE TI (TECH) ---
            case 'tech_prog':
                return (await import('./questions/tech_prog')).questions;
            case 'tech_logic':
                return (await import('./questions/tech_logic')).questions;
            case 'tech_db':
                return (await import('./questions/tech_db')).questions;
            case 'tech_network':
                return (await import('./questions/tech_network')).questions;
            case 'tech_eng':
                return (await import('./questions/tech_eng')).questions;
            case 'tech_cloud':
                return (await import('./questions/tech_cloud')).questions;
            case 'tech_sec':
                return (await import('./questions/tech_sec')).questions;
            case 'tech_concursos':
                return (await import('./questions/tech_concursos')).questions;

            // --- CATEGORIAS GERAIS ---
            case 'general':
                return generalQuestions; // Mantido estático como fallback rápido
            case 'pop':
                return (await import('./questions/pop')).questions;
            case 'history':
                return (await import('./questions/history')).questions;
            case 'sports':
                return (await import('./questions/sports')).questions;
            case 'enem':
                return (await import('./questions/enem')).questions;
            case 'env':
                return (await import('./questions/env')).questions;
            case 'math':
                return (await import('./questions/math')).questions;
            case 'influencers':
                return (await import('./questions/influencers')).questions;
            case 'art':
                return (await import('./questions/art')).questions;
            case 'cities':
                return (await import('./questions/cities')).questions;
            case 'tech_general':
                return (await import('./questions/tech_general')).questions;
            case 'myths':
                return (await import('./questions/myths')).questions;
            case 'music':
                return (await import('./questions/music')).questions;
            case 'health':
                return (await import('./questions/health')).questions;

            default:
                console.warn(`Arquivo de perguntas para '${categoryId}' ainda não criado. Usando Geral.`);
                return generalQuestions;
        }
    } catch (error) {
        console.error(`Erro ao carregar perguntas da categoria: ${categoryId}`, error);
        return generalQuestions; // Fallback de segurança
    }
};

// Fisher-Yates Shuffle (Algoritmo eficiente para embaralhar)
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const loadGameQuestions = async (categoryId: string, count: number = 9): Promise<QuizQuestion[]> => {
    const allQuestions = await getRawQuestions(categoryId);
    
    // Segurança para não quebrar se o arquivo tiver poucas perguntas
    if (!allQuestions || allQuestions.length === 0) return [];

    const shuffled = shuffleArray(allQuestions);
    return shuffled.slice(0, count);
};