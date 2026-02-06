
import React, { useState } from 'react';
import { 
  User, Shield, CreditCard, Gavel, HeartPulse, GraduationCap, 
  MapPin, Smartphone, Activity, ChevronDown, CheckCircle2,
  FileText, Landmark, Key, Globe, LayoutDashboard, Database,
  Users, Fingerprint, Network
} from 'lucide-react';
import { VerificationResult, UserRole } from '../types';

interface ResultCardProps {
  result: VerificationResult;
  onReset: () => void;
  userRole: UserRole;
}

const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = true, tierBadge }: any) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-line-1 rounded-2xl overflow-hidden bg-bg-2/30 mb-6 group hover:border-accent-2/30 transition-all shadow-soft">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 bg-bg-2/50 backdrop-blur-sm"
            >
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-bg-3 rounded-xl text-accent-ice border border-line-0 group-hover:text-accent-2 transition-colors"><Icon className="w-5 h-5" /></div>
                    <div className="text-left">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{title}</h4>
                        <p className="text-[9px] text-slate-500 font-mono">NexuX Data Terminal</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {tierBadge && <span className="text-[8px] bg-accent-2/10 text-accent-2 px-2 py-0.5 rounded border border-accent-2/20 font-black">{tierBadge}</span>}
                    <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && <div className="p-8 animate-in fade-in slide-in-from-top-4 duration-500 bg-bg-0/20">{children}</div>}
        </div>
    );
};

// Generic Key-Value Row
const DataRow: React.FC<{ label: string, value: any }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-line-0 last:border-0 hover:bg-white/5 px-2 rounded transition-colors">
        <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{label.replace(/_/g, ' ')}</span>
        <span className="text-[11px] text-white font-mono font-bold">{value?.toString() || '---'}</span>
    </div>
);

export const ResultCard: React.FC<ResultCardProps> = ({ result, onReset, userRole }) => {
  const p = result.profile!;
  const data = result.data || {};

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
        <div className="bg-bg-1 border border-line-1 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-scanline pointer-events-none opacity-50" />
            
            {/* Ultra Header */}
            <div className="px-10 py-12 bg-gradient-to-br from-accent-0/40 via-bg-1 to-bg-0 border-b border-line-1 flex items-center gap-10 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-10 opacity-5 pointer-events-none"><Database className="w-64 h-64 text-accent-2" /></div>
                
                <div className="w-24 h-24 rounded-3xl bg-bg-0 border border-line-1 flex items-center justify-center relative overflow-hidden group shadow-2xl shrink-0">
                    <User className="w-12 h-12 text-slate-700 group-hover:text-accent-ice transition-colors duration-500" />
                    <div className="absolute inset-0 bg-accent-ice/5 group-hover:opacity-100 opacity-0 transition-opacity" />
                </div>
                <div className="flex-1 z-10">
                    <div className="flex items-center gap-4 mb-3">
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">{p.fullName}</h2>
                        {p.flags.includes("PROTOKOL") && <span className="px-3 py-1 bg-gold-0 text-black text-[9px] font-black rounded-lg shadow-gold-glow animate-pulse">VIP_TARGET</span>}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <span className="bg-bg-0 px-4 py-1.5 rounded-xl border border-line-1 text-xs font-mono text-accent-ice font-bold tracking-widest shadow-inner">{p.tckn}</span>
                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${p.riskLevel === 'KRİTİK' ? 'bg-status-bad/20 text-status-bad border-status-bad/30' : 'bg-bg-3 text-slate-500 border-line-0'}`}>{p.riskLevel} RİSK</span>
                        {p.flags.map(f => (
                            <span key={f} className="bg-accent-2/5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase text-accent-2 tracking-widest border border-accent-2/10">{f}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-10 space-y-2">
                {/* Dynamic Section Rendering based on Data Keys */}
                
                {data.identity_card && (
                    <CollapsibleSection title="Kimlik Kartı Bilgileri" icon={Fingerprint}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(data.identity_card).map(([k, v]) => (
                                <DataRow key={k} label={k} value={v} />
                            ))}
                        </div>
                    </CollapsibleSection>
                )}

                {data.vital_stats && (
                    <CollapsibleSection title="Nüfus Kayıt Örneği" icon={Database}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(data.vital_stats).map(([k, v]) => (
                                <DataRow key={k} label={k} value={v} />
                            ))}
                        </div>
                    </CollapsibleSection>
                )}

                {data.family_tree && (
                    <CollapsibleSection title="Aile Nüfus Tablosu" icon={Users}>
                        <div className="space-y-3">
                            {data.family_tree.map((m: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-bg-3/20 rounded-xl border border-line-0 hover:bg-bg-3/40 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-bg-0 border border-line-1 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:text-accent-ice group-hover:border-accent-ice/30 transition-colors">{m.role.slice(0,2)}</div>
                                        <div>
                                            <p className="text-[11px] font-bold text-white uppercase">{m.name}</p>
                                            <p className="text-[9px] text-slate-600 font-mono">{m.tckn}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[9px] font-black px-2 py-1 rounded ${m.status === 'SAĞ' ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 bg-slate-500/10'}`}>{m.status}</span>
                                        <p className="text-[9px] text-slate-600 mt-1">{m.birth}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CollapsibleSection>
                )}

                {data.active_lines && (
                    <CollapsibleSection title="GSM Hat Dökümü" icon={Smartphone}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.active_lines.map((l: any, i: number) => (
                                <div key={i} className="p-4 bg-bg-0 border border-line-1 rounded-xl">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-accent-ice font-mono font-bold">{l.number}</span>
                                        <span className="text-[9px] font-black bg-bg-3 px-2 rounded text-slate-400">{l.operator}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 flex justify-between">
                                        <span>{l.type}</span>
                                        <span>{l.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CollapsibleSection>
                )}

                {/* Generic JSON Viewer for any other complex data (Analytics, Logs, etc.) */}
                {Object.keys(data).filter(k => !['identity_card', 'vital_stats', 'family_tree', 'active_lines'].includes(k)).length > 0 && (
                    <CollapsibleSection title="Detaylı Veri Seti / Analiz" icon={Activity}>
                        <div className="bg-bg-0 border border-line-1 rounded-xl p-6 font-mono text-[10px] text-slate-400 overflow-x-auto">
                            <pre>{JSON.stringify(data, (key, value) => {
                                if (['identity_card', 'vital_stats', 'family_tree', 'active_lines'].includes(key)) return undefined;
                                return value;
                            }, 2)}</pre>
                        </div>
                    </CollapsibleSection>
                )}

            </div>

            <div className="p-6 bg-bg-2 border-t border-line-1 flex justify-between items-center text-[10px] font-mono text-slate-700">
                <div className="flex gap-6">
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-status-ok" /> SSL_ENCRYPTED</span>
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-status-ok" /> NODAL_SYNC_OK</span>
                </div>
                <span>NEXUX_ENGINE_V4.2</span>
            </div>
        </div>
    </div>
  );
};
