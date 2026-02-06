
import React from 'react';
import { User, FileText, MapPin, Users, Activity } from 'lucide-react';
import { DetailRow } from './DetailRow'; // Assuming DetailRow is also moved or accessible

interface DetailProfileViewProps {
  data: any;
}

export const DetailProfileView: React.FC<DetailProfileViewProps> = ({ data }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identity Card Replica */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-bg-2 border border-indigo-500/30 p-6 rounded-xl relative overflow-hidden shadow-lg">
                <div className="absolute top-4 right-4 text-indigo-500/20"><User className="w-24 h-24" /></div>
                <div className="relative z-10">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">T.C. Kimlik Kartı Detay</h4>
                    <div className="space-y-3">
                         <div className="flex justify-between border-b border-indigo-500/20 pb-1">
                             <span className="text-[10px] text-indigo-300 uppercase">Seri No</span>
                             <span className="text-xs font-mono font-bold text-white">{data.identity_card?.serial}</span>
                         </div>
                         <div className="flex justify-between border-b border-indigo-500/20 pb-1">
                             <span className="text-[10px] text-indigo-300 uppercase">Geçerlilik</span>
                             <span className="text-xs font-mono font-bold text-white">{data.identity_card?.valid_until}</span>
                         </div>
                         <div className="flex justify-between border-b border-indigo-500/20 pb-1">
                             <span className="text-[10px] text-indigo-300 uppercase">Veren Makam</span>
                             <span className="text-xs font-bold text-white">{data.identity_card?.issuing_authority}</span>
                         </div>
                          <div className="flex justify-between pt-1">
                             <span className="text-[10px] text-indigo-300 uppercase">Kart Tipi</span>
                             <span className="text-xs font-bold text-white">{data.identity_card?.type}</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* Registry Details */}
            <div className="bg-bg-2 border border-line-0 p-6 rounded-xl">
                <h4 className="text-[10px] font-black text-text-2 uppercase tracking-widest mb-4">Nüfus Kayıt Örneği Detay</h4>
                <div className="space-y-2">
                    <DetailRow label="Cilt No" value={data.vital_stats?.cilt_no} icon={FileText} />
                    <DetailRow label="Aile Sıra No" value={data.vital_stats?.aile_sira_no} icon={FileText} />
                    <DetailRow label="Kayıtlı Olduğu Yer" value={data.vital_stats?.registry} icon={MapPin} />
                    <DetailRow label="Doğum Yeri" value={data.vital_stats?.birth_place} icon={MapPin} />
                    <DetailRow label="Medeni Hali" value={data.vital_stats?.status} icon={Users} />
                    <DetailRow label="Dini" value={data.vital_stats?.religion} icon={Activity} />
                </div>
            </div>
        </div>
    </div>
);
