import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hyd';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Rich, highly authentic translation dictionary for the whole application
const dictionary: Record<Language, Record<string, string>> = {
  en: {
    // Nav & General
    'nav.intro': 'What is AI',
    'nav.family': 'Family Tree',
    'nav.how': 'How It\'s Used',
    'nav.toolbox': 'AI Toolbox',
    'nav.deeper': 'Want to Go Deeper?',
    'nav.close': 'Deeper',
    'brand.title': 'Simple AI',
    'brand.slogan': 'AI, Explained Simply',
    'brand.desc': 'An interactive, beginner-safe editorial journal dedicated to demystifying modern artificial intelligence, machine learning structures, and generative algorithms through clean visual logic.',
    'brand.constructed': '© 2026 Simple AI. By Syed Shahnawaz.',

    // Hero Section
    'hero.badge': 'An Editorial Guide by Clay',
    'hero.title': 'AI is not magic. It’s pattern-matching at massive scale.',
    'hero.subtitle': 'No formulas, no math, and no confusing technical jargon. Just a calm, interactive walk through how computers learn to look at our world and make sense of it.',
    'hero.canvas.instruction': 'Hover nodes to reveal patterns',
    'hero.canvas.engine': 'Skeuo-tactile engine v1.0',
    'hero.button': 'Begin the Scroll Journey',

    // What Is AI Section
    'whatis.badge': 'Lesson 01',
    'whatis.title': 'So, What actually is AI?',
    'whatis.text': 'Artificial Intelligence — the capability of computer systems to perform tasks that historically required human thinking or reasoning — is not an independent thinking creature. Instead, it is a tool that detects recurring structures in huge sets of data.',
    'whatis.analogy.title': 'A Simple Analogy',
    'whatis.analogy.text': '"It’s just like teaching a child what a \'dog\' is. You don\'t hand them a legal brief explaining animal biology. You show them thousands of dogs in real life until their brain naturally links the floppy ears, tails, and sizes together."',
    'whatis.timeline.show': 'Explore AI Timeline',
    'whatis.timeline.hide': 'Hide AI Timeline',
    'whatis.pocket.title': 'AI in Your Pocket',
    'whatis.pocket.subtitle': 'You interact with automated pattern matching multiple times every day. Click to inspect standard use cases.',
    'whatis.pattern.title': 'The Pattern Matcher',
    'whatis.pattern.text': 'Data goes in, patterns are discovered, decisions come out.',

    // Clay Explainer Section
    'clay.badge': 'Featured Storyboard',
    'clay.title': 'Meet Clay: Your AI Explainer Host',
    'clay.subtitle': 'Based on our custom stop-motion turnaround reference, interact with Clay to hear and see his visual explanations.',
    'clay.interactive': 'This interactive showcase implements the tactile animation script designed for stop-motion video generation.',
    'clay.voice.active': 'Playing Voice...',
    'clay.voice.speak': 'Hear Clay Speak',
    'clay.sfx.muted': 'Mute Sound Effect',
    'clay.sfx.enabled': 'Sound Effects Enabled',
    'clay.shot.1.title': 'Shot 1: Meet Clay',
    'clay.shot.1.caption': 'AI means machines that learn from patterns — not magic.',
    'clay.shot.1.bubble': 'Hello there! I\'m Clay, your friendly guide. Tap the steps below to see how I explain AI!',
    'clay.shot.2.title': 'Shot 2: What is AI?',
    'clay.shot.2.caption': 'Instead of rigid hand-written rules, AI looks at examples to learn.',
    'clay.shot.2.bubble': 'Think of me as a little kid. If you show me thousands of leaf pictures, my brain figures out the pattern by itself!',
    'clay.shot.3.title': 'Shot 3: Everyday Use',
    'clay.shot.3.caption': 'Recommendations, voice assistants, and digital maps.',
    'clay.shot.3.bubble': 'You already use pattern-matching daily when Netflix recommends a movie, or Google Maps routes your car!',
    'clay.shot.4.title': 'Shot 4: Family Tree',
    'clay.shot.4.caption': 'AI is the broad umbrella. ML and Deep Learning sit nested inside.',
    'clay.shot.4.bubble': 'We are all nested together. Machine Learning lives inside AI, and Generative AI sits at the very heart of the tree!',

    // Family Tree Section
    'family.badge': 'Lesson 02',
    'family.title': 'The AI Family Tree',
    'family.subtitle': 'Artificial Intelligence isn\'t just one single technology. It\'s a nested hierarchy of concepts. Hover over the rings or click the cards below to see how they fit inside each other.',
    'family.depth.label': 'KNOW THE DEPTH',
    'family.interactive.hint': 'Click a card to highlight its position in the nested system.',
    
    // Generative AI Section
    'genai.badge': 'The Heart of the Tree',
    'genai.title': 'What makes Generative AI special?',
    'genai.subtitle': 'Traditional AI excels at analyzing, predicting, or sorting pre-existing data (e.g., identifying spam emails). Generative AI goes a step further: it creates brand-new, original content.',
    'genai.llm.badge': 'Large Language Model',
    'genai.llm.definition': 'A specific type of Generative AI model trained on massive oceans of written books, articles, and websites to predict the most logical next word in a sentence.',
    'genai.llm.explanation': 'It doesn\'t "know" facts like a human. It calculates probabilities. When you write a prompt, it answers by continuously asking itself: "Based on everything humanity has ever written, what is the most likely next word?"',
    'genai.chatbots.title': 'Chatbots vs. Models',
    'genai.chatbots.text': 'The underlying model (like Gemini) is the massive core calculation engine. The Chatbot (like Gemini Advanced) is just the chat window interface around it.',
    'genai.interactive.title': 'Dynamic Token Predicter',
    'genai.interactive.desc': 'Interactive Sandbox: See how an LLM predicts the next word word-by-word based on probability weights.',
    'genai.interactive.prompt': 'Click a prompt to begin:',
    'genai.interactive.weights': 'Calculated next token weights:',
    'genai.interactive.sentence': 'Sentence build:',

    // Prompting & RAG Section
    'prompt.badge': 'Lesson 03',
    'prompt.title': 'How to talk to AI: Prompting & RAG',
    'prompt.subtitle': 'You don\'t need to learn a programming language to use AI. You talk to it using prompts. But how do we ensure the answers are factual and specific?',
    'prompt.methods.title': 'Core Prompting Paradigms',
    'prompt.methods.desc': 'How we guide the AI engine to get precise outcomes.',
    'prompt.rag.title': 'Retrieval-Augmented Generation (RAG)',
    'prompt.rag.subtitle': 'The Factual Guardrail',
    'prompt.rag.desc': 'When you ask an AI a highly specific question, it might guess or hallucinate if it wasn\'t in its original training data. RAG solves this by looking up the correct documents first, then handing them to the AI to write the final summary.',
    'prompt.rag.step1': 'User Question',
    'prompt.rag.step2': 'Context Search',
    'prompt.rag.step3': 'Context Bound Prompt',
    'prompt.rag.step4': 'Accurate Summary',
    'prompt.interactive.title': 'RAG Simulator',
    'prompt.interactive.desc': 'Ask a question to see how RAG fetches live context to generate a factual answer, preventing AI hallucinations.',
    'prompt.interactive.ask': 'Pick a question to simulate:',
    'prompt.interactive.step1.lbl': '1. Raw Prompt',
    'prompt.interactive.step2.lbl': '2. Search DB',
    'prompt.interactive.step3.lbl': '3. RAG Context',
    'prompt.interactive.step4.lbl': '4. Safe Answer',

    // AI Toolbox Section
    'tools.badge': 'Curated Directory',
    'tools.title': 'The Free AI Toolbox',
    'tools.subtitle': 'A hand-picked collection of 40+ highly capable, genuinely free, or free-tier (freemium) AI systems. Cut through the noise and start experimenting immediately without opening your wallet.',
    'tools.search': 'Search tools, use cases, or tags...',
    'tools.bestfor': 'Best For',
    'tools.copy': 'Copy',
    'tools.copied': 'Copied',
    'tools.empty': 'No AI Tools found',
    'tools.empty.desc': 'Try resetting your filters or typing another query.',

    // Want to Go Deeper Section
    'deeper.badge': 'Lesson 04',
    'deeper.title': 'Want to Go Deeper?',
    'deeper.subtitle': 'Now that you have mastered the core concepts, let\'s explore the dynamic glossary, advanced topics, and future horizons of machine intelligence.',
    'deeper.glossary.title': 'Dynamic Glossary',
    'deeper.glossary.desc': 'Tap any highlighted term in the guide or browse the comprehensive index below for direct, friendly explanations.',
    'deeper.faq.title': 'Frequently Asked Questions',
    'deeper.roadmap.title': 'Advanced Horizons Roadmap',
    'deeper.roadmap.desc': 'From basic machine learning structures to autonomous digital agents. Tap a milestone to learn how the frontier works.',
    'deeper.roadmap.interactive': 'Click an horizon card to explore how modern digital agents think.',
    'deeper.close': 'Close Details'
  },
  hyd: {
    // Nav & General
    'nav.intro': 'AI kya hai',
    'nav.family': 'Khandaan',
    'nav.how': 'Istemaal',
    'nav.toolbox': 'AI Toolbox',
    'nav.deeper': 'Deedari / Deeper?',
    'nav.close': 'Deedari',
    'brand.title': 'Simple AI',
    'brand.slogan': 'Arey, AI Bole to Ekdam Asaan',
    'brand.desc': 'Ekdam naye logon ke waaste ek pyaara guide jo AI, machine learning, aur Generative AI ko asaan zabaan mein bina dimaag ki dahi kare samjhata hai.',
    'brand.constructed': '© 2026 Simple AI. Syed Shahnawaz ki taraf se.',

    // Hero Section
    'hero.badge': 'Clay ki taraf se ek pyaara guide',
    'hero.title': 'AI koi jaadu nahi hai yaaron. Ye bade paimane par pattern matching hai.',
    'hero.subtitle': 'Formula’aan, maths, aur mushkil words ki bilkul zaroorat nahi hai. Ekdum thanda aur pyaara tareeqa ye samajhne ka ki computer duniya ko kaisa dekhte aur samajhte hain.',
    'hero.canvas.instruction': 'Patterns dekhne ke waaste nodes pe mouse leke jaao',
    'hero.canvas.engine': 'Tactile Engine v1.0',
    'hero.button': 'Safar Shuru Karo Yaaron',

    // What Is AI Section
    'whatis.badge': 'Sabak 01',
    'whatis.title': 'Arey Yaaron, AI Bole to Asal mein kya hai?',
    'whatis.text': 'Artificial Intelligence (AI) bole to computer’aa ko dimaag dena — computer se aisi cheezein karwana jo dimaag wale hi kar sakte hain. Par ye koi asli insaan ke jaisa nahi sochta yaaron, ye bohot saare data mein se patterns dhoond leta hai.',
    'whatis.analogy.title': 'Ekdam Simple Misaal',
    'whatis.analogy.text': '"Arey bhai, ye bilkul bache ko billi ya kutte ki pehchaan seekhane ke jaisa hai. Tum usko kitaab padha ke biological details nahi samjhate. Tum usko hazaaro baar kutte dikhaate. Bache ka dimaag khud-ba-khud floppy ears, moochh aur dum ke patterns jod leta hai. Bas, computer bhi aise hi seekhta hai!"',
    'whatis.timeline.show': 'AI Timeline Dekho Yaaron',
    'whatis.timeline.hide': 'Timeline Chupao',
    'whatis.pocket.title': 'Roz ka AI Istemaal',
    'whatis.pocket.subtitle': 'Hum roz bohot saari jagah pattern matching dekhte hain. Ek baar neeche click karke check karo yaaron.',
    'whatis.pattern.title': 'Pattern Pehchanne Wala',
    'whatis.pattern.text': 'Pehle data andar jaata, phir patterns dhoond ke, seedha faisla bahar aata!',

    // Clay Explainer Section
    'clay.badge': 'Khaas Kahani',
    'clay.title': 'Clay se milo: Tumhara AI samjhane wala dost',
    'clay.subtitle': 'Humare stop-motion animation ke tareeqe par, Clay se baat karke uske asaan ishaare aur baataan suno.',
    'clay.interactive': 'Ye cheez stop-motion video ke liye banaye so animation script par kaam karti hai.',
    'clay.voice.active': 'Awaaz chalri hai...',
    'clay.voice.speak': 'Clay ki Awaaz Suno',
    'clay.sfx.muted': 'Sound band karo',
    'clay.sfx.enabled': 'Sound chalu hai',
    'clay.shot.1.title': 'Scene 1: Clay se Milo',
    'clay.shot.1.caption': 'AI bole to aisi machines jo patterns se seekhte hain — jaadu nahi.',
    'clay.shot.1.bubble': 'Arey salaam yaaron! Main hoon Clay, tumhara apna dost. Neeche ke steps dabba ke dekho main AI kaisa samjhata hoon!',
    'clay.shot.2.title': 'Scene 2: AI kya hai?',
    'clay.shot.2.caption': 'Likhe so rules pe chalne ke bajaye, AI khud examples dekh ke seekh leta hai.',
    'clay.shot.2.bubble': 'Mujhe ek chota bacha samjho. Agar tum mujhe hazaaro patton ki photo’aan dikhaaye, to mera dimaag khud-ba-khud samajh jaata!',
    'clay.shot.3.title': 'Scene 3: Roz ka Istemaal',
    'clay.shot.3.caption': 'Recommendations, voice assistants, aur digital maps.',
    'clay.shot.3.bubble': 'Tum roz pattern-matching use karte yaaron, jab Netflix tumhein film bolta ya Google Maps rasta batata!',
    'clay.shot.4.title': 'Scene 4: Khandaan ki kahani',
    'clay.shot.4.caption': 'AI bada chhatra hai. ML aur Deep Learning iske andar rehte hain.',
    'clay.shot.4.bubble': 'Hum sab ek hi khandaan ke hain. Machine Learning AI ke andar rehta, aur Generative AI is jhaad ke bilkul dil mein hai!',

    // Family Tree Section
    'family.badge': 'Sabak 02',
    'family.title': 'AI ka Khandaan (Family Tree)',
    'family.subtitle': 'AI koi akeli cheez nahi hai, iske andar bohot saare dabba-in-dabba concepts hain. Neeche ke rings pe mouse ghumaao ya cards dabaake check karo.',
    'family.depth.label': 'KHANDAAN KI GAHRAI',
    'family.interactive.hint': 'Card pe click karo aur dekho rings mein iski kya jagah hai.',

    // Generative AI Section
    'genai.badge': 'Jhaad ka bilkul dil',
    'genai.title': 'Generative AI mein aisi kya khaas baat hai?',
    'genai.subtitle': 'Pehle ka AI khali cheezon ko pehchanne ya classify karne mein ustad tha. Lekin Generative AI ek qadam aage hai: ye poori nayi cheez paida kar deta hai!',
    'genai.llm.badge': 'Large Language Model (LLM)',
    'genai.llm.definition': 'AI ka ek aisa khaas model jisko duniya jahan ki kitaabein, articles aur websites pilake seekhaye, taaki wo agla lafz predict kar sake.',
    'genai.llm.explanation': 'Isko hamare jaisa hosh-o-hawaas nahi hota yaaron, ye khali probability check karta hai. Jab tum kuch poochte, ye apne dimaag mein sochte rehta ki: "Duniya ke saare likhe so kitaabon ke mutabiq, agla sabse behtar word kya hona chahiye?"',
    'genai.chatbots.title': 'Chatbots aur Models mein kya farq hai?',
    'genai.chatbots.text': 'Asal model (jaise Gemini) piche baith ke saari calculation karne wala engine hai. Aur chatbot khali wo chat window hai jismein tum likhte.',
    'genai.interactive.title': 'Dynamic Token Predicter (Sandbox)',
    'genai.interactive.desc': 'Interactive Sandbox: Dekho ek LLM kaisa ek ek word ko unke probability weights ke mutabiq chun ke sentence banata hai.',
    'genai.interactive.prompt': 'Shuru karne ke waaste ek prompt dabbao:',
    'genai.interactive.weights': 'Agla word chunne ki probability:',
    'genai.interactive.sentence': 'Banra so sentence:',

    // Prompting & RAG Section
    'prompt.badge': 'Sabak 03',
    'prompt.title': 'AI se baat karna seekho: Prompting & RAG',
    'prompt.subtitle': 'AI chalane ke waaste coding seekhne ki zaroorat nahi hai yaaron. Khali sahi tareeqe se prompt likhna kaafi hai. Lekin jawaab sach aur dhang ka kaisa aaye?',
    'prompt.methods.title': 'Prompting ke tareeqe',
    'prompt.methods.desc': 'Sahi nateeja paane ke waaste AI engine ko hum kaisa rasta dikhate hain.',
    'prompt.rag.title': 'Retrieval-Augmented Generation (RAG)',
    'prompt.rag.subtitle': 'Sach bolne ki boundary',
    'prompt.rag.desc': 'AI se jab koi bohot andar ki ya nayi baat poochte, to wo jhoot bol sakta hai (hallucination). RAG iska ilaaj hai. Ye pehle sahi documents dhoond ke lata hai, phir AI ko bolta hai ki "Dekh bhai, ye document padh aur isme se hi jawaab bana!"',
    'prompt.rag.step1': 'Aapka Sawaal',
    'prompt.rag.step2': 'Context ki Khoj',
    'prompt.rag.step3': 'Context Bound Prompt',
    'prompt.rag.step4': 'Sahi Jawaab',
    'prompt.interactive.title': 'RAG Simulator',
    'prompt.interactive.desc': 'Ek sawaal chun ke dekho RAG kaisa sacha context dhoond ke lata hai aur jhoot bolne se rokta hai.',
    'prompt.interactive.ask': 'Simulate karne ke liye sawaal dabbao:',
    'prompt.interactive.step1.lbl': '1. Raw Prompt (Sawaal)',
    'prompt.interactive.step2.lbl': '2. Search DB (Talaash)',
    'prompt.interactive.step3.lbl': '3. RAG Context (Pukhta Proof)',
    'prompt.interactive.step4.lbl': '4. Safe Answer (Pakka Jawaab)',

    // AI Toolbox Section
    'tools.badge': 'Behtareen Directory',
    'tools.title': 'Mufat AI Toolbox',
    'tools.subtitle': '40+ se zyada ekdam asli aur mufat chalne wale AI tools ka khazana yaaron. Khali explore karo aur dabba ke chalana shuru karo.',
    'tools.search': 'Tools, use cases ya tags talaash karo...',
    'tools.bestfor': 'Kiske liye behtar hai',
    'tools.copy': 'Copy',
    'tools.copied': 'Copied!',
    'tools.empty': 'Koi tool nahi mila yaaron',
    'tools.empty.desc': 'Filtres badal ke ya kuch aur likh ke search karo.',

    // Want to Go Deeper Section
    'deeper.badge': 'Sabak 04',
    'deeper.title': 'Aur gehri baat samajhna hai?',
    'deeper.subtitle': 'Ab jab tum poore basics seekh gaye yaaron, chalo advanced topics, glossary aur AI ke aane wale kal ko dekhte hain.',
    'deeper.glossary.title': 'Glossary (Mushkil Alfaaz)',
    'deeper.glossary.desc': 'Koi bhi highlighted word pe tap karo ya neeche ka index check karo humari asaan zabaan mein samajhne ke liye.',
    'deeper.faq.title': 'Aam Poochhe Jane Wale Sawaalaat (FAQ)',
    'deeper.roadmap.title': 'Advanced Horizons Roadmap',
    'deeper.roadmap.desc': 'Ekdam sadhe algorithms se leke khud-ba-khud kaam karne wale AI Agents tak. Milestone pe click karke seekho.',
    'deeper.roadmap.interactive': 'Horizons card pe click karke dekho naye AI agents kaisa sochte hain.',
    'deeper.close': 'Details Band Karo'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved === 'hyd' ? 'hyd' : 'en') as Language;
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const t = (key: string): string => {
    return dictionary[lang][key] || dictionary['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
