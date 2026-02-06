
import React from 'react';
import { Gavel, Shield, FileText, AlertTriangle, FolderOpen } from 'lucide-react';
import { DetailRow } from './DetailRow'; // Assuming DetailRow is also moved or accessible

interface LegalViewProps {
  data: any;
}

export const LegalView: React.FC<LegalViewProps> = ({ data }) => (
    <div className="space-y-6">
        <div className="bg-bg-2 border border-crimson-900/30 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 p-4 opacity-10"><Gavel className="w-16 h-16 text-crimson-500" /></div>
            <h4 className="text-[10px] font-black text-crimson-400 uppercase mb-3">Adli Durum Özeti</h4>
            <DetailRow label="Durum" value={data.criminal_summary?.status || '-'} icon={Shield} isAlert={data.criminal_summary?.status !== 'TEMİZ'} />
            <DetailRow label="GBT Kaydı" value={data.criminal_summary?.gbt || '-'} icon={FileText} isAlert={data.criminal_summary?.gbt !== 'TEMİZ'} />
            <DetailRow label="Aranma Durumu" value={data.criminal_summary?.aranma || '-'} icon={AlertTriangle} isAlert={data.criminal_summary?.aranma !== 'YOK'} />
        </div>

        {data.cases && (
            <div className="bg-bg-2 border border-line-0 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-bg-3 border-b border-line-0 text-[10px] font-black text-text-1 uppercase flex items-center gap-2">
                    <Gavel className="w-3 h-3" /> Açık Davalar
                </div>
                {data.cases.map((c: any, i: number) => (
                    <div key={i} className="p-4 border-b border-line-0 last:border-0 hover:bg-bg-3/50 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white text-xs">{c.mahkeme}</span>
                            <span className="text-[10px] text-text-2 font-mono bg-bg-3 px-1.5 rounded">{c.dosyaNo}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-text-2 mt-1">
                            <span>{c.tur} - {c.taraf}</span>
                            <span className={`font-bold ${c.durum === 'AÇIK' ? 'text-crimson-500' : 'text-emerald-500'}`}>{c.durum}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {data.past_records && (
            <div className="bg-bg-2 border border-line-0 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-bg-3 border-b border-line-0 text-[10px] font-black text-text-1 uppercase flex items-center gap-2">
                    <FolderOpen className="w-3 h-3" /> Geçmiş Adli Kayıtlar
                </div>
                {data.past_records.map((r: any, i: number) => (
                    <div key={i} className="p-4 border-b border-line-0 last:border-0 hover:bg-bg-3/50 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white text-xs">{r.sucTuru}</span>
                            <span className="text-[10px] text-text-2 font-mono bg-bg-3 px-1.5 rounded">{r.kararNo}</span>
                        </div>
                        <div className="text-[10px] text-text-2 mt-1">
                            <span>Ceza: {r.cezaSuresi} | Kesinleşme: {r.kesinlesmeTarihi}</span>
                            <span className={`ml-2 font-bold ${r.infazDurumu === 'TAMAMLANDI' ? 'text-emerald-500' : 'text-amber-500'}`}>{r.infazDurumu}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);
