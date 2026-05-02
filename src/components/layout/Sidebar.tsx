import { Monitor } from 'lucide-react';

const AppleLogo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={className} viewBox="0 0 16 16">
    <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
    <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
  </svg>
);

const PlayStationLogo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-playstation" viewBox="0 0 16 16">
    <path d="M15.858 11.451c-.313.395-1.079.676-1.079.676l-5.696 2.046v-1.509l4.192-1.493c.476-.17.549-.412.162-.538-.386-.127-1.085-.09-1.56.08l-2.794.984v-1.566l.161-.054s.807-.286 1.942-.412c1.135-.125 2.525.017 3.616.43 1.23.39 1.368.962 1.056 1.356M9.625 8.883v-3.86c0-.453-.083-.87-.508-.988-.326-.105-.528.198-.528.65v9.664l-2.606-.827V2c1.108.206 2.722.692 3.59.985 2.207.757 2.955 1.7 2.955 3.825 0 2.071-1.278 2.856-2.903 2.072Zm-8.424 3.625C-.061 12.15-.271 11.41.304 10.984c.532-.394 1.436-.69 1.436-.69l3.737-1.33v1.515l-2.69.963c-.474.17-.547.411-.161.538.386.126 1.085.09 1.56-.08l1.29-.469v1.356l-.257.043a8.45 8.45 0 0 1-4.018-.323Z"/>
  </svg>
);

export default function Sidebar({ 
  onSelectCategory, 
  activeCategory 
}: { 
  onSelectCategory: (cat: string) => void,
  activeCategory: string
}) {
  const getBtnClass = (cat: string) => `flex items-center w-full text-left gap-3 px-3 py-2 text-[15px] rounded-lg transition-colors ${activeCategory === cat ? 'bg-white/10 text-white font-medium' : 'text-[#f5f5f5] hover:bg-white/5'}`;

  return (
    <aside className="w-[260px] flex-shrink-0 hidden md:block pt-8 px-4">
      <nav className="space-y-8 sticky top-[100px]">
        
        {/* Section: Games */}
        <div>
          <h3 className="text-[#a1a1a1] text-[12px] font-bold uppercase tracking-widest mb-3 px-3">Games</h3>
          <ul className="space-y-0.5">
            <li>
              <button onClick={() => onSelectCategory('toxic_mac_games')} className={getBtnClass('toxic_mac_games')}>
                <AppleLogo className="w-[16px] h-[18px]" />
                Mac Games
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('toxic_pc_games')} className={getBtnClass('toxic_pc_games')}>
                <Monitor className="w-[18px] h-[18px]" />
                PC Games
              </button>
            </li>
          </ul>
        </div>

        {/* Section: Softwares */}
        <div>
          <h3 className="text-[#a1a1a1] text-[12px] font-bold uppercase tracking-widest mb-3 px-3">Softwares</h3>
          <ul className="space-y-0.5">
            <li>
              <button onClick={() => onSelectCategory('toxic_mac_softwares')} className={getBtnClass('toxic_mac_softwares')}>
                <AppleLogo className="w-[16px] h-[18px]" />
                Mac Softwares
              </button>
            </li>
          </ul>
        </div>

        {/* Section: Playstation */}
        <div>
          <h3 className="text-[#a1a1a1] text-[12px] font-bold uppercase tracking-widest mb-3 px-3">Playstation</h3>
          <ul className="space-y-0.5">
            <li>
              <button onClick={() => onSelectCategory('toxic_ps2_iso')} className={getBtnClass('toxic_ps2_iso')}>
                <PlayStationLogo className="w-[18px] h-[18px]" />
                PS2 ISO
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('toxic_ps3_iso')} className={getBtnClass('toxic_ps3_iso')}>
                <PlayStationLogo className="w-[18px] h-[18px]" />
                PS3 ISO
              </button>
            </li>
          </ul>
        </div>

        {/* Section: Extra Games */}
        <div>
          <h3 className="text-[#a1a1a1] text-[12px] font-bold uppercase tracking-widest mb-3 px-3 mt-8">More Games</h3>
          <ul className="space-y-0.5">
            <li>
              <button onClick={() => onSelectCategory('anker_top_games')} className={getBtnClass('anker_top_games')}>
                Top Games
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('anker_trending')} className={getBtnClass('anker_trending')}>
                Trending
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('anker_collections')} className={getBtnClass('anker_collections')}>
                Collections
              </button>
            </li>
          </ul>
        </div>

      </nav>
    </aside>
  );
}
