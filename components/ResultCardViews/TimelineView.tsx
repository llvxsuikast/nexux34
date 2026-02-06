
import React from 'react';
import { Activity } from 'lucide-react';

interface TimelineViewProps {
  data: any;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ data }) => (
    <div className="space-y-4 pl-4 border-l-2 border-line-0 relative ml-2">
        {data.timeline?.map((item: any, i: number) => (
            <div key={i} className="relative pl-8 pb-4 group">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-bg-1 border-2 border-text-2 group-hover:border-accent-1 group-hover:bg-accent-1 group-hover:scale-110 transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"></div>
                <div className="absolute -left-[2px] top-6 bottom-0 w-0.5 bg-line-0 group-hover:bg-line-1 transition-colors"></div>
                
                <span className="text-[10px] font-mono text-text-2 mb-1 block group-hover:text-accent-1 transition-colors">{item.date}</span>
                <div className="bg-bg-2 border border-line-0 p-4 rounded-lg group-hover:border-accent-1/50 transition-all shadow-soft relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-accent-1 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-1">
                         <span className="text-xs font-black text-white uppercase tracking-wide">{item.title}</span>
                         <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider
                            ${item.type === 'GSM' ? 'bg-blue-900/20 text-blue-400' : 
                              item.type === 'FINANCE' ? 'bg-emerald-900/20 text-emerald-400' : 
                              item.type === 'HEALTH' ? 'bg-red-900/20 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
                             {item.type}
                         </span>
                    </div>
                    <p className="text-[11px] text-text-1 font-mono">{item.desc}</p>
                </div>
            </div>
        ))}
    </div>
);
