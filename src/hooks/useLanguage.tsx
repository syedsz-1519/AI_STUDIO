import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hyd' | 'tel';

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
  },
  tel: {
    // Nav & General
    'nav.intro': 'AI అంటే ఏమిటి',
    'nav.family': 'కుటుంబ వృక్షం',
    'nav.how': 'ఎలా ఉపయోగించబడుతుంది',
    'nav.toolbox': 'AI టూల్‌బాక్స్',
    'nav.deeper': 'మరింత లోతుగా తెలుసుకోవాలా?',
    'nav.close': 'లోతుగా',
    'brand.title': 'Simple AI',
    'brand.slogan': 'AI, సరళంగా వివరించబడింది',
    'brand.desc': 'AI, మెషిన్ లర్నింగ్ మరియు జెనరేటివ్ అల్గోరిథమ్‌లను సరళమైన విధానంలో వివరించడానికి రూపొందించిన ఇంటరాక్టివ్ గైడ్.',
    'brand.constructed': '© 2026 Simple AI. సయ్యద్ షాహ్‌నవాజ్ చేత.',

    // Hero Section
    'hero.badge': 'Clay చేత సంపూర్ణ గైడ్',
    'hero.title': 'AI జాదూ కాదు. ఇది భారీ స్థాయిలో నమూనా సరిపోలడం.',
    'hero.subtitle': 'సూత్రాలు లేవు, గణితం లేవు, గందరగోళ పదజాలం లేవు. కంప్యూటర్‌లు మన ప్రపంచాన్ని ఎలా చూసి అర్థం చేసుకుంటాయో తెలుసుకోవడానికి ఆరామదాయకమైన మరియు ఇంటరాక్టివ్ పద్ధతి.',
    'hero.canvas.instruction': 'నమూనాలను చూడటానికి నోడ్‌ల మీద సరదాలు గర్రకండి',
    'hero.canvas.engine': 'స్పర్శ ఇంజిన్ v1.0',
    'hero.button': 'స్క్రోల్ ప్రయాణం ప్రారంభించండి',

    // What Is AI Section
    'whatis.badge': 'పాఠం 01',
    'whatis.title': 'కాబట్టి, AI నిజానికి ఏమిటి?',
    'whatis.text': 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ — మానవ ఆలోచన లేదా తార్కికతను అవసరమైన పనులను కంప్యూటర్ సిస్టమ్‌లు నిర్వహించే సామర్థ్యం — ఒక స్వతంత్ర ఆలోచనపూర్వక జీవి కాదు. బదులుగా, ఇది భారీ డేటా సెట్‌లలో పునరావృత నిర్మాణాలను గుర్తించే సాధనం.',
    'whatis.analogy.title': 'సరళ సారూప్యత',
    'whatis.analogy.text': '"ఇది ఒక పిల్లవానికి \'కుక్క\' అంటే ఏమిటో చెప్పటం లాంటిది. మీరు వారికి జీవశాస్త్ర చట్టం ఇవ్వరు. మీరు వారికి వేలాది కుక్కలను చూపిస్తారు, అప్పుడు వారి మెదడు సహజంగా ఫ్లాపీ చెవులు, తోక లు మరియు పరిమాణాలను సంబంధం కుంటుంది."',
    'whatis.timeline.show': 'AI కాలక్రమం అన్వేషించండి',
    'whatis.timeline.hide': 'AI కాలక్రమం దాచండి',
    'whatis.pocket.title': 'మీ జేబులో AI',
    'whatis.pocket.subtitle': 'మీరు ప్రతిదిన అనేక సార్లు స్వయంచాలక నమూనా సరిపోలడాన్ని సంప్రదిస్తారు. ప్రామాణిక ఉపయోగ కేసుల కోసం క్లిక్ చేయండి.',
    'whatis.pattern.title': 'నమూనా మ్యాచర్',
    'whatis.pattern.text': 'డేటా లోపలికి వెళ్తుంది, నమూనాలు కనుగొనబడతాయి, నిర్ణయాలు బయటకు రావడం.',

    // Clay Explainer Section
    'clay.badge': 'ఫీచర్ స్టోరీబోర్డ్',
    'clay.title': 'Clay ని కలుసుకోండి: మీ AI ఎక్సప్లెయినర్ హోస్ట్',
    'clay.subtitle': 'మా కస్టమ్ స్టాప్-మోషన్ టర్నరౌండ్ రిఫరెన్స్ ఆధారంగా, Clay తో సంభాషించండి మరియు అతని విజువల్ వివరణలను విన్నారు.',
    'clay.interactive': 'ఈ ఇంటరాక్టివ్ ప్రదర్శన స్టాప్-మోషన్ వీడియో ఉత్పత్తి కోసం రూపొందించిన స్పర్శ యానిమేషన్ స్క్రిప్ట్‌ను ఉపయోగిస్తుంది.',
    'clay.voice.active': 'వాయిస్ ప్లేయింగ్...',
    'clay.voice.speak': 'Clay ఎండ లెట్‌లు విన్నారు',
    'clay.sfx.muted': 'సౌండ్ ఎఫెక్ట్ మ్యూట్ చేయండి',
    'clay.sfx.enabled': 'సౌండ్ ఎఫెక్ట్‌లు చేతనం చేయబడ్డాయి',
    'clay.shot.1.title': 'ショット 1: Clay ని కలుసుకోండి',
    'clay.shot.1.caption': 'AI అంటే నమూనాల నుండి నేర్చుకునే యంత్రాలు — జాదూ కాదు.',
    'clay.shot.1.bubble': 'హలో! నేను Clay, మీ స్నేహపూర్వక గైడ్. ఎలా AI వివరణ చేస్తానో చూడటానికి దిగువ దశలను నొక్కండి!',
    'clay.shot.2.title': 'ショット 2: AI అంటే ఏమిటి?',
    'clay.shot.2.caption': 'కఠిన చేతి-వ్రాసిన నియమాలకు బదులుగా, AI ఉదాహరణల నుండి నేర్చుకుంటుంది.',
    'clay.shot.2.bubble': 'నన్ను చిన్న పిల్లవిగా భావించండి. మీరు నాకు వేలాది ఆకు చిత్రాలను చూపిస్తే, నా మెదడు నమూనాను తానుగా గుర్తిస్తుంది!',
    'clay.shot.3.title': 'ショット 3: రోజువారీ ఉపయోగం',
    'clay.shot.3.caption': 'సిఫారసులు, వాయిస్ సహాయకులు మరియు డిజిటల్ మ్యాప్‌లు.',
    'clay.shot.3.bubble': 'Netflix సిനిమా సిఫారసు చేసినప్పుడు లేదా Google Maps మీ కారును నిర్దేశించినప్పుడు మీరు ప్రతిదిన నమూనా సరిపోలడం ఉపయోగిస్తారు!',
    'clay.shot.4.title': 'ショット 4: కుటుంబ వృక్షం',
    'clay.shot.4.caption': 'AI విస్తృత గొడుగు. ML మరియు డీప్ లర్నింగ్ దానిలో నిండి ఉన్నాయి.',
    'clay.shot.4.bubble': 'మేము సానుకూలంగా ఒకేచోట కూర్చున్నాము. మెషిన్ లర్నింగ్ AI లో నివసిస్తుంది, మరియు జెనరేటివ్ AI చెట్టు యొక్క గుండె వద్ద కూర్చోబడుతుంది!',

    // Family Tree Section
    'family.badge': 'పాఠం 02',
    'family.title': 'AI కుటుంబ వృక్షం',
    'family.subtitle': 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ కేవలం ఒక్క సాంకేతికత కాదు. ఇది భావనల యొక్క గూడు చేసిన సోపానక్రమం. క్రింద సూచన నుండి చుట్టూ సరదాలు గర్రకండి లేదా కార్డ్‌లను క్లిక్ చేయండి.',
    'family.depth.label': 'లోతు తెలుసుకోండి',
    'family.interactive.hint': 'ఒక కార్డ్ నీ సూచన సిస్టెమ్‌లో దాని స్థానాన్ని హైలైట్ చేయడానికి నొక్కండి.',
    
    // Generative AI Section
    'genai.badge': 'చెట్టు యొక్క గుండె',
    'genai.title': 'జెనరేటివ్ AI లో ఏ వేధకు ఉంది?',
    'genai.subtitle': 'ప్రారంభిక AI విశ్లేషణ, ప్రవచనం లేదా సమూహీకరణలో సముపదర్శకమైనది (ఉదా., స్పామ్ ఇమెయిల్‌లను గుర్తించడం). జెనరేటివ్ AI ఒక దశ ముందుకు వెళ్తుంది: ఇది సంపూర్ణ నూతన, అసలు కంటెంట్ సృష్టిస్తుంది.',
    'genai.llm.badge': 'భాషా నమూనా',
    'genai.llm.definition': 'జెనరేటివ్ AI యొక్క నిర్దిష్ట రకం నమూనా, వాక్యంలో తరువాతి సంభావ్య పదాన్ని సూచించడానికి భారీ రచన, వ్యాసాలు మరియు వెబ్‌సైట్‌లపై శిక్షణ పొందింది.',
    'genai.llm.explanation': 'ఇది మానవులిలా "జ్ఞానం" కలిగి లేదు. ఇది సంభావ్యతలను లెక్కిస్తుంది. మీరు ప్రామాణికతను వ్రాసినప్పుడు, ఇది నిరంతరం తనను తాను ప్రశ్నిస్తూ సమాధానం ఇస్తుంది: "మానవత్వం ఎప్పుడూ వ్రాసిన విషయం ఆధారంగా, అతి తరువాతి పదం ఏమిటి?"',
    'genai.chatbots.title': 'చాట్‌బాట్‌లు vs. నమూనాలు',
    'genai.chatbots.text': 'అంతర్లీన నమూనా (Gemini మాదిరిగా) భారీ కోర్ లెక్కింపు ఇంజిన్. చాట్‌బాట్ (Gemini Advanced మాదిరిగా) దాని చుట్టూ చాట్ విండో ఇంటర్‌ఫేస్.',
    'genai.interactive.title': 'డైనమిక్ టోకెన్ ప్రిడిక్టర్',
    'genai.interactive.desc': 'ఇంటరాక్టివ్ సాండ్‌బాక్స్: LLM సంభావ్యత బరువుల ఆధారంగా పదం-చేత-పదం తరువాతి పదాన్ని ఎలా సూచిస్తుందో చూడండి.',
    'genai.interactive.prompt': 'ప్రారంభించటానికి ఒక ప్రామాణికతను నొక్కండి:',
    'genai.interactive.weights': 'కంప్యూట్ చేయబడిన తరువాతి టోకెన్ బరువులు:',
    'genai.interactive.sentence': 'వాక్య నిర్మాణం:',

    // Prompting & RAG Section
    'prompt.badge': 'పాఠం 03',
    'prompt.title': 'AI కు ఎలా మాట్లాడాలి: ప్రామాణికత & RAG',
    'prompt.subtitle': 'AI ఉపయోగించటానికి మీరు ప్రోగ్రామింగ్ భాష నేర్చుకోవలసిన అవసరం లేదు. మీరు ప్రామాణికతలను ఉపయోగించి దానితో మాట్లాడుకుంటారు. కానీ సమాధానాలు కారకమైనవి మరియు కచ్చితమైనవిగా నిర్ధారించటానికి ఎలా చేస్తాము?',
    'prompt.methods.title': 'ప్రామాణికత నిర్దేశాలు',
    'prompt.methods.desc': 'మేము AI ఇంజిన్‌ను ఖచ్చితమైన ఫలితాలను పొందేందుకు ఎలా సూచిస్తాము.',
    'prompt.rag.title': 'పరిశోధన-వృద్ధి జెనరేషన్ (RAG)',
    'prompt.rag.subtitle': 'కారకమైన రక్షణ',
    'prompt.rag.desc': 'మీరు AI కు అत్యంత నిర్దిష్ట ప్రశ్న అడిగినప్పుడు, అది ఊహించవచ్చు లేదా దాని అసలు శిక్షణ డేటాలో లేకుంటే హాలూసినేట్ చేయవచ్చు. RAG దీనిని పరిష్కరిస్తుంది, సరైన డాక్యుమెంట్‌లను మొదట చూసి తర్వాత AI కు సారాంశం రాయటానికి ఇస్తుంది.',
    'prompt.rag.step1': 'వినియోగదారు ప్రశ్న',
    'prompt.rag.step2': 'సందర్భం చేసిన',
    'prompt.rag.step3': 'సందర్భం సీమిత ప్రామాణికత',
    'prompt.rag.step4': 'ఖచ్చితమైన సారాంశం',
    'prompt.interactive.title': 'RAG నిమిషం',
    'prompt.interactive.desc': 'ప్రశ్న అడగటానికి RAG లైవ్ సందర్భం ఎలా పరిశీలిస్తుందో చూడటానికి కారకమైన సమాధానం ఉత్పత్తి చేస్తుంది, AI హాలూసినేషన్‌లను నిరోధిస్తుంది.',
    'prompt.interactive.ask': 'పదోపదిని నిమిషం చేయటానికి ఆయచిన్‌చేయండి:',
    'prompt.interactive.step1.lbl': '1. ముడి ప్రామాణికత',
    'prompt.interactive.step2.lbl': '2. డేటాబేస్ చేసిన',
    'prompt.interactive.step3.lbl': '3. RAG సందర్భం',
    'prompt.interactive.step4.lbl': '4. సురక్షితమైన సమాధానం',

    // AI Toolbox Section
    'tools.badge': 'కిరాతీ జాబితా',
    'tools.title': 'ఉచిత AI టూల్‌బాక్స్',
    'tools.subtitle': '40+ చాలా సామర్థ్యవంతమైన, నిజమైన ఉచితమైన లేదా ఉచిత-నమూనా (freemium) AI సిస్టమ్‌ల చేతిపై ఎంపిక చేసిన సంకలనం. శబ్దం తగ్గించండి మరియు మీ వాలెట్‌ను తెరవకుండా వెంటనే ప్రయోగం చేయటం ప్రారంభించండి.',
    'tools.search': 'సాధనాలు, ఉపయోగ సందర్భాలు లేదా ట్యాగ్‌ల కోసం చేసిన...',
    'tools.bestfor': 'కోసం సఠిక',
    'tools.copy': 'Copy',
    'tools.copied': 'నకల్',
    'tools.empty': 'ఏ AI సాధనాలు కనుగొనబడలేదు',
    'tools.empty.desc': 'మీ ఫిల్టర్‌లను రీసెట్ చేయటం లేదా ఇతర ప్రశ్న చేయటం ప్రయత్నించండి.',

    // Want to Go Deeper Section
    'deeper.badge': 'పాఠం 04',
    'deeper.title': 'లోతుగా తెలుసుకోవాలా?',
    'deeper.subtitle': 'ఇప్పుడు మీరు ప్రధాన భావనలను నిలువు చేసారు, అందుకు గ్రంథ, అధునాతన విషయాలు మరియు యంత్ర తెలివి యొక్క భవిష్యత దిగంజన్‌ను అన్వేషిద్దాం.',
    'deeper.glossary.title': 'డైనమిక్ గ్లోసరీ',
    'deeper.glossary.desc': 'ఏదైనా హైలైట్ చేయబడిన పదం చేసిన ట్యాప్ చేయండి లేదా సర్వ సూచన కోసం క్రింద చూడండి ప్రత్యక్ష, స్నేహపూర్వక వివరణల కోసం.',
    'deeper.faq.title': 'తరచుగా అడిగిన ప్రశ్నలు',
    'deeper.roadmap.title': 'అధునాతన దిగంజన్‌ రోడ్‌మ్యాప్',
    'deeper.roadmap.desc': 'స్థూల యంత్ర లర్నింగ్ నిర్మాణాల నుండి స్వయంచాలక డిజిటల్ ఏజెంట్‌ల వరకు. ఫ్రంటియర్ ఎలా పనిచేస్తుందో తెలుసుకోవటానికి ఒక ఇతిహాస చేసిన.',
    'deeper.roadmap.interactive': 'ఆధునిక డిజిటల్ ఏజెంట్‌లు ఎలా ఆలోచిస్తాయో తెలుసుకోవటానికి ఒక చిత్ర చేసిన.',
    'deeper.close': 'వివరణలను మూసివేయండి'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    if (saved === 'hyd' || saved === 'tel') return saved as Language;
    return 'en' as Language;
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
