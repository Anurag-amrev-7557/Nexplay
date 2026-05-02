import { Globe, ChevronDown, Search } from 'lucide-react';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchResults?: any[];
  onResultClick?: (game: any) => void;
}

export default function Navbar({ searchQuery = '', onSearchChange, searchResults = [], onResultClick }: NavbarProps) {
  return (
    <nav className="h-[70px] bg-[#121216] w-full flex items-center justify-between px-6 md:px-8 text-sm select-none relative z-50">
      <div className="flex items-center h-full">
        {/* Logo Area */}
        <div className="flex items-center gap-[6px] cursor-pointer hover:opacity-80 transition-opacity mr-7">
          {/* Epic Games Shield SVG Approximation */}
          <svg
            viewBox="0 0 24 24"
            className="w-[26px] h-[30px] text-white fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0L3.5 3v16l8.5 5 8.5-5V3L12 0zM12 21.5l-6.5-3.8V4.8L12 2.5l6.5 2.3v12.9l-6.5 3.8z" />
            <path d="M8.5 7h7v2h-7zM8.5 11h7v2h-7zM8.5 15h5v2h-5z" />
          </svg>
          <ChevronDown className="w-3.5 h-3.5 text-[#a1a1a1]" strokeWidth={2.5} />
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-7 h-full">
          <a href="#" className="h-full flex items-center">
            <img src="https://cms-assets.unrealengine.com/AVzjeqAbLRKi3W5jq0CAvz/cmb81xhnx3wl407o5wzb06x28" alt="Store" className="h-[30px] w-auto object-contain" />
          </a>
          <a href="#" className="text-white hover:text-white/80 transition-colors text-base font-medium tracking-tight">
            Support
          </a>
          <div className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors cursor-pointer group text-base font-medium tracking-tight">
            <span>Distribute</span>
            <ChevronDown className="w-3.5 h-3.5 text-white group-hover:text-white/80 transition-colors" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex flex-1 justify-center max-w-[400px] mx-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="w-[18px] h-[18px] text-[#a1a1a1]" />
          </div>
          <input
            type="text"
            className="w-full bg-[#202024] hover:bg-[#2a2a2e] text-[#f5f5f5] text-[15px] rounded-full pl-11 pr-4 py-[9px] outline-none placeholder-[#a1a1a1] transition-colors border border-transparent focus:bg-[#2a2a2e]"
            placeholder="Search store"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />

          {/* Epic Games Style Search Dropdown */}
          {searchQuery.trim().length > 0 && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#121212] border border-[#202020] rounded-xl shadow-2xl overflow-hidden flex flex-col py-2 z-50">
              {searchResults.slice(0, 5).map((game, i) => (
                <div 
                  key={i}
                  onClick={() => onResultClick?.(game)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#202024] cursor-pointer transition-colors"
                >
                  <img src={game.image} alt={game.title} className="w-10 h-14 object-cover rounded bg-[#2a2a2e]" />
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-[#f5f5f5] text-[14px] font-semibold truncate">{game.title}</span>
                    <span className="text-[#a1a1a1] text-[12px] truncate">{game.platform || "PC"} • Free</span>
                  </div>
                </div>
              ))}
              {searchResults.length > 5 && (
                <div className="px-4 py-3 mt-1 text-center border-t border-[#202020] cursor-pointer hover:bg-[#202024] transition-colors">
                  <span className="text-[#a1a1a1] text-[13px] font-medium hover:text-white transition-colors">
                    View all {searchResults.length} results
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center h-full gap-[18px]">
        {/* Globe Icon */}
        <button className="text-white hover:text-white/80 transition-colors flex items-center justify-center">
          <Globe className="w-[20px] h-[20px]" strokeWidth={1.5} />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="bg-[#363636] hover:bg-[#4a4a4a] text-white px-4 py-2 rounded-full transition-colors text-md tracking-wide font-medium">
            Sign in
          </button>
          <button className="bg-[#26bbff] hover:bg-[#4cc5ff] text-black px-4 py-2 rounded-full transition-colors text-md tracking-wide font-semibold">
            Download
          </button>
        </div>
      </div>
    </nav>
  );
}
