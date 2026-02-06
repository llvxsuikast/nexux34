
import React from 'react';
import { Smartphone, Hash } from 'lucide-react';

interface GsmViewProps {
  data: any;
}

export const GsmView: React.FC<GsmViewProps> = ({ data }) => (
    <div className="space-y-6">
        {data.active_lines && (
            <div className="bg-bg-2 border border-blue-900/30 p-4 rounded-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10"><Smartphone className="w-16 h-16 text-blue-500" /></div>
                <h4 className="text-[10px] font-black text-blue-400 uppercase mb-3">Aktif GSM Hatları</h4>
                <div className="space-y-3">
                    {data.active_lines.map((line: any, i: number) => (
                        <div key={i} className="p-3 bg-bg-3 rounded-lg border border-line-0 flex justify-between items-center hover:border-blue-500/50 transition-colors">
                            <div>
                                <div className="text-xs font-bold text-white">{line.number}</div>
                                <div className="text-[10px] text-text-2">{line.operator} - {line.type}</div>
                            </div>
                            <div className="text-right">
                                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${line.status === 'AKTİF' ? 'bg-emerald-900/20 text-emerald-500' : 'bg-red-900/20 text-red-500'}`}>{line.status}</span>
                                <div className="text-[9px] text-text-2 mt-1">Tescil: {line.tescil}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        {data.devices && (
            <div className="bg-bg-2 border border-line-0 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-bg-3 border-b border-line-0 text-[10px] font-black text-text-1 uppercase flex items-center gap-2">
                    <Hash className="w-3 h-3" /> IMEI Cihaz Bilgisi
                </div>
                {data.devices.map((device: any, i: number) => (
                    <div key={i} className="p-4 border-b border-line-0 last:border-0 flex justify-between items-center hover:bg-bg-3/50 transition-colors">
                        <div>
                            <div className="font-bold text-white text-xs">{device.model}</div>
                            <div className="text-[10px] text-text-2 font-mono mt-0.5">{device.imei}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-text-1">Son Görüntü:</div>
                            <div className="text-[10px] text-text-2">{device.last_seen}</div>
                            <div className="text-[9px] text-text-2 mt-1">{device.location}</div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);
