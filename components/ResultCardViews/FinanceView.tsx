
import React from 'react';
import { Landmark, CreditCard, Activity } from 'lucide-react';

interface FinanceViewProps {
  data: any;
}

export const FinanceView: React.FC<FinanceViewProps> = ({ data }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-bg-2 border border-line-0 p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute right-0 top-0 p-2 text-status-ok opacity-20"><Landmark className="w-12 h-12" /></div>
                <span className="text-[10px] text-text-2 uppercase font-bold tracking-wider">Toplam Varlık</span>
                <span className="text-xl font-black text-status-ok font-mono">{data.summary?.total_asset || '0 ₺'}</span>
            </div>
            <div className="bg-bg-2 border border-line-0 p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute right-0 top-0 p-2 text-status-warn opacity-20"><CreditCard className="w-12 h-12" /></div>
                <span className="text-[10px] text-text-2 uppercase font-bold tracking-wider">Toplam Borç</span>
                <span className="text-xl font-black text-status-warn font-mono">{data.summary?.total_debt || '0 ₺'}</span>
            </div>
            <div className="bg-bg-2 border border-line-0 p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute right-0 top-0 p-2 text-status-info opacity-20"><Activity className="w-12 h-12" /></div>
                <span className="text-[10px] text-text-2 uppercase font-bold tracking-wider">Kredi Puanı</span>
                <span className="text-xl font-black text-status-info font-mono">{data.summary?.score || '-'}</span>
            </div>
        </div>
        
        <div className="bg-bg-2 border border-line-0 rounded-xl overflow-hidden">
             <div className="px-4 py-3 bg-bg-3 border-b border-line-0 text-[10px] font-black text-text-1 uppercase flex items-center gap-2">
                <CreditCard className="w-3 h-3" /> Banka Hesapları
             </div>
             {data.banks?.map((b: any, i: number) => (
                 <div key={i} className="p-4 border-b border-line-0 last:border-0 flex justify-between items-center hover:bg-bg-3/50 transition-colors group">
                     <div>
                         <div className="font-bold text-white text-xs group-hover:text-gold-0 transition-colors">{b.name}</div>
                         <div className="text-[10px] text-text-2 font-mono mt-0.5">{b.iban}</div>
                         <div className="text-[9px] text-text-2 mt-1 badge inline-block px-1 rounded bg-bg-3">{b.type}</div>
                     </div>
                     <div className="text-right">
                         <div className="font-mono font-bold text-sm text-white">{b.balance}</div>
                         <div className={`text-[9px] px-1.5 py-0.5 rounded inline-block uppercase mt-1 font-bold ${b.status === 'AKTİF' ? 'bg-emerald-900/20 text-emerald-500' : 'bg-red-900/20 text-red-500'}`}>{b.status}</div>
                     </div>
                 </div>
             ))}
        </div>

        {data.cards && (
            <div className="bg-bg-2 border border-line-0 rounded-xl overflow-hidden">
                 <div className="px-4 py-3 bg-bg-3 border-b border-line-0 text-[10px] font-black text-text-1 uppercase">Kredi Kartları</div>
                 {data.cards.map((c: any, i: number) => (
                     <div key={i} className="p-4 flex justify-between items-center border-b border-line-0 last:border-0">
                         <div>
                            <div className="text-xs font-bold text-white">{c.bank}</div>
                            <div className="text-[10px] text-text-2">Kesim: {c.cut_date}</div>
                         </div>
                         <div className="text-right">
                             <div className="text-xs font-mono text-status-warn">Borç: {c.debt}</div>
                             <div className="text-[10px] text-text-2">Limit: {c.limit}</div>
                         </div>
                     </div>
                 ))}
            </div>
        )}
    </div>
);
