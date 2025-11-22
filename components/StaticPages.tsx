import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Phone, Mail, CheckCircle, Cpu, Printer, Globe, Palette } from 'lucide-react';

interface PageProps {
    onBack: () => void;
}

export const AboutPage: React.FC<PageProps> = ({ onBack }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full p-6 max-w-2xl mx-auto"
    >
        <button onClick={onBack} className="flex items-center text-neon mb-6 font-bold">
            <ChevronLeft className="mr-1" /> Voltar
        </button>
        
        <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">Sobre o <span className="text-neon drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">NeonQuiz Hub</span></h1>
        <div className="w-16 h-1 bg-neon mb-6 rounded-full shadow-neon"></div>
        
        <div className="space-y-6 text-gray-300 leading-relaxed">
            <p>
                O <strong className="text-white">NeonQuiz Hub</strong> nasceu para tornar o aprendizado, o desafio e a diversão acessíveis a todos, em qualquer lugar. Aqui, tecnologia e criatividade se conectam para criar quizzes envolventes, rápidos e sempre atualizados com os temas mais quentes do momento.
            </p>
            <p>
                Nossa missão é proporcionar uma experiência de quiz vibrante, personalizada e 100% interativa — estimulando a curiosidade, o raciocínio e a troca de conhecimento, seja para quem quer aprender, se preparar para provas ou apenas se divertir.
            </p>
            <p>
                Do estudante ao autodidata, do curioso ao competidor: todo mundo encontra seu espaço no NeonQuiz Hub. Sinta a vibe neon e descubra novos desafios a cada acesso!
            </p>
        </div>

        <div className="mt-10 p-6 border border-neon/30 rounded-xl bg-surface/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-neon/10 blur-3xl rounded-full"></div>
            <h2 className="text-xl font-bold text-white mb-4">Créditos</h2>
            <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center"><span className="w-2 h-2 bg-neon rounded-full mr-2"></span>DL SERVICE</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-neon rounded-full mr-2"></span>Developer: Daniel S. Farias</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-neon rounded-full mr-2"></span>Contato: (96) 99125-6601</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-neon rounded-full mr-2"></span>E-mail: servicecontatoap@gmail.com</li>
            </ul>
        </div>
    </motion.div>
);

export const ServicesPage: React.FC<PageProps> = ({ onBack }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full p-6 max-w-2xl mx-auto"
    >
        <button onClick={onBack} className="flex items-center text-neon mb-6 font-bold">
            <ChevronLeft className="mr-1" /> Voltar
        </button>

        <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-white mb-2">DL SERVICE</h1>
            <p className="text-neon font-medium tracking-widest uppercase text-sm">Tecnologia que resolve. Simples Assim.</p>
        </div>

        <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-sm italic border-l-4 border-neon pl-4">
                A DL Service é um serviço de tecnologia completo, moderno e confiável. Quem cuida de tudo por aqui é Daniel S. Farias, especialista em manutenção, desenvolvimento e suporte em TI.
            </p>

            <h2 className="text-xl font-bold text-white mt-8 flex items-center"><span className="text-neon mr-2">🚀</span> Serviços Disponíveis</h2>
            
            <div className="grid grid-cols-1 gap-4 mt-4">
                <ServiceCard 
                    icon={<Cpu size={20} />}
                    title="Manutenção e Suporte"
                    items={['Reparo de computadores e notebooks', 'Limpeza, formatação, otimização', 'Upgrades (RAM, SSD, HD)', 'Montagem de PC']}
                />
                <ServiceCard 
                    icon={<Printer size={20} />}
                    title="Impressoras"
                    items={['Instalação e configuração', 'Especialista em Epson L3250', 'Alinhamento e manutenção']}
                />
                <ServiceCard 
                    icon={<Globe size={20} />}
                    title="Desenvolvimento Web"
                    items={['Sites modernos, responsivos', 'Frontend, backend', 'Portfólios e Landing Pages']}
                />
                <ServiceCard 
                    icon={<Palette size={20} />}
                    title="Artes Digitais"
                    items={['Artes para redes sociais', 'Materiais multimídia', 'Conteúdo gráfico']}
                />
                 <ServiceCard 
                    icon={<CheckCircle size={20} />}
                    title="Atendimento em TI"
                    items={['Instalação de software', 'Assistência remota', 'Otimização de sistemas']}
                />
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-neon/20 to-transparent rounded-xl border border-neon/50 text-center">
                <h3 className="text-lg font-bold text-white mb-2">Precisa de ajuda?</h3>
                <p className="text-sm mb-4">Atendimento rápido e direto.</p>
                <a href="https://wa.me/5596991256601" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-6 py-3 bg-neon text-white font-bold rounded-full shadow-neon hover:scale-105 transition-transform">
                    <Phone size={18} className="mr-2" /> (96) 99125-6601
                </a>
            </div>
        </div>
    </motion.div>
);

const ServiceCard = ({ icon, title, items }: { icon: React.ReactNode, title: string, items: string[] }) => (
    <div className="bg-surface border border-white/10 p-4 rounded-lg hover:border-neon/50 transition-colors">
        <div className="flex items-center mb-3 text-neon">
            {icon}
            <h3 className="font-bold text-white ml-2">{title}</h3>
        </div>
        <ul className="space-y-1">
            {items.map((item, idx) => (
                <li key={idx} className="text-xs text-gray-400 flex items-start">
                    <span className="mr-2 text-neon">•</span> {item}
                </li>
            ))}
        </ul>
    </div>
);
