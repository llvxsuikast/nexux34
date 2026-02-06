
import React, { useState } from 'react';
import { X, Send, MessageSquare, AlertCircle, CheckCircle2, ShieldAlert, Key } from 'lucide-react';
import { Ticket, UserRole } from '../types';

interface TicketModalProps {
  onClose: () => void;
  userRole?: UserRole;
}

export const TicketModal: React.FC<TicketModalProps> = ({ onClose, userRole }) => {
  const [type, setType] = useState<Ticket['type']>('SUPPORT');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isVip = userRole === 'VIP' || userRole === 'ADMIN';

  const handleRequestAccess = () => {
    setType('UPGRADE');
    setSubject('VIP/PREMIUM ERİŞİM PROTOKOL TALEBİ');
    setMessage('Sistem yetkilerimin VIP/PREMIUM seviyesine yükseltilmesini talep ediyorum. Gerekli kurumsal onaylar ve operasyonel ihtiyaç listesi ekteki gibidir.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => onClose(), 3000);
  };

  if (submitted) {
      return (
        <div className="fixed inset-0 z-[70] bg-bg-0/95 backdrop-blur-2xl flex items-center justify-center p-6">
            <div className="bg-bg-1 border border-status-ok/30 rounded-[2rem] p-16 text-center animate-in zoom-in-95 duration-500 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                <CheckCircle2 className="w-24 h-24 text-status-ok mx-auto mb-10 animate-bounce shadow-glow rounded-full" />
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic">PROTOKOL KAYDEDİLDİ</h3>
                <p className="text-sm text-slate-500 font-mono leading-relaxed mb-10 max-w-sm mx-auto uppercase">Destek operasyon birimi talebinizi incelemeye aldı. En kısa sürede geri bildirim sağlanacaktır.</p>
                <div className="p-4 bg-bg-2 rounded-2xl border border-line-1 inline-flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-700">TICKET_ID:</span>
                    <span className="text-accent-2 font-black">#TKT-{Math.floor(Math.random()*1000000)}</span>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[70] bg-bg-0/95 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="relative w-full max-w-2xl bg-bg-1 border border-line-1 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center p-10 border-b border-line-0 bg-bg-0 relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] flex items-center gap-4 relative z-10 italic">
                    <MessageSquare className="w-7 h-7 text-accent-2" /> OPERASYONEL <span className="text-accent-2">DESTEK</span>
                </h3>
                <button onClick={onClose} className="text-slate-700 hover:text-white transition-all relative z-10 p-2 bg-bg-3 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-gradient-to-b from-bg-1 to-bg-0 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="bg-accent-2/10 border border-accent-2/20 p-6 rounded-2xl flex items-center justify-between group hover:bg-accent-2/20 transition-all cursor-pointer" onClick={handleRequestAccess}>
                    <div className="flex items-center gap-4">
                        <Key className="w-6 h-6 text-accent-2" />
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">YETKİ YÜKSELTME</p>
                            <p className="text-[9px] text-slate-500 font-mono">PREMIUM veya VIP erişim protokolü talep et</p>
                        </div>
                    </div>
                    <button type="button" onClick={handleRequestAccess} className="px-4 py-2 bg-accent-2 text-white text-[9px] font-black uppercase rounded-lg shadow-glow">TALEBİ BAŞLAT</button>
                </div>

                <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Talep Protokol Türü</label>
                    <div className="grid grid-cols-2 gap-3">
                        {(['PERMISSION', 'UPGRADE', 'SUPPORT', 'REPORT_REQUEST'] as Ticket['type'][]).map(t => (
                            <button 
                                key={t} 
                                type="button" 
                                onClick={() => setType(t)} 
                                className={`py-4 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all transform active:scale-95
                                ${type === t ? 'bg-accent-2/10 text-white border-accent-2 shadow-glow' : 'bg-bg-3 text-slate-600 border-line-0 hover:border-slate-800'}`}
                            >
                                {t.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Talep Başlığı</label>
                    <input 
                        required
                        value={subject} onChange={e => setSubject(e.target.value.toUpperCase())}
                        className="w-full bg-bg-0 border border-line-1 rounded-2xl p-5 text-white text-xs font-bold focus:border-accent-2 outline-none transition-all shadow-inner" 
                        placeholder="Örn: VIP ERİŞİM PROTOKOL HATASI"
                    />
                </div>

                <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Analiz Detayları</label>
                    <textarea 
                        required
                        value={message} onChange={e => setMessage(e.target.value)}
                        rows={5}
                        className="w-full bg-bg-0 border border-line-1 rounded-2xl p-5 text-white text-xs h-40 resize-none focus:border-accent-2 outline-none font-mono leading-relaxed shadow-inner" 
                        placeholder="Karşılaştığınız durumu teknik detaylarıyla açıklayın..."
                    />
                </div>

                <div className={`p-6 rounded-2xl border flex items-start gap-5 transition-colors ${isVip ? 'bg-gold-2/5 border-gold-0/30' : 'bg-bg-2 border-line-1'}`}>
                    {isVip ? <ShieldAlert className="w-6 h-6 text-gold-0 animate-pulse shrink-0" /> : <AlertCircle className="w-6 h-6 text-slate-700 shrink-0" />}
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isVip ? 'text-gold-0' : 'text-slate-500'}`}>
                            {isVip ? 'VIP_SLA_AKTİF' : 'STANDART_İŞLEME_SÜRESİ'}
                        </p>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                            {isVip ? 'Talebiniz öncelikli kanal üzerinden 15 dakika içinde yanıtlanacaktır.' : 'Talepler genellikle 24 saat içinde sonuçlandırılır.'}
                        </p>
                    </div>
                </div>

                <button type="submit" className="w-full py-5 bg-white text-black font-black uppercase text-[11px] tracking-[0.4em] rounded-2xl hover:bg-slate-200 transition-all shadow-glow flex items-center justify-center gap-4 group">
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> TALEBİ SİSTEME GÖNDER
                </button>
            </form>
        </div>
    </div>
  );
};
