
import React from 'react';
import { PlaneTakeoff, FileText, Calendar, Landmark, Plane } from 'lucide-react';
import { DetailRow } from './DetailRow'; // Assuming DetailRow is also moved or accessible

interface PassportViewProps {
  data: any;
}

export const PassportView: React.FC<PassportViewProps> = ({ data }) => (
    <div className="space-y-6">
        {data.passport_info && (
            <div className="bg-bg-2 border border-cyan-900/30 p-4 rounded-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10"><PlaneTakeoff className="w-16 h-16 text-cyan-500" /></div>
                <h4 className="text-[10px] font-black text-cyan-400 uppercase mb-3">Pasaport Bilgisi</h4>
                <DetailRow label="Pasaport No" value={data.passport_info.passport_no} icon={FileText} />
                <DetailRow label="Veriliş Tarihi" value={data.passport_info.issue_date} icon={Calendar} />
                <DetailRow label="Son Geçerlilik" value={data.passport_info.expiry_date} icon={Calendar} />
                <DetailRow label="Veren Makam" value={data.passport_info.issuing_authority} icon={Landmark} />
                <DetailRow label="Tip" value={data.passport_info.type} icon={FileText} />
            </div>
        )}
        {data.travel_history && (
            <div className="bg-bg-2 border border-line-0 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-bg-3 border-b border-line-0 text-[10px] font-black text-text-1 uppercase flex items-center gap-2">
                    <Plane className="w-3 h-3" /> Seyahat Geçmişi
                </div>
                {data.travel_history.map((travel: any, i: number) => (
                    <div key={i} className="p-4 border-b border-line-0 last:border-0 hover:bg-bg-3/50 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white text-xs">{travel.destination}</span>
                            <span className="text-[10px] text-text-2 font-mono bg-bg-3 px-1.5 rounded">{travel.date}</span>
                        </div>
                        <div className="text-[10px] text-text-2 mt-1">
                            <span>Giriş: {travel.entry_point} | Çıkış: {travel.exit_point}</span>
                            <span className={`ml-2 font-bold ${travel.status === 'OK' ? 'text-emerald-500' : 'text-amber-500'}`}>{travel.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);
