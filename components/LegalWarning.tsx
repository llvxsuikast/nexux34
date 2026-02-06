
import React, { useState, useEffect } from 'react';
import { Lock, Database, Cpu, ShieldAlert, Activity } from 'lucide-react';

export const LegalWarning: React.FC = () => {
  const [cpuUsage, setCpuUsage] = useState(14);
  const [activeThreats, setActiveThreats] = useState(0);
  const [latency, setLatency] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
        setCpuUsage(prev => {
            const next = prev + Math.floor(Math.random() * 10) - 4;
            return Math.max(5, Math.min(85, next));
        });
        setLatency(prev => {
            const next = prev + Math.floor(Math.random() * 5) - 2;
            return Math.max(1, Math.min(20, next));
        });
        // Occasionally flicker a threat
        if (Math.random() > 0.95) {
            setActiveThreats(1);
            setTimeout(() => setActiveThreats(0), 2000);
        }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        
        {/* Main Status */}
        <div className="md:col-span-3 bg-bg-1 border border-line-0 p-4 rounded-xl flex items-center justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-bg-2 to-transparent pointer-events-none"></div>
            
            <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-emerald-500/10 rounded border border-emerald-500/20">
                    <Database className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                    <h3 className="text-xs font-bold text-white tracking-widest uppercase mb-0.5">Veri Akışı: Stabil</h3>
                    <p className="text-[10px] text-slate-500 font-mono">
                        KPS_GATEWAY_V5 <span className="text-emerald-500 mx-1">●</span> ONLINE
                    </p>
                </div>
            </div>

            <div className="hidden sm:flex items-center gap-6 text-[10px] font-mono text-slate-400">
                 <div className="flex flex-col items-end">
                     <span className="text-slate-600 uppercase">Latency</span>
                     <span className={`${latency > 15 ? 'text-status-warn' : 'text-emerald-400'} font-bold transition-colors`}>{latency}ms</span>
                 </div>
                 <div className="w-px h-6 bg-line-0"></div>
                 <div className="flex flex-col items-end">
                     <span className="text-slate-600 uppercase">Uptime</span>
                     <span className="text-white font-bold">99.99%</span>
                 </div>
            </div>
        </div>

        {/* System Load */}
        <div className="md:col-span-1 bg-bg-1 border border-line-0 p-4 rounded-xl flex items-center justify-between shadow-lg group">
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded border transition-colors duration-500 ${cpuUsage > 70 ? 'bg-red-900/20 border-red-900/40' : 'bg-blue-900/20 border-blue-900/40'}`}>
                    <Cpu className={`h-4 w-4 ${cpuUsage > 70 ? 'text-red-500' : 'text-blue-500'}`} />
                </div>
                <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">İşlem Yükü</div>
                    <div className={`text-xs font-bold tracking-wider font-mono transition-colors duration-500 ${cpuUsage > 70 ? 'text-red-400' : 'text-white'}`}>%{cpuUsage}</div>
                </div>
             </div>
             <Activity className={`w-4 h-4 animate-pulse ${cpuUsage > 70 ? 'text-red-500' : 'text-blue-500'}`} />
        </div>

        {/* Active Threats */}
        <div className={`md:col-span-1 border p-4 rounded-xl flex items-center justify-between shadow-lg transition-all duration-300 ${activeThreats > 0 ? 'bg-red-950/30 border-red-500/50' : 'bg-bg-1 border-line-0'}`}>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-2/10 rounded border border-accent-2/20">
                    <ShieldAlert className={`h-4 w-4 text-accent-2 ${activeThreats > 0 ? 'animate-bounce' : ''}`} />
                </div>
                <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Tehditler</div>
                    <div className={`text-xs font-bold tracking-wider ${activeThreats > 0 ? 'text-red-500' : 'text-white'}`}>
                        {activeThreats > 0 ? 'TESPİT EDİLDİ' : 'SIFIR'}
                    </div>
                </div>
             </div>
             <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${activeThreats > 0 ? 'bg-red-500 shadow-red-500' : 'bg-status-ok shadow-[#1F8A5B]'}`}></div>
        </div>

        {/* Security Level */}
        <div className="md:col-span-1 bg-bg-1 border border-line-0 p-4 rounded-xl flex items-center justify-between shadow-lg">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-900/20 rounded border border-amber-900/40">
                    <Lock className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Protokol</div>
                    <div className="text-xs font-bold text-white tracking-wider">LEVEL 5</div>
                </div>
             </div>
             <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_#B8860B]"></div>
        </div>
    </div>
  );
};
