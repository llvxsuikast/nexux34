
import React, { useState } from 'react';
import { Rocket, Lock, Key, ChevronRight, Fingerprint, Scan, AlertOctagon, Terminal, CheckCircle2, ShieldAlert, Crown, Cpu } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (role: UserRole, key: string) => void;
  onOpenPremium: () => void;
}

const ADMIN_ROOT_KEY_UI = 'muco5595';

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onOpenPremium }) => {
  const [keyInput, setKeyInput] = useState('');
  const [mfaInput, setMfaInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [step, setStep] = useState<'KEY' | 'MFA'>('KEY');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
        let valid = false;
        if (keyInput === ADMIN_ROOT_KEY_UI) {
            setIsAdminMode(true);
            valid = true;
        } else if (keyInput.startsWith('PRO_') || keyInput.startsWith('VIP_') || keyInput.startsWith('ULTRA_') || keyInput === 'GUEST') {
            valid = true;
        }

        if (valid) {
            setLoading(false);
            setStep('MFA');
        } else {
            setLoading(false);
            setError('GEÇERSİZ ERİŞİM PROTOKOLÜ');
        }
    }, 1200);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
        if (mfaInput.length !== 6) {
            setError('DOĞRULAMA KODU HATALI');
            setLoading(false);
            return;
        }

        let role: UserRole = 'GUEST';
        if (keyInput === ADMIN_ROOT_KEY_UI) {
            role = 'ADMIN';
        } else if (keyInput.startsWith('PRO_')) {
            role = 'PREMIUM';
        } else if (keyInput.startsWith('VIP_')) {
            role = 'VIP';
        } else if (keyInput.startsWith('ULTRA_')) {
            role = 'ULTRA';
        }

        setLoginSuccess(true);
        setTimeout(() => {
            onLogin(role, keyInput);
        }, 1500);
    }, 1500);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden p-6 transition-colors duration-1000 ${isAdminMode ? 'bg-[#050000]' : 'bg-bg-0'}`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-vignette opacity-80 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-2/40 to-transparent shadow-[0_0_20px_rgba(193,15,43,0.5)]"></div>
        
        {isAdminMode && <div className="absolute inset-0 bg-scanline opacity-10 animate-scanline pointer-events-none"></div>}

        <div className="relative z-10 w-full max-w-md">
            <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className={`w-24 h-24 mx-auto border rounded-3xl flex items-center justify-center mb-8 relative group transition-all duration-700 shadow-2xl ${isAdminMode ? 'bg-accent-2/20 border-accent-2/50 shadow-accent-2/20' : 'bg-bg-2 border-line-1 shadow-black'}`}>
                    <Rocket className={`w-12 h-12 relative z-10 transition-colors duration-700 ${isAdminMode ? 'text-white' : 'text-accent-2'}`} />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter mb-3 italic">MİT.INT <span className={isAdminMode ? 'text-accent-2 underline decoration-accent-2/30 underline-offset-8' : 'text-accent-2'}>GATEWAY</span></h1>
                <p className={`text-[10px] font-mono uppercase tracking-[0.4em] ${isAdminMode ? 'text-accent-2 font-black' : 'text-text-2'}`}>
                    {isAdminMode ? 'SİSTEM ROOT ERİŞİM ARABİRİMİ' : 'GÜVENLİ VERİ ANALİZ PORTALI'}
                </p>
            </div>

            <div className={`backdrop-blur-3xl border rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden transition-all duration-700 ${isAdminMode ? 'bg-[#100000]/60 border-accent-2/40 shadow-accent-2/10' : 'bg-bg-1/80 border-line-1 shadow-black/80'}`}>
                {step === 'KEY' ? (
                    <form onSubmit={handleKeySubmit} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <div>
                            <label className={`text-[10px] font-black uppercase tracking-widest pl-1 mb-3 block ${isAdminMode ? 'text-accent-2' : 'text-slate-500'}`}>ERİŞİM ANAHTARI</label>
                            <div className="relative group">
                                <Key className={`absolute left-5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-700 ${isAdminMode ? 'text-accent-2' : 'text-slate-700'}`} />
                                <input 
                                    type="password"
                                    value={keyInput}
                                    onChange={(e) => {
                                        setKeyInput(e.target.value);
                                        if (e.target.value === ADMIN_ROOT_KEY_UI) setIsAdminMode(true);
                                    }}
                                    className={`block w-full bg-bg-0 border text-white placeholder-slate-900 font-mono tracking-[0.2em] py-5 pl-14 pr-5 rounded-2xl focus:outline-none transition-all duration-700 ${isAdminMode ? 'border-accent-2 shadow-[0_0_30px_rgba(193,15,43,0.15)]' : 'border-line-1 focus:border-accent-2/50 focus:shadow-glow'}`}
                                    placeholder="••••••••••••••••"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-4 p-4 bg-accent-2/10 border border-accent-2/40 rounded-2xl text-accent-2 text-[10px] font-black animate-in fade-in tracking-widest uppercase">
                                <AlertOctagon className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-5 font-black uppercase tracking-[0.3em] rounded-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group shadow-2xl ${isAdminMode ? 'bg-accent-2 text-white hover:bg-[#800010]' : 'bg-white text-black hover:bg-slate-100'}`}
                        >
                            {loading ? <Scan className="w-6 h-6 animate-spin" /> : <ChevronRight className="w-6 h-6" />}
                            {loading ? 'ANALİZ EDİLİYOR...' : 'DEVAM ET'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleMfaSubmit} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                         <div>
                             <label className="text-[10px] font-black text-accent-2 uppercase tracking-widest mb-3 block pl-1">İKİ ADIMLI DOĞRULAMA (2FA)</label>
                             <div className="relative">
                                <Cpu className="absolute left-5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-accent-2" />
                                <input 
                                    type="text"
                                    maxLength={6}
                                    value={mfaInput}
                                    onChange={(e) => setMfaInput(e.target.value.replace(/\D/g, ''))}
                                    className="block w-full bg-bg-0 border border-accent-2/40 text-white placeholder-slate-900 font-mono tracking-[0.5em] py-5 pl-14 pr-5 rounded-2xl focus:outline-none focus:border-accent-2 transition-all"
                                    placeholder="000000"
                                    autoFocus
                                />
                             </div>
                         </div>

                        {error && (
                            <div className="flex items-center gap-4 p-4 bg-accent-2/10 border border-accent-2/40 rounded-2xl text-accent-2 text-[10px] font-black animate-in fade-in tracking-widest uppercase">
                                <AlertOctagon className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                         <button 
                            type="submit" 
                            disabled={loading || loginSuccess}
                            className={`w-full py-5 font-black uppercase tracking-[0.3em] rounded-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group shadow-2xl ${loginSuccess ? 'bg-status-ok text-white' : 'bg-white text-black hover:bg-slate-100'}`}
                        >
                            {loading ? <Scan className="w-6 h-6 animate-spin" /> : loginSuccess ? <CheckCircle2 className="w-6 h-6" /> : <Fingerprint className="w-6 h-6" />}
                            {loading ? 'DOĞRULANIYOR...' : loginSuccess ? 'ERİŞİM ONAYLANDI' : 'OTURUMU AÇ'}
                        </button>
                    </form>
                )}

                <div className={`mt-10 pt-8 border-t flex flex-col gap-5 ${isAdminMode ? 'border-accent-2/20' : 'border-line-1'}`}>
                    <button onClick={onOpenPremium} className="w-full py-4 bg-gold-2 border border-gold-0/30 text-gold-0 font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 hover:bg-gold-2/30 transition-all">
                         <Crown className="w-4 h-4" /> KURUMSAL LİSANS TALEBİ
                    </button>
                    {step === 'MFA' && (
                        <button onClick={() => { setStep('KEY'); setError(''); setMfaInput(''); }} className="text-center text-[10px] text-slate-700 hover:text-slate-400 uppercase tracking-[0.3em] font-black transition-colors">Geri Dön</button>
                    )}
                </div>
            </div>

            <div className="mt-12 text-center text-[10px] text-slate-800 font-mono space-y-3 uppercase tracking-widest">
                 <p className="opacity-50">TÜM İŞLEMLER OPERATÖR GÜNLÜĞÜNE KAYDEDİLİR</p>
                 <div className="flex items-center justify-center gap-4">
                    <span className="flex items-center gap-1.5 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-status-ok" /> GATEWAY: ONLINE</span>
                 </div>
            </div>
        </div>
    </div>
  );
};
