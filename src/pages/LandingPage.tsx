import { useState, useMemo, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import GameCard from '../components/ui/GameCard';
import GameDetail from '../components/ui/GameDetail';
import DISCOVER_GAMES from '../data/games.json';
import toxicCategories from '../data/toxic_categories.json';
import ankerCategories from '../data/anker_categories.json';

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState('discover');
  const [selectedGame, setSelectedGame] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Memoize the flattened, unique database so we don't rebuild it on every keystroke
  const globalDatabase = useMemo(() => {
    const allKnownGames = [
      ...DISCOVER_GAMES,
      ...(toxicCategories.mac_games || []),
      ...(toxicCategories.pc_games || []),
      ...(toxicCategories.mac_softwares || []),
      ...(toxicCategories.ps2_iso || []),
      ...(toxicCategories.ps3_iso || []),
      ...(ankerCategories.games_list || []),
      ...(ankerCategories.top_games || []),
      ...(ankerCategories.trending || []),
      ...(ankerCategories.collections || [])
    ];
    
    const uniqueMap = new Map();
    allKnownGames.forEach(g => {
      if (g && g.title && !uniqueMap.has(g.title)) {
        uniqueMap.set(g.title, g);
      }
    });
    
    return Array.from(uniqueMap.values());
  }, []);

  const randomHeroGame = useMemo(() => {
    if (!globalDatabase.length) return null;
    return globalDatabase[Math.floor(Math.random() * Math.min(globalDatabase.length, 50))];
  }, [globalDatabase]);

  let displayedGames = DISCOVER_GAMES;
  let categoryTitle = "Discover Something New";

  switch (activeCategory) {
    case 'toxic_mac_games': displayedGames = toxicCategories.mac_games || []; categoryTitle = "Mac Games"; break;
    case 'toxic_pc_games': displayedGames = toxicCategories.pc_games || []; categoryTitle = "PC Games"; break;
    case 'toxic_mac_softwares': displayedGames = toxicCategories.mac_softwares || []; categoryTitle = "Mac Softwares"; break;
    case 'toxic_ps2_iso': displayedGames = toxicCategories.ps2_iso || []; categoryTitle = "PS2 ISO"; break;
    case 'toxic_ps3_iso': displayedGames = toxicCategories.ps3_iso || []; categoryTitle = "PS3 ISO"; break;
    case 'anker_top_games': displayedGames = ankerCategories.top_games || []; categoryTitle = "Top Games"; break;
    case 'anker_trending': displayedGames = ankerCategories.trending || []; categoryTitle = "Trending Games"; break;
    case 'anker_collections': displayedGames = ankerCategories.collections || []; categoryTitle = "Game Collections"; break;
  }

  // Global search filtering using deferred query
  let searchResults: any[] = [];
  if (deferredSearchQuery.trim().length > 0) {
    const q = deferredSearchQuery.toLowerCase();
    
    searchResults = globalDatabase.filter(game => 
      game.title.toLowerCase().includes(q) || 
      (game.description && game.description.toLowerCase().includes(q))
    );
  }

  return (
    <div className="min-h-screen bg-epic-black flex flex-col">
      <Navbar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        searchResults={searchResults}
        onResultClick={(game) => {
          setSelectedGame(game);
          setSearchQuery('');
        }}
      />
      
      <div className="flex flex-1 w-full mx-auto">
        <Sidebar activeCategory={activeCategory} onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery(''); // clear search when navigating
        }} />
        
        {/* Main Content */}
        <main className="flex-1 px-8 md:pr-16 py-10 min-w-0">
          {selectedGame ? (
            <GameDetail game={selectedGame} onBack={() => setSelectedGame(null)} />
          ) : (
            <>
              {/* Store Sub-navigation */}
              <div className="flex items-center gap-6 mb-8 text-[15px]">
                <button onClick={() => {setActiveCategory('discover'); setSearchQuery('');}} className={`transition-colors ${activeCategory === 'discover' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Discover</button>
                <button className="text-gray-400 hover:text-white transition-colors">Browse</button>
                <button className="text-gray-400 hover:text-white transition-colors">News</button>
              </div>

              <AnimatePresence mode="popLayout">
                <motion.section 
                  key="hero"
                  initial={{ opacity: 0, y: -20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mb-12 origin-top"
                >
                  <div 
                    className="w-full h-[65vh] rounded-2xl bg-epic-dark-gray flex flex-col justify-end p-12 relative overflow-hidden group cursor-pointer border border-white/5"
                    onClick={() => randomHeroGame && setSelectedGame(randomHeroGame)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/40 to-transparent z-10" />
                    
                    {/* Dynamic background placeholder */}
                    {randomHeroGame ? (
                      <div 
                        className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-700 group-hover:scale-105" 
                        style={{ backgroundImage: `url('${randomHeroGame.thumbnail?.[0] || randomHeroGame.thumbnail?.[0] || randomHeroGame.image}')` }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-700 group-hover:scale-105" />
                    )}

                    <div className="relative z-20 max-w-2xl">
                      <h1 className="text-5xl font-black mb-4 group-hover:scale-[1.02] epic-transition origin-left drop-shadow-lg text-white">
                        {randomHeroGame ? randomHeroGame.title : 'Cyber Frontiers'}
                      </h1>
                      <p className="text-lg text-gray-200 mb-6 line-clamp-2 drop-shadow">
                        {randomHeroGame ? (randomHeroGame.description?.split('\n')[0] || "Experience the ultimate adventure.") : 'Experience the ultimate cyberpunk adventure in this breathtaking new world. Available now on Nexplay.'}
                      </p>
                      <button className="bg-white text-black px-8 py-3 rounded font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </motion.section>
              </AnimatePresence>

              {/* Grid Section */}
              <motion.section 
                layout
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.h2 layout="position" className="text-[17px] font-medium text-white">{categoryTitle}</motion.h2>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                    <button className="w-[32px] h-[32px] rounded-full bg-epic-gray flex items-center justify-center hover:bg-epic-hover transition-colors text-white">
                      &lt;
                    </button>
                    <button className="w-[32px] h-[32px] rounded-full bg-epic-gray flex items-center justify-center hover:bg-epic-hover transition-colors text-white">
                      &gt;
                    </button>
                  </motion.div>
                </div>
                
                {displayedGames.length > 0 ? (
                  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                      {displayedGames.map((game, i) => (
                        <motion.div 
                          key={game.title + i} 
                          onClick={() => setSelectedGame(game)}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2, delay: Math.min(i * 0.05, 0.3) }}
                          layout
                        >
                          <GameCard 
                            title={game.title}
                            price={game.price}
                            image={game.image}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <h3 className="text-2xl font-bold text-white mb-2">No Results Found</h3>
                    <p className="text-gray-400">We couldn't find anything matching "{searchQuery}". Try another search term.</p>
                  </motion.div>
                )}
              </motion.section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
