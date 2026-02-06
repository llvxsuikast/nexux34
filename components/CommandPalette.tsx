
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Terminal, Zap, Command, Shield, Database, ChevronRight } from 'lucide-react';
import { QueryType, UserRole } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (query: QueryType) => void;
  userRole: UserRole;
  menuItems: { id: QueryType; label: string; icon: any; badge?: string }[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isOpen, onClose, onSelect, userRole, menuItems 
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems = useMemo(() => {
    const isAdmin = userRole === 'ADMIN';
    const isPremium = userRole === 'PREMIUM';

    return menuItems.filter(item => {
      const matchesSearch = item.label.toLowerCase().includes(query.toLowerCase());
      const hasAccess = isAdmin || 
                       (item.badge === 'FREE') || 
                       (isPremium && item.badge === 'PREMIUM');
      return matchesSearch && hasAccess;
    });
  }, [query, menuItems, userRole]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % filteredItems.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + filteredItems.length) % filteredItems.length);
      }
      if (e.key === 'Enter') {
        if (filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose, onSelect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 sm:px-0">
      <div className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}></div>
      
      <div className="relative w-full max-w-2xl bg-obsidian-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-200">
        <div className="flex items-center px-6 py-4 border-b border-slate-800 bg-obsidian-950/50">
          <Search className="w-5 h-5 text-slate-500 mr-4" />
          <input 
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-slate-600 text-sm font-bold uppercase tracking-widest"
            placeholder="KOMUT VEYA SORGU ARA..."
          />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 border border-slate-700">
            <span className="text-[10px] font-black text-slate-400">ESC</span>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto custom-scrollbar py-2">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <Terminal className="w-12 h-12 text-slate-800 mx-auto mb-4" />
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">EŞLEŞEN KAYIT BULUNAMADI</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => { onSelect(item.id); onClose(); }}
                  className={`w-full flex items-center justify-between px-6 py-3 transition-colors ${isSelected ? 'bg-crimson-600/10 border-l-4 border-crimson-500' : 'hover:bg-slate-800/50 border-l-4 border-transparent'}`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-crimson-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className={`text-xs font-bold uppercase tracking-wide ${isSelected ? 'text-white' : 'text-slate-300'}`}>{item.label}</p>
                      <p className="text-[9px] text-slate-500 font-mono tracking-tighter">{item.id.replace(/_/g, '.')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.badge && (
                      <span className={`text-[8px] border px-1.5 py-0.5 rounded-sm font-black tracking-tighter ${
                        item.badge === 'FREE' ? 'bg-emerald-900/20 border-emerald-900/40 text-emerald-500' :
                        item.badge === 'PREMIUM' ? 'bg-indigo-900/20 border-indigo-900/40 text-indigo-400' :
                        'bg-crimson-900/20 border-crimson-900/40 text-crimson-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isSelected && <ChevronRight className="w-4 h-4 text-crimson-500 animate-in slide-in-from-left-2" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-obsidian-950/80 flex items-center justify-between">
           <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Command className="w-3 h-3" /> SEÇ</span>
              <span className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 rotate-90" /> GEZİN</span>
           </div>
           <div className="flex items-center gap-2 text-[9px] font-mono text-crimson-500/50">
              <Shield className="w-3 h-3" /> SECURE_TUNNEL_ACTIVE
           </div>
        </div>
      </div>
    </div>
  );
};
