
import React from 'react';

interface DetailRowProps {
    label: string;
    value: string;
    icon?: React.ElementType;
    isAlert?: boolean;
    color?: string;
}

export const DetailRow: React.FC<DetailRowProps> = ({ label, value, icon: Icon, isAlert, color }) => (
    <div className={`flex items-center justify-between p-4 rounded-xl border mb-2.5 transition-all duration-300 ${isAlert ? 'bg-accent-1/10 border-accent-1/40 hover:bg-accent-1/20 shadow-[inset_0_0_15px_rgba(225,29,72,0.1)]' : 'bg-bg-3/40 border-line-0 hover:bg-bg-3/80 hover:border-line-1'} group`}>
        <div className="flex items-center gap-3">
            {Icon && <Icon className={`w-4 h-4 transition-colors ${isAlert ? 'text-accent-1' : 'text-slate-600 group-hover:text-accent-1'}`} />}
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-2 group-hover:text-text-1 transition-colors">{label}</span>
        </div>
        <span className={`text-[11px] font-mono font-black tracking-tight ${isAlert ? 'text-accent-1 animate-pulse' : color || 'text-white'}`}>{value}</span>
    </div>
);
