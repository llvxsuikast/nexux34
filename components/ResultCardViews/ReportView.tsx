
import React from 'react';
import { FileText, Database } from 'lucide-react';

interface ReportViewProps {
  data: any;
}

export const ReportView: React.FC<ReportViewProps> = ({ data }) => (
    <div className="space-y-6">
        <div className="bg-bg-2 border border-pink-900/30 p-5 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-pink-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 bg-pink-900/20 rounded-lg border border-pink-900/50 text-pink-500">
                    <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h4 className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-1">Rapor Özeti</h4>
                    <p className="text-sm font-bold text-white leading-relaxed">{data.summary || "Rapor özeti bulunamadı."}</p>
                    <div className="flex gap-3 mt-3 flex-wrap">
                         <div className="text-[9px] font-mono text-text-2 bg-bg-3 px-2 py-1 rounded border border-line-0">
                             <span className="text-slate-500 mr-1">Rapor ID:</span> {data.report_id}
                         </div>
                         <div className="text-[9px] font-mono text-text-2 bg-bg-3 px-2 py-1 rounded border border-line-0">
                             <span className="text-slate-500 mr-1">Oluşturulma:</span> {data.created_at}
                         </div>
                         <div className="text-[9px] font-mono text-text-2 bg-bg-3 px-2 py-1 rounded border border-line-0">
                             <span className="text-slate-500 mr-1">Kaynak:</span> {data.generated_by}
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {data.modules && (
            <div>
                <h4 className="text-[10px] font-black text-text-2 uppercase mb-3 flex items-center gap-2 mt-6"><Database className="w-3 h-3" /> Dahil Edilen Modüller</h4>
                <div className="flex flex-wrap gap-2">
                    {data.modules.map((m: string, i: number) => (
                        <span key={i} className="text-[10px] bg-bg-2 text-text-1 px-3 py-1 rounded border border-line-0">{m}</span>
                    ))}
                </div>
            </div>
        )}
    </div>
);
