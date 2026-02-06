
import React from 'react';
import { Users, MapPin, User, FileText } from 'lucide-react';
import { DetailRow } from './DetailRow'; // Assuming DetailRow is also moved or accessible

interface FamilyViewProps {
  data: any;
}

export const FamilyView: React.FC<FamilyViewProps> = ({ data }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
             <DetailRow label="Medeni Hal" value={data.vital_stats?.status || '-'} icon={Users} />
             <DetailRow label="Kütük Yeri" value={data.vital_stats?.registry || '-'} icon={MapPin} />
             <DetailRow label="Baba Adı" value={data.vital_stats?.father_name || '-'} icon={User} />
             <DetailRow label="Anne Adı" value={data.vital_stats?.mother_name || '-'} icon={User} />
             <DetailRow label="Cilt No" value={data.vital_stats?.cilt_no || '-'} icon={FileText} />
             <DetailRow label="Sıra No" value={data.vital_stats?.aile_sira_no || '-'} icon={FileText} />
        </div>
        <div className="space-y-3">
             <h4 className="text-[10px] font-black text-text-2 uppercase border-b border-line-0 pb-2 flex items-center gap-2">
                 <Users className="w-3 h-3" /> Aile Bireyleri Listesi
             </h4>
             {data.family_tree?.map((m: any, i: number) => (
                 <div key={i} className="flex items-center gap-4 bg-bg-2 border border-line-0 p-3 rounded-lg hover:border-text-2 transition-all group">
                     <div className={`w-10 h-10 rounded bg-bg-3 flex items-center justify-center text-xs font-bold border border-line-0
                        ${m.role === 'BABA' || m.role === 'ANNE' ? 'text-amber-500 border-amber-500/30' : 
                          m.role === 'EŞ' ? 'text-pink-500 border-pink-500/30' : 'text-blue-400 border-blue-500/30'}`}>
                         {m.role.substring(0,2)}
                     </div>
                     <div className="flex-1">
                         <div className="flex justify-between items-center">
                             <span className="text-xs font-bold text-white group-hover:text-gold-0 transition-colors">{m.name}</span>
                             <span className="text-[10px] text-text-2 font-mono bg-bg-3 px-1.5 rounded">{m.birth}</span>
                         </div>
                         <div className="flex justify-between mt-1 items-center">
                             <span className="text-[10px] font-mono text-text-2 tracking-wider">{m.tckn}</span>
                             <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${m.status === 'SAĞ' ? 'bg-emerald-900/10 text-emerald-500 border-emerald-900/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>{m.status}</span>
                         </div>
                     </div>
                 </div>
             ))}
        </div>
    </div>
);
