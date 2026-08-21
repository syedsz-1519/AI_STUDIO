import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage, type Language } from '../hooks/useLanguage';
import { 
  Languages, 
  X, 
  Check, 
  Search, 
  Sparkles, 
  Globe, 
  Heart, 
  School, 
  Layers, 
  Compass,
  Info
} from 'lucide-react';

interface IndianLanguageItem {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  region: string;
  category: 'live' | 'southern' | 'northern' | 'classical_tribal';
  status: 'LIVE' | 'BETA' | 'SCHEDULED';
  tag: string;
  welcomePhrase: string;
  description: string;
}

const INDIAN_LANGUAGES: IndianLanguageItem[] = [
  // 1. LIVE & ACTIVE
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (Original)',
    script: 'Latin',
    region: 'Global / Standard',
    category: 'live',
    status: 'LIVE',
    tag: 'EN',
    welcomePhrase: 'Welcome to Clayverse AI! AI explained simply.',
    description: 'Complete 9-chapter interactive curriculum with audio & simulations.'
  },
  {
    code: 'hyd',
    name: 'Hyderabadi Urdu',
    nativeName: 'دکنی اردو / హైదరాబాదీ',
    script: 'Perso-Arabic / Telugu',
    region: 'Telangana, Deccan & Madrasa Outreach',
    category: 'live',
    status: 'LIVE',
    tag: 'HYD',
    welcomePhrase: 'Arey salaam yaaron! AI seekhna ab bilkul asaan hai.',
    description: 'Grassroots Deccani idiom & Madrasa outreach edition — zero math jargon.'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'తెలుగు లిపి',
    region: 'Andhra Pradesh & Telangana',
    category: 'southern',
    status: 'LIVE',
    tag: 'TEL',
    welcomePhrase: 'స్వాగతం! AI ని మీ మాతృభాషలో సులభంగా నేర్చుకోండి.',
    description: 'Full South-Central Dravidian localization across all core lessons.'
  },

  // 2. SOUTHERN (DRAVIDIAN)
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'தமிழ் வரிவடிவம்',
    region: 'Tamil Nadu & Puducherry',
    category: 'southern',
    status: 'BETA',
    tag: 'TAM',
    welcomePhrase: 'வணக்கம்! செயற்கை நுண்ணறிவை எளிய முறையில் கற்றுக்கொள்ளுங்கள்.',
    description: 'Dravidian classical lineage — regional AI glossary in preview.'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'ಕನ್ನಡ ಲಿಪಿ',
    region: 'Karnataka',
    category: 'southern',
    status: 'BETA',
    tag: 'KAN',
    welcomePhrase: 'ನಮಸ್ಕಾರ! ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆಯನ್ನು ಸುಲಭವಾಗಿ ಕಲಿಯಿರಿ.',
    description: 'Karnataka tech hub vernacular outreach edition in active testing.'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'മലയാള ലിപി',
    region: 'Kerala & Lakshadweep',
    category: 'southern',
    status: 'BETA',
    tag: 'MAL',
    welcomePhrase: 'നമസ്കാരം! എഐ ലളിതമായി പഠിക്കാം.',
    description: 'High-literacy digital vernacular curriculum in progress.'
  },
  {
    code: 'tcy',
    name: 'Tulu',
    nativeName: 'ತುಳು (Tulu)',
    script: 'ಕನ್ನಡ / ತುಳು లిಪಿ',
    region: 'Coastal Karnataka & Northern Kerala',
    category: 'southern',
    status: 'SCHEDULED',
    tag: 'TUL',
    welcomePhrase: 'ಸೊಲ್ಮೆಲು! AI ಕಲ್ಪನೆನ್ ಸುಲಭವಾದ್ ತೆರಿಯೊನ್ಲೆ.',
    description: 'Coastal Dravidian heritage dialect assistance.'
  },

  // 3. NORTHERN & CENTRAL (INDO-ARYAN)
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'देवनागरी',
    region: 'Pan-Northern & Central India',
    category: 'northern',
    status: 'LIVE',
    tag: 'HIN',
    welcomePhrase: 'नमस्ते! बिना किसी कठिन गणित के AI को आसानी से समझें।',
    description: 'Standard Devanagari edition with active vernacular glossary.'
  },
  {
    code: 'ur',
    name: 'Urdu (Fusha / Classical)',
    nativeName: 'اردو (فصیح)',
    script: 'نستعلیق',
    region: 'Pan-India & Madrasa Academic Curricula',
    category: 'northern',
    status: 'LIVE',
    tag: 'URD',
    welcomePhrase: 'خوش آمدید! مصنوعی ذہانت کو آسان اور عام فہم انداز میں سیکھیں۔',
    description: 'Madrasa and academic Urdu edition for religious scholars and students.'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'বাংলা লিপি',
    region: 'West Bengal & Tripura',
    category: 'northern',
    status: 'BETA',
    tag: 'BEN',
    welcomePhrase: 'স্বাগতম! কৃত্রিম বুদ্ধিমত্তা সহজভাবে শিখুন।',
    description: 'Eastern Indo-Aryan core curriculum in translation.'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'देवनागरी (मोडी)',
    region: 'Maharashtra & Goa',
    category: 'northern',
    status: 'BETA',
    tag: 'MAR',
    welcomePhrase: 'नमस्कार! कृत्रिम बुद्धिमत्ता सोप्या भाषेत शिका.',
    description: 'Maharashtra grassroots schools and colleges vernacular edition.'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'ગુજરાતી લિપિ',
    region: 'Gujarat & Dadra and Nagar Haveli',
    category: 'northern',
    status: 'BETA',
    tag: 'GUJ',
    welcomePhrase: 'નમસ્તે! આર્ટિફિશિયલ ઇન્ટેલિજન્સ સરળ રીતે શીખો.',
    description: 'Western entrepreneurial and regional learning modules.'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ / پنجابی',
    script: 'Gurmukhi / Shahmukhi',
    region: 'Punjab & Chandigarh',
    category: 'northern',
    status: 'BETA',
    tag: 'PAN',
    welcomePhrase: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! AI ਨੂੰ ਬਿਲਕੁਲ ਆਸਾਨੀ ਨਾਲ ਸਿੱਖੋ।',
    description: 'North-Western vernacular outreach edition.'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'ଓଡ଼ିଆ ଲିପି',
    region: 'Odisha',
    category: 'northern',
    status: 'SCHEDULED',
    tag: 'ODI',
    welcomePhrase: 'ନମସ୍କାର! କୃତ୍ରିମ ବୁଦ୍ଧିମତ୍ତା ସହଜରେ ଶିଖନ୍ତୁ |',
    description: 'Eastern coastal classical language support.'
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'অসমীয়া লিপি',
    region: 'Assam & Brahmaputra Valley',
    category: 'northern',
    status: 'SCHEDULED',
    tag: 'ASM',
    welcomePhrase: 'নমস্কাৰ! সহজ ভাষাত কৃত্ৰিম বুদ্ধিমত্তা শিকক।',
    description: 'North-East regional valley student outreach.'
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली (মৈথিলী)',
    script: 'Tirhuta / Devanagari',
    region: 'Bihar & Mithila Region',
    category: 'northern',
    status: 'SCHEDULED',
    tag: 'MAI',
    welcomePhrase: 'प्रणाम! आसानी सँ AI सीखू।',
    description: 'Mithila cultural region grassroots support.'
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'کٲشُر / कॉशुर',
    script: 'Perso-Arabic / Devanagari',
    region: 'Jammu & Kashmir',
    category: 'northern',
    status: 'SCHEDULED',
    tag: 'KAS',
    welcomePhrase: 'آداب! AI ہیکیو آسانی سان ہیچھتھ۔',
    description: 'Valley youth digital skills enablement.'
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي / सिन्धी',
    script: 'Khudabadi / Perso-Arabic',
    region: 'Sindhi Community & Western India',
    category: 'northern',
    status: 'SCHEDULED',
    tag: 'SND',
    welcomePhrase: 'نمسڪار! آساني سان AI سکو.',
    description: 'Heritage language educational translation.'
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी (ಕೊಂಕಣಿ)',
    script: 'Devanagari / Romi / Kannada',
    region: 'Goa & Konkan Coastal Belt',
    category: 'northern',
    status: 'SCHEDULED',
    tag: 'KOK',
    welcomePhrase: 'नमस्कार! सोप्या भाशेंत AI शिका.',
    description: 'Konkan belt student localization.'
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari / Takri',
    region: 'Jammu & Himachal Pradesh',
    category: 'northern',
    status: 'SCHEDULED',
    tag: 'DOG',
    welcomePhrase: 'नमस्ते! डोगरी च AI सीक्खो।',
    description: 'Duggar region student outreach.'
  },

  // 4. CLASSICAL, TRIBAL & NORTH-EAST
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'देवनागरी',
    region: 'Pan-Indian Classical & Computational Linguistics',
    category: 'classical_tribal',
    status: 'BETA',
    tag: 'SAN',
    welcomePhrase: 'नमस्ते! कृत्रिमबुद्धेः तत्वानि सरलतया अवगच्छन्तु।',
    description: 'Ancient computational linguistics & algorithmic roots.'
  },
  {
    code: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ (Ol Chiki)',
    script: 'Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)',
    region: 'Jharkhand, Odisha & West Bengal Tribal Belt',
    category: 'classical_tribal',
    status: 'SCHEDULED',
    tag: 'SAT',
    welcomePhrase: 'ᱡᱚᱦᱟᱨ! ᱟᱞᱜᱟᱛᱮ AI ᱪᱮᱫᱚᱜ ᱢᱮ।',
    description: 'Empowering tribal youth with first-class AI education.'
  },
  {
    code: 'mni',
    name: 'Manipuri / Meitei',
    nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ (Meitei Mayek)',
    script: 'Meitei Mayek / Bengali',
    region: 'Manipur & North-East',
    category: 'classical_tribal',
    status: 'SCHEDULED',
    tag: 'MNI',
    welcomePhrase: 'ꯈꯨꯔꯨꯃꯖꯔꯤ! AI ꯂꯥꯏꯅ ꯇꯝꯃꯨ।',
    description: 'North-Eastern indigenous script digital inclusion.'
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बर\' (Bodo)',
    script: 'Devanagari',
    region: 'Bodoland & Assam',
    category: 'classical_tribal',
    status: 'SCHEDULED',
    tag: 'BOD',
    welcomePhrase: 'खुलुमबाय! गोरलैयैनो AI सोलों।',
    description: 'Bodoland grassroots community inclusion.'
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    script: 'देवनागरी',
    region: 'Sikkim, Darjeeling & Himalayan Belt',
    category: 'classical_tribal',
    status: 'SCHEDULED',
    tag: 'NEP',
    welcomePhrase: 'नमस्ते! सजिलैसँग AI सिक्नुहोस्।',
    description: 'Himalayan and North-Eastern student outreach.'
  }
];

export default function FloatingLanguageBubble() {
  const { lang, setLang } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'live' | 'southern' | 'northern' | 'classical_tribal'>('all');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Filter languages based on search and selected category
  const filteredLanguages = useMemo(() => {
    return INDIAN_LANGUAGES.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        activeCategory === 'all' || 
        (activeCategory === 'live' && (item.category === 'live' || item.code === 'te' || item.code === 'hi' || item.code === 'ur')) ||
        item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleLanguageSelect = (item: IndianLanguageItem) => {
    // If it's en, hyd, te, hi, ur, switch directly
    if (item.code === 'en' || item.code === 'hyd' || item.code === 'te') {
      setLang(item.code as Language);
    } else if (item.code === 'hi' || item.code === 'ur') {
      // Map to hyd/en or set directly
      setLang(item.code === 'ur' ? 'hyd' : 'en');
    } else {
      // Keep selected or fallback to english/telugu based on region
      if (item.category === 'southern') {
        setLang('te');
      } else {
        setLang('en');
      }
    }

    // Show celebratory regional welcome toast
    setNotificationToast(`${item.nativeName} (${item.name}): ${item.welcomePhrase}`);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4500);

    setShowMenu(false);
  };

  const cycleNextLanguage = () => {
    if (lang === 'en') setLang('hyd');
    else if (lang === 'hyd') setLang('te');
    else setLang('en');
  };

  return (
    <>
      {/* Regional Toast Notification */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-brand-charcoal text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-brand-amber/40 max-w-md w-[90vw] text-left text-xs pointer-events-auto"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-amber text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-mono uppercase text-brand-amber font-bold">Language Activated</span>
              <span className="block font-medium leading-snug">{notificationToast}</span>
            </div>
            <button 
              onClick={() => setNotificationToast(null)}
              className="p-1 text-brand-sand/70 hover:text-white rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-[88px] right-[26px] z-40 flex items-center gap-3 pointer-events-none select-none">
        <div className="pointer-events-auto flex items-center gap-3 relative">
          
          {/* Categorized Indian Languages Modal / Dropdown Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 15, x: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 15, x: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute right-0 sm:right-14 bottom-0 bg-[#FDFBF7] border-2 border-brand-amber/40 rounded-3xl p-4 shadow-2xl w-[320px] sm:w-[420px] max-h-[80vh] flex flex-col pointer-events-auto backdrop-blur-xl text-left"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-brand-charcoal/10 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-brand-amber text-white flex items-center justify-center shadow-xs">
                      <Languages className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-black text-brand-charcoal leading-tight">
                        Indian Languages Directory
                      </h3>
                      <span className="text-[9.5px] font-mono text-brand-amber font-bold">
                        {lang === 'te' ? '22+ భారతీయ భాషలు • ఉచిత AI విద్య' : lang === 'hyd' ? '22+ Zabaan • Free AI Sabaq' : '22+ Scheduled Indian Languages • 100% Free AI'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowMenu(false)}
                    className="p-1.5 rounded-full text-brand-muted hover:text-brand-charcoal hover:bg-brand-sand/70 transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Madrasa & Grassroots Mission Notice Banner */}
                <div className="my-2.5 p-2.5 rounded-2xl bg-amber-500/10 border border-brand-amber/25 flex items-start gap-2 shrink-0">
                  <School className="w-4 h-4 text-brand-amber-dark shrink-0 mt-0.5" />
                  <div className="text-[11px] text-brand-charcoal leading-relaxed">
                    <span className="font-bold block text-[11px] text-brand-amber-dark">
                      Our Grassroots & Madrasa Outreach
                    </span>
                    Dedicated to non-native learners, Madrasa scholars, Telugu speakers, and vernacular students across all Indian states.
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-2 shrink-0">
                  <Search className="w-3.5 h-3.5 text-brand-slate absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search languages (Telugu, தமிழ், Urdu, हिन्दी)..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-brand-slate/20 rounded-xl text-xs text-brand-charcoal placeholder-brand-muted focus:outline-none focus:border-brand-amber"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-brand-muted hover:text-brand-charcoal cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Category Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none shrink-0">
                  {[
                    { id: 'all', label: 'All (24)' },
                    { id: 'live', label: '✨ Live Now' },
                    { id: 'southern', label: '🌴 Southern (Dravidian)' },
                    { id: 'northern', label: '🏔️ Northern / Indo-Aryan' },
                    { id: 'classical_tribal', label: '🌿 Classical & Tribal' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                        activeCategory === cat.id
                          ? 'bg-brand-charcoal text-white shadow-xs'
                          : 'bg-brand-sand/50 text-brand-slate hover:bg-brand-sand hover:text-brand-charcoal'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Categorized Language List */}
                <div className="overflow-y-auto max-h-[320px] space-y-1.5 pr-1 scrollbar-thin flex-1">
                  {filteredLanguages.length === 0 ? (
                    <div className="p-6 text-center text-xs text-brand-muted">
                      No language found matching "{searchQuery}".
                    </div>
                  ) : (
                    filteredLanguages.map((item) => {
                      const isCurrent = lang === item.code || (item.code === 'en' && lang === 'en') || (item.code === 'te' && lang === 'te') || (item.code === 'hyd' && lang === 'hyd');
                      return (
                        <button
                          key={item.code}
                          onClick={() => handleLanguageSelect(item)}
                          className={`w-full p-2.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col gap-1 ${
                            isCurrent
                              ? 'bg-brand-amber/15 border-brand-amber/50 shadow-xs'
                              : 'bg-white hover:bg-brand-sand/50 border-brand-slate/10 hover:border-brand-amber/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-black ${
                                isCurrent 
                                  ? 'bg-brand-amber text-white' 
                                  : 'bg-brand-sand text-brand-slate'
                              }`}>
                                {item.tag}
                              </span>
                              <span className="text-xs font-bold text-brand-charcoal">
                                {item.nativeName}
                              </span>
                              <span className="text-[10px] text-brand-muted">
                                ({item.name})
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className={`text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded-full ${
                                item.status === 'LIVE'
                                  ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                                  : item.status === 'BETA'
                                  ? 'bg-amber-500/15 text-amber-700 border border-amber-500/30'
                                  : 'bg-slate-200 text-slate-700'
                              }`}>
                                {item.status}
                              </span>
                              {isCurrent && <Check className="w-3.5 h-3.5 text-brand-amber stroke-[3]" />}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-brand-slate pl-0.5">
                            <span className="truncate pr-2">{item.region}</span>
                            <span className="font-mono text-[9px] text-brand-muted shrink-0">{item.script}</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Footer Note */}
                <div className="pt-2.5 mt-2 border-t border-brand-charcoal/10 flex items-center justify-between text-[10px] text-brand-muted shrink-0">
                  <div className="flex items-center gap-1 text-brand-amber font-bold">
                    <Heart className="w-3 h-3 fill-brand-amber" />
                    <span>Free Forever for all learners</span>
                  </div>
                  <span className="font-mono text-[9px]">Madrasa & Grassroots AI Initiative</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Bubble Action Button */}
          <motion.button
            onClick={() => {
              setShowMenu(!showMenu);
            }}
            onDoubleClick={cycleNextLanguage}
            whileHover={{ scale: 1.08, rotate: 4 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              y: [0, -4, 0],
            }}
            transition={{ 
              y: {
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }
            }}
            className="w-12 h-12 bg-white hover:bg-brand-sand/30 border-2 border-[#E07A5F] text-[#E07A5F] rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer relative group"
            title={lang === 'en' ? "Indian Languages: English, Hyderabadi, Telugu & 22+ Languages" : lang === 'te' ? "భారతీయ భాషలు: తెలుగు, హైదరాబాదీ, ఇంగ్లీష్ మరియు 22+ భాషలు" : "Hindustani Zabaanein: Hyderabadi, Telugu, English & 22+ Zabaanein"}
          >
            <Languages className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            
            {/* Quick Language Indicator Tag */}
            <span className="absolute -top-1.5 -right-1.5 bg-[#E07A5F] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border border-white shadow-sm font-mono uppercase">
              {lang === 'en' ? 'EN' : lang === 'te' ? 'TEL' : 'HYD'}
            </span>
          </motion.button>
        </div>
      </div>
    </>
  );
}
