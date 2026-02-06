
import React from 'react';
import { X, Check, Zap, Shield, Crown, Globe, Database, Smartphone, Star } from 'lucide-react';

interface PremiumPricingProps {
  onClose: () => void;
}

export const PremiumPricing: React.FC<PremiumPricingProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-bg-0/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative w-full max-w-6xl bg-bg-1 border border-line-1 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-500">
            
            <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-bg-3 rounded-full text-text-2 hover:text-white transition-all z-20 hover:rotate-90">
                <X className="w-6 h-6" />
            </button>

            <div className="text-center pt-20 pb-12 px-6 bg-gradient-to-b from-bg-2 to-transparent relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">
                    KURUMSAL <span className="text-accent-2">ERİŞİM PAKETLERİ</span>
                </h2>
                <p className="text-text-2 max-w-2xl mx-auto text-xs font-mono uppercase tracking-[0.3em] opacity-60">
                    Maksimum güvenlikli veri analizi ve stratejik istihbarat çözümleri.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-10 md:px-16 pb-20">
                
                {/* FREE */}
                <div className="bg-bg-2 border border-line-1 rounded-3xl p-8 flex flex-col hover:border-white/20 transition-all group">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">SİVİL ERİŞİM</h3>
                    <div className="text-3xl font-black text-white mb-8 italic">ÜCRETSİZ</div>
                    <ul className="space-y-4 mb-10 flex-1">
                        <li className="flex items-center gap-3 text-[11px] font-bold text-text-2"><Check className="w-4 h-4 text-status-ok" /> Temel Kimlik & TCKN</li>
                        <li className="flex items-center gap-3 text-[11px] font-bold text-text-2"><Check className="w-4 h-4 text-status-ok" /> Yerleşim Bilgisi</li>
                        <li className="flex items-center gap-3 text-[11px] font-bold opacity-30 grayscale"><X className="w-4 h-4" /> Detaylı Raporlama</li>
                    </ul>
                    <button className="w-full py-4 rounded-xl bg-bg-3 text-slate-600 font-black uppercase text-[10px] tracking-widest cursor-not-allowed border border-line-0">AKTİF PROTOKOL</button>
                </div>

                {/* PREMIUM */}
                <div className="bg-bg-2 border border-accent-2/20 rounded-3xl p-8 flex flex-col relative hover:border-accent-2 transition-all shadow-glow group">
                    <h3 className="text-[10px] font-black text-accent-2 uppercase tracking-[0.3em] mb-4">OPERATÖR LİSANSI</h3>
                    <div className="text-3xl font-black text-white mb-2 italic">2.500₺ <span className="text-[10px] font-normal text-text-2 tracking-normal">/ ay</span></div>
                    <div className="text-[9px] text-slate-500 mb-8 font-mono">VEYA 5.000₺ (PREMIUM+)</div>
                    <ul className="space-y-4 mb-10 flex-1">
                        <li className="flex items-center gap-3 text-[11px] font-bold text-text-1"><Check className="w-4 h-4 text-accent-2 shadow-glow" /> Soyağacı & Sağlık</li>
                        <li className="flex items-center gap-3 text-[11px] font-bold text-text-1"><Check className="w-4 h-4 text-accent-2 shadow-glow" /> GSM & Banka Özeti</li>
                        <li className="flex items-center gap-3 text-[11px] font-bold text-text-1"><Check className="w-4 h-4 text-accent-2 shadow-glow" /> Tapu & Mülkiyet</li>
                        <li className="flex items-center gap-3 text-[11px] font-bold text-text-1"><Check className="w-4 h-4 text-accent-2 shadow-glow" /> PDF/CSV/DUMP</li>
                    </ul>
                    <button className="w-full py-4 rounded-xl bg-accent-2 text-white font-black uppercase text-[10px] tracking-widest hover:bg-[#800010] shadow-glow transition-all">PROTOKOLÜ YÜKSELT</button>
                </div>

                {/* VIP */}
                <div className="bg-bg-0 border border-gold-0 rounded-3xl p-8 flex flex-col relative transform lg:-translate-y-6 shadow-gold-glow group">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gold-0 text-black text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-glow">
                        STRATEJİK ÖNERİ
                    </div>
                    <h3 className="text-[10px] font-black text-gold-0 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Crown className="w-4 h-4" /> COMMANDER ACCESS</h3>
                    <div className="text-3xl font-black text-white mb-8 italic">10.000₺ <span className="text-[10px] font-normal text-text-2 tracking-normal">/ ay</span></div>
                    <ul className="space-y-4 mb-10 flex-1">
                        <li className="flex items-center gap-3 text-[11px] font-black text-white"><Star className="w-4 h-4 text-gold-0 fill-gold-0 shadow-glow" /> Tüm Premium Yetkiler</li>
                        <li className="flex items-center gap-3 text-[11px] font-bold text-text-1"><Check className="w-4 h-4 text-gold-0" /> Timeline & Karşılaştırma</li>
                        <li className="flex items-center gap-3 text-[11px] font-bold text-text-1"><Check className="w-4 h-4 text-gold-0" /> XLS & Ham Veri Export</li>
                        <li className="flex items-center gap-3 text-[11px] font-bold text-text-1"><Check className="w-4 h-4 text-gold-0" /> Priority Server Lane</li>
                    </ul>
                    <button className="w-full py-5 rounded-xl bg-gold-0 text-black font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#B8860B] shadow-glow transition-all">VIP ERİŞİM BAŞLAT</button>
                </div>

                {/* VIP+ / CORPORATE */}
                <div className="bg-bg-2 border border-line-1 rounded-3xl p-8 flex flex-col relative hover:border-accent-2 transition-all group">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">ENT. SOLUTIONS</h3>
                    <div className="text-3xl font-black text-white mb-8 italic">41.100₺ <span className="text-[10px] font-normal text-text-2 tracking-normal">/ yıl</span></div>
                    <ul className="space-y-4 mb-10 flex-1">
                        <li className="flex items-center gap-3 text-[11px] font-bold text-text-2"><Check className="w-4 h-4 text-accent-2" /> 10+ Eşzamanlı Oturum</li>
                        <li className="flex items-center gap-3 text-[11px] font-bold text-text-2"><Check className="w-4 h-4 text-accent-2" /> Full API Gateway Access</li>
                        <li className="flex items-center gap-3 text-[11px] font-bold text-text-2"><Check className="w-4 h-4 text-accent-2" /> SLA Destek Protokolü</li>
                    </ul>
                    <button className="w-full py-4 rounded-xl border border-accent-2 text-accent-2 bg-accent-2/10 font-black uppercase text-[10px] tracking-widest hover:bg-accent-2 hover:text-white transition-all">İRTİBAT KUR</button>
                </div>
            </div>
        </div>
    </div>
  );
};
