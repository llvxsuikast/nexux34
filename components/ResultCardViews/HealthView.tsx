
import React from 'react';
import { Stethoscope, Scroll, Shield } from 'lucide-react';

interface HealthViewProps {
  data: any;
}

export const HealthView: React.FC<HealthViewProps> = ({ data }) => (
    <div className="space-y-6">
        {data.diagnoses && (
            <div>
                <h4 className="text-[10px] font-black text-text-2 uppercase mb-3 flex items-center gap-2"><Stethoscope className="w-3 h-3" /> Tanı Geçmişi</h4>
                <div className="space-y-3">
                    {data.diagnoses.map((d: any, i: number) => (
                        <div key={i} className="bg-bg-2 border-l-4 border-status-info p-4 rounded-r-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between mb-1">
                                <span className="text-xs font-bold text-white uppercase">{d.name}</span>
                                <span className="text-[10px] font-mono text-text-2 bg-bg-3 px-2 py-0.5 rounded">{d.date}</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-text-2 mt-2">
                                <span className="font-mono text-status-info">ICD: {d.code}</span>
                                <span className="uppercase">{d.hospital}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {data.prescriptions && (
            <div className="mt-4">
                <h4 className="text-[10px] font-black text-text-2 uppercase mb-3 flex items-center gap-2"><Scroll className="w-3 h-3" /> Reçete Bilgisi</h4>
                <div className="space-y-2">
                    {data.prescriptions.map((p: any, i: number) => (
                        <div key={i} className="bg-bg-2 border border-line-0 rounded p-3">
                            <div className="flex justify-between border-b border-line-0 pb-2 mb-2">
                                <span className="text-[10px] font-bold text-slate-400">Tarih: {p.date}</span>
                                <span className="text-[10px] font-mono text-accent-1">{p.code}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {p.meds.map((m: string, idx: number) => (
                                    <span key={idx} className="text-[10px] bg-bg-3 text-text-1 px-2 py-1 rounded border border-line-0">{m}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        {data.vaccines && (
             <div className="mt-4">
                <h4 className="text-[10px] font-black text-text-2 uppercase mb-3 flex items-center gap-2"><Shield className="w-3 h-3" /> Aşı Bilgisi</h4>
                <div className="space-y-2">
                    {data.vaccines.map((v: any, i: number) => (
                        <div key={i} className="bg-bg-2 border border-line-0 rounded p-3 flex justify-between items-center">
                            <div>
                                <div className="text-xs font-bold text-white">{v.name}</div>
                                <div className="text-[10px] text-text-2">{v.dose}</div>
                            </div>
                            <span className="text-[10px] font-mono bg-bg-3 px-2 py-1 rounded">{v.date}</span>
                        </div>
                    ))}
                </div>
             </div>
        )}
    </div>
);
