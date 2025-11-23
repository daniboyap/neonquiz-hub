
import { questions as tech_logic } from './data/questions/tech_logic';
import { questions as tech_db } from './data/questions/tech_db';
import { questions as tech_network } from './data/questions/tech_network';
import { questions as tech_prog } from './data/questions/tech_prog';
import { questions as tech_eng } from './data/questions/tech_eng';
import { questions as tech_cloud } from './data/questions/tech_cloud';
import { questions as tech_sec } from './data/questions/tech_sec';
import { questions as tech_concursos } from './data/questions/tech_concursos';
import { questions as general } from './data/questions/general';
import { questions as pop } from './data/questions/pop';
import { questions as history } from './data/questions/history';
import { questions as sports } from './data/questions/sports';
import { questions as enem } from './data/questions/enem';
import { questions as env } from './data/questions/env';
import { questions as influencers } from './data/questions/influencers';
import { questions as art } from './data/questions/art';
import { questions as cities } from './data/questions/cities';
import { questions as tech_general } from './data/questions/tech_general';
import { questions as myths } from './data/questions/myths';
import { questions as music } from './data/questions/music';
import { questions as health } from './data/questions/health';
import { questions as math } from './data/questions/math';

const categories = [
    { name: 'tech_logic', questions: tech_logic },
    { name: 'tech_db', questions: tech_db },
    { name: 'tech_network', questions: tech_network },
    { name: 'tech_prog', questions: tech_prog },
    { name: 'tech_eng', questions: tech_eng },
    { name: 'tech_cloud', questions: tech_cloud },
    { name: 'tech_sec', questions: tech_sec },
    { name: 'tech_concursos', questions: tech_concursos },
    { name: 'general', questions: general },
    { name: 'pop', questions: pop },
    { name: 'history', questions: history },
    { name: 'sports', questions: sports },
    { name: 'enem', questions: enem },
    { name: 'env', questions: env },
    { name: 'influencers', questions: influencers },
    { name: 'art', questions: art },
    { name: 'cities', questions: cities },
    { name: 'tech_general', questions: tech_general },
    { name: 'myths', questions: myths },
    { name: 'music', questions: music },
    { name: 'health', questions: health },
    { name: 'math', questions: math },
];

console.log('--- Verification Results ---');
categories.forEach(cat => {
    console.log(`${cat.name}: ${cat.questions.length} questions`);
});
console.log('----------------------------');
