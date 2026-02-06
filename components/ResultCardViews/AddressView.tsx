
import React from 'react';
import { MapPin, Home } from 'lucide-react';
import { DetailRow } from './DetailRow'; // Assuming DetailRow is also moved or accessible

interface AddressViewProps {
  data: any;
}

export const AddressView: React.FC<AddressViewProps> = ({ data }) => (
    <div className="space-y-4">
        <div className="bg-bg-2 border border-emerald-900/30 p-5 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 bg-emerald-900/20 rounded-lg border border-emerald-900/50 text-emerald-500">
                    <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Aktif Yerleşim Yeri</h4>
                    <p className="text-sm font-bold text-white leading-relaxed">{data.residence?.full_address || "Kayıt Bulunamadı"}</p>
                    <div className="flex gap-3 mt-3">
                         <div className="text-[9px] font-mono text-text-2 bg-bg-3 px-2 py-1 rounded border border-line-0">
                             <span className="text-slate-500 mr-1">Tarih:</span> {data.residence?.move_in_date}
                         </div>
                         <div className="text-[9px] font-mono text-text-2 bg-bg-3 px-2 py-1 rounded border border-line-0">
                             <span className="text-slate-500 mr-1">Muhtarlık:</span> {data.residence?.muhtarlik}
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {data.properties && (
             <div>
                <h4 className="text-[10px] font-black text-text-2 uppercase mb-3 flex items-center gap-2 mt-6"><Home className="w-3 h-3" /> Mülkiyet Bilgileri</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.properties.map((p: any, i: number) => (
                        <div key={i} className="bg-bg-2 border border-line-0 p-3 rounded hover:border-text-2 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black text-white uppercase bg-bg-3 px-1.5 rounded">{p.tur}</span>
                                <span className="text-[9px] font-mono text-text-2">{p.tarih}</span>
                            </div>
                            <p className="text-xs font-bold text-text-1">{p.mahalle} / {p.ilçe} / {p.il}</p>
                            <div className="flex gap-2 mt-2 text-[9px] text-text-2">
                                <span>Ada: {p.ada}</span>
                                <span>Parsel: {p.parsel}</span>
                                <span className="text-accent-1 font-bold">{p.edinim}</span>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        )}
    </div>
);
