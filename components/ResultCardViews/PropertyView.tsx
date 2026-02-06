
import React from 'react';
import { Home, MapPin, Map, FileText } from 'lucide-react';

interface PropertyViewProps {
  data: any;
}

export const PropertyView: React.FC<PropertyViewProps> = ({ data }) => (
    <div className="space-y-6">
        {data.residence && (
            <div className="bg-bg-2 border border-indigo-900/30 p-5 rounded-xl relative overflow-hidden group hover:border-indigo-500/50 transition-all">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Home className="w-24 h-24 text-indigo-500" /></div>
                <h4 className="text-[10px] font-black text-indigo-400 uppercase mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Resmi İkametgah Adresi
                </h4>
                <div className="text-sm font-bold text-white leading-relaxed w-3/4 font-mono">{data.residence.full_address}</div>
                <div className="flex gap-4 mt-6 text-[10px] text-text-2">
                    <span className="bg-bg-3 px-3 py-1.5 rounded border border-line-0">Tarih: {data.residence.move_in_date}</span>
                    <span className="bg-bg-3 px-3 py-1.5 rounded border border-line-0">Tip: {data.residence.type}</span>
                    <span className="bg-bg-3 px-3 py-1.5 rounded border border-line-0">Muhtarlık: {data.residence.muhtarlik}</span>
                </div>
            </div>
        )}
        
        {data.properties && (
             <div>
                <h4 className="text-[10px] font-black text-text-2 uppercase mb-4 flex items-center gap-2 mt-8 border-b border-line-0 pb-2">
                    <Map className="w-4 h-4" /> Tapu & Mülkiyet Varlıkları
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.properties.map((p: any, i: number) => (
                        <div key={i} className="bg-bg-2 border border-line-0 p-5 rounded-xl hover:border-gold-0/50 transition-all group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gold-0/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-black text-black uppercase bg-gold-0 px-2 py-1 rounded shadow-glow">{p.tur}</span>
                                <span className="text-[9px] font-mono text-text-2 bg-bg-3 px-2 py-1 rounded">{p.tarih}</span>
                            </div>
                            
                            <p className="text-xs font-black text-white mb-2">{p.mahalle} / {p.ilçe} / {p.il}</p>
                            
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[10px] text-text-2 mt-4 border-t border-line-0 pt-3">
                                <div className="flex justify-between"><span>Ada:</span> <span className="text-white font-mono">{p.ada}</span></div>
                                <div className="flex justify-between"><span>Parsel:</span> <span className="text-white font-mono">{p.parsel}</span></div>
                                <div className="flex justify-between"><span>Yüzölçüm:</span> <span className="text-white font-mono">{p.yüzölçüm}</span></div>
                                <div className="flex justify-between"><span>Edinim:</span> <span className="text-emerald-500 font-bold">{p.edinim}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        )}
    </div>
);
