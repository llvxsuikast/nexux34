
import React from 'react';
import { Car, Calendar, FileText, CheckCircle } from 'lucide-react';
import { DetailRow } from './DetailRow'; // Assuming DetailRow is also moved or accessible

interface VehicleViewProps {
  data: any;
}

export const VehicleView: React.FC<VehicleViewProps> = ({ data }) => (
    <div className="space-y-6">
        {data.driver_license && (
            <div className="bg-bg-2 border border-orange-900/30 p-4 rounded-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10"><Car className="w-16 h-16 text-orange-500" /></div>
                <h4 className="text-[10px] font-black text-orange-400 uppercase mb-3">Ehliyet Bilgisi</h4>
                <DetailRow label="Sınıf" value={data.driver_license.class} icon={Car} />
                <DetailRow label="Veriliş Tarihi" value={data.driver_license.date} icon={Calendar} />
                <DetailRow label="Seri No" value={data.driver_license.serial} icon={FileText} />
                <DetailRow label="Durum" value={data.driver_license.status} icon={CheckCircle} isAlert={data.driver_license.status !== 'AKTİF'} />
            </div>
        )}
        {data.vehicles && (
             <div>
                <h4 className="text-[10px] font-black text-text-2 uppercase mb-3 flex items-center gap-2"><Car className="w-3 h-3" /> Araç Tescil</h4>
                <div className="space-y-3">
                    {data.vehicles.map((v: any, i: number) => (
                        <div key={i} className="bg-bg-2 border border-line-0 p-3 rounded flex justify-between items-center hover:border-text-2 transition-colors">
                            <div>
                                 <div className="font-black text-white text-xs">{v.plaka}</div>
                                 <div className="text-[10px] text-text-2">{v.marka} {v.model} - {v.renk}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-mono bg-bg-3 px-2 py-1 rounded">{v.yil}</div>
                                <div className="text-[9px] text-text-2 mt-1">Tescil: {v.tescil}</div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        )}
    </div>
);
