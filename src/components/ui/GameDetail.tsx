import { ArrowLeft, Download, ShieldCheck, Share2, Flag, Monitor, Apple } from 'lucide-react';
import { useState } from 'react';

export interface GameDetailProps {
  game: {
    _id?: string;
    title: string;
    price: string;
    image: string;
    platform?: string;
    description?: string;
    details?: {
      version?: string;
      developer?: string;
      activation?: string;
      credits?: string;
      source?: string;
    };
    systemRequirements?: {
      os?: string;
      processor?: string;
      memory?: string;
      graphics?: string;
      storage?: string;
    };
    downloadLink?: string[];
    tags?: string[];
    size?: string;
    thumbnail?: string[];
  };
  onBack: () => void;
}

export default function GameDetail({ game, onBack }: GameDetailProps) {
  const allThumbnails = [
    game.image,
    ...(game.thumbnail && game.thumbnail.length > 0 ? game.thumbnail.slice(1) : (game.thumbnail || []))
  ];

  const [activeImg, setActiveImg] = useState(allThumbnails[0] || game.image);
  const [showDownloadSources, setShowDownloadSources] = useState(false);

  // Clean the tags or make them look standard
  const tagsList = game.tags && game.tags.length > 0 
    ? game.tags 
    : ["Base Game", "Character Customization", "Great Boss Battles"];

  // Download Action Logic
  const handleDownload = () => {
    if (game.downloadLink && game.downloadLink.length > 0) {
      // Find the first valid URL
      const link = game.downloadLink.find(l => l && l.startsWith('http'));
      if (link) {
        window.open(link, '_blank');
      } else {
        alert("Download links not available directly for this entry yet.");
      }
    } else {
      alert("No direct download link attached for this game.");
    }
  };

  return (
    <div className="flex flex-col w-full text-white min-h-screen">
      {/* Top Header & Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack} 
          className="p-2.5 bg-epic-gray hover:bg-epic-hover rounded-full transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-white" />
        </button>
        <div>
          <h1 className="text-4xl font-black text-[#f5f5f5] mb-2 leading-tight tracking-tight">
            {game.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400 font-medium tracking-wide">
            <span className="flex items-center gap-1.5 text-[#ffb01f] bg-[#ffb01f]/10 px-2 py-1 rounded">
              ★ 4.7
            </span>
            {tagsList.slice(0, 3).map((tag, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-white/5 pb-1.5 mb-8 text-[14px]">
        <span className="text-white border-b-2 border-white pb-3 font-semibold px-1 cursor-pointer">
          Overview
        </span>
        <span className="text-gray-400 hover:text-white transition-colors pb-3 px-1 cursor-pointer">
          Add-Ons
        </span>
        <span className="text-gray-400 hover:text-white transition-colors pb-3 px-1 cursor-pointer">
          Achievements
        </span>
      </div>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Section (Giant Media + Details) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Active Image Player Container */}
          <div className="w-full aspect-video rounded-xl bg-epic-gray relative overflow-hidden group shadow-2xl border border-white/5">
            <img 
              src={activeImg} 
              alt={game.title} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>

          {/* Image Carousels */}
          {allThumbnails.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {allThumbnails.slice(0, 8).map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(thumb)}
                  className={`flex-shrink-0 w-24 aspect-video rounded-lg bg-epic-gray border transition-all ${
                    activeImg === thumb ? 'border-blue-500 scale-95 border-2' : 'border-white/10 hover:border-white/30'
                  } overflow-hidden`}
                >
                  <img src={thumb} alt="Preview thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Detailed Game Content Description */}
          <div className="mt-6 flex flex-col gap-6">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-[#f5f5f5] mb-4">About {game.title}</h3>
              <div className="flex flex-col">
                {(() => {
                  const desc = game.description || `Explore the stunning new world of ${game.title}. An intense and breathtaking adventure awaits with rich exploration, story, and next-generation cinematic details. Optimized perfectly for your setup on Nexplay.`;
                  // Clean literal escaped newlines and split into paragraphs
                  const cleanDesc = desc.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
                  const paragraphs = cleanDesc.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);

                  return paragraphs.map((para: string, idx: number) => {
                    // Detect feature bolding like "Cinematic Action: "
                    const headerMatch = para.match(/^([^:]+):/);
                    if (headerMatch && headerMatch[1].split(' ').length <= 6) {
                      return (
                        <p key={idx} className="mb-4 text-[#a1a1a1] text-[15px] leading-relaxed">
                          <strong className="text-white font-bold block mb-1">{headerMatch[1]}:</strong>
                          {para.substring(headerMatch[0].length).trim()}
                        </p>
                      );
                    }

                    return (
                      <p key={idx} className="mb-4 text-[#a1a1a1] text-[15px] leading-relaxed">
                        {para}
                      </p>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Technical Specifications */}
            {game.systemRequirements && (
              <div className="mt-4 border-t border-white/5 pt-6 flex flex-col">
                <h3 className="text-xl font-bold text-[#f5f5f5] mb-4">System Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm bg-white/5 p-5 rounded-xl border border-white/10">
                  {game.systemRequirements.os && (
                    <div>
                      <span className="text-[#a1a1a1] block mb-1">OS</span>
                      <p className="text-white font-medium">{game.systemRequirements.os}</p>
                    </div>
                  )}
                  {game.systemRequirements.processor && (
                    <div>
                      <span className="text-[#a1a1a1] block mb-1">Processor</span>
                      <p className="text-white font-medium">{game.systemRequirements.processor}</p>
                    </div>
                  )}
                  {game.systemRequirements.memory && (
                    <div>
                      <span className="text-[#a1a1a1] block mb-1">Memory</span>
                      <p className="text-white font-medium">{game.systemRequirements.memory}</p>
                    </div>
                  )}
                  {game.systemRequirements.graphics && (
                    <div>
                      <span className="text-[#a1a1a1] block mb-1">Graphics</span>
                      <p className="text-white font-medium">{game.systemRequirements.graphics}</p>
                    </div>
                  )}
                  {game.systemRequirements.storage && (
                    <div>
                      <span className="text-[#a1a1a1] block mb-1">Storage</span>
                      <p className="text-white font-medium">{game.systemRequirements.storage}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section (Stats, Detail table, and Get/Download Options) */}
        <div className="lg:col-span-4 flex flex-col gap-8">

          <div className="flex flex-col">

            {/* Direct Action Download Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDownloadSources(!showDownloadSources)}
                className="w-full bg-[#0074e4] hover:bg-[#0064c7] py-3.5 rounded-lg text-white font-black uppercase text-sm tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Get Game
              </button>
              
              <button className="w-full bg-white/5 hover:bg-white/10 py-3.5 rounded-lg text-white font-bold text-sm transition-colors border border-white/5">
                + Add to Wishlist
              </button>
            </div>

            {/* Inlined Sources list triggered by Get Game click */}
            {showDownloadSources && (
              <div className="flex flex-col gap-2.5 mt-4 p-4 bg-white/5 border border-white/10 rounded-xl transition-all duration-300">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Select a Mirror to Download</span>
                {game.downloadLink && game.downloadLink.filter(l => l && l.startsWith('http')).length > 0 ? (
                  game.downloadLink.filter(l => l && l.startsWith('http')).map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full bg-white/5 hover:bg-white/10 p-3 rounded-lg text-white font-medium text-xs transition-colors border border-white/5 flex items-center justify-between group truncate"
                    >
                      <span className="truncate max-w-[85%]">{link}</span>
                      <Download className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 flex-shrink-0" />
                    </a>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No download links available for this game.</p>
                )}
              </div>
            )}
          </div>

          {/* Context Table Metadata Stats */}
          <div className="flex flex-col gap-3.5 text-[13px] border-t border-white/5 pt-6">
            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-gray-400">Developer</span>
              <span className="text-white font-semibold">{game.details?.developer || "Epic Games"}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-gray-400">Platform</span>
              <span className="text-white font-semibold flex items-center gap-1.5 capitalize">
                {game.platform === 'Mac' ? <Apple className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                {game.platform || "PC"}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-gray-400">Size</span>
              <span className="text-white font-semibold">{game.size || "75 GB"}</span>
            </div>
            {game.details?.activation && (
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-gray-400">Activation</span>
                <span className="text-white font-semibold">{game.details.activation}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-1.5">
              <span className="text-gray-400">Refund Policy</span>
              <span className="text-white font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                Self-Refundable
              </span>
            </div>
          </div>

          {/* Mirrors & Download Links explicitly listed */}
          {game.downloadLink && game.downloadLink.filter(l => l && l.startsWith('http')).length > 0 && (
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/5">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Alternative Mirrors</span>
              <div className="flex flex-col gap-2">
                {game.downloadLink.filter(l => l && l.startsWith('http')).map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full bg-white/5 hover:bg-white/10 p-3 rounded-lg text-white font-medium text-xs transition-colors border border-white/5 flex items-center justify-between group truncate"
                  >
                    <span className="truncate max-w-[85%]">{link}</span>
                    <Download className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Social / Foot Actions */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-2.5 rounded transition-all border border-white/10">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-2.5 rounded transition-all border border-white/10">
              <Flag className="w-4 h-4" /> Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
