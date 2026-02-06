
import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar, MENU_ITEMS } from './Sidebar';
import { QueryForm } from './QueryForm';
import { LegalWarning } from './LegalWarning';
import { LoginPage } from './LoginPage';
import { PremiumPricing } from './PremiumPricing';
import { AdminDashboard } from './AdminDashboard';
import { CommandPalette } from './CommandPalette';
import { TicketModal } from './TicketModal';
import { QueryType, UserRole, AccessKey, SystemConfig } from '../types';
import { 
  Menu, Wifi, Lock, Zap, User, LogOut, 
  Database, HelpCircle, Laptop, Crown
} from 'lucide-react';

const INITIAL_KEYS: AccessKey[] = [
    { 
        id: 'root-001', 
        key: 'muco5595', 
        role: 'ADMIN', 
        status: 'ACTIVE', 
        createdAt: new Date().toISOString(), 
        expiresAt: new Date(2099, 11, 31).toISOString(), 
        owner: 'SİSTEM KURUCUSU',
        email: 'root@nexux.com',
        lastLogin: new Date().toISOString(),
        usageCount: 0 
    },
    { id: '1', key: 'PRO_8293_XCY', role: 'PREMIUM', status: 'ACTIVE', createdAt: new Date(2024,0,15).toISOString(), expiresAt: new Date(2024,2,15).toISOString(), owner: 'Ahmet Yılmaz', email: 'ahmet.y@kurum.com', lastLogin: new Date(Date.now() - 3600000).toISOString(), usageCount: 142 },
    { id: '2', key: 'VIP_9921_QQZ', role: 'VIP', status: 'ACTIVE', createdAt: new Date(2023,11,1).toISOString(), expiresAt: new Date(2025,0,1).toISOString(), owner: 'M. KAYA (COM)', email: 'm.kaya@holding.com.tr', lastLogin: new Date(Date.now() - 86400000).toISOString(), usageCount: 890 },
    { id: '3', key: 'ULTRA_777_MAX', role: 'ULTRA', status: 'ACTIVE', createdAt: new Date(2024,1,1).toISOString(), expiresAt: new Date(2025,1,1).toISOString(), owner: 'H. DEMİR (ENTERPRISE)', email: 'h.demir@global.net', lastLogin: new Date(Date.now() - 120000).toISOString(), usageCount: 1250 },
];

const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  theme: 'obsidian',
  notifications: { enableEmail: true, enableInApp: true, cpuThreshold: 85, failedLoginThreshold: 5 },
  maintenanceMode: false
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('GUEST');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const [activeQuery, setActiveQuery] = useState<QueryType>('ad_soyad');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [keys, setKeys] = useState<AccessKey[]>(INITIAL_KEYS);
  const [ping, setPing] = useState(4);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    const savedConfig = localStorage.getItem('systemConfig');
    return savedConfig ? JSON.parse(savedConfig) : DEFAULT_SYSTEM_CONFIG;
  });
  const [showSystemAnalysis, setShowSystemAnalysis] = useState(false);

  // Sync command palette items with actual menu permissions
  const ALL_MENU_ITEMS = useMemo(() => {
    return MENU_ITEMS.map(item => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        badge: item.requiredRole
    }));
  }, []);

  const handleLogin = (role: UserRole, key: string) => {
      setUserRole(role);
      setIsAuthenticated(true);
      setActiveQuery(role === 'ADMIN' ? 'admin_dashboard' : 'ad_soyad');
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      setUserRole('GUEST');
      setActiveQuery('ad_soyad');
  };

  const handleCreateKey = (role: UserRole, durationDays: number, owner: string) => {
      const prefix = role === 'ADMIN' ? 'ADM' : role === 'VIP' ? 'VIP' : role === 'ULTRA' ? 'ULT' : 'PRO';
      const newKey: AccessKey = {
          id: crypto.randomUUID(),
          key: `${prefix}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          role,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString(),
          owner,
          email: `${owner.toLowerCase().replace(/\s/g, '.')}@temp.com`,
          lastLogin: new Date().toISOString(),
          usageCount: 0
      };
      setKeys([newKey, ...keys]);
  };

  const handleDeleteKey = (id: string) => setKeys(keys.filter(k => k.id !== id));
  const handleBanKey = (id: string) => setKeys(keys.map(k => k.id === id ? { ...k, status: k.status === 'BANNED' ? 'ACTIVE' : 'BANNED' } : k));
  const handleExtendKey = (id: string, days: number) => {
      setKeys(keys.map(k => {
          if (k.id !== id) return k;
          const currentExpiry = new Date(k.expiresAt).getTime();
          const newExpiry = new Date(currentExpiry + days * 24 * 60 * 60 * 1000).toISOString();
          return { ...k, expiresAt: newExpiry };
      }));
  };

  // NEW: Update user details
  const handleUpdateKey = (updatedKey: AccessKey) => {
      setKeys(keys.map(k => k.id === updatedKey.id ? updatedKey : k));
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
     if(!isAuthenticated) return;
     const interval = setInterval(() => {
         setPing(prev => Math.max(2, Math.min(12, prev + Math.floor(Math.random() * 3) - 1)));
     }, 3000);
     return () => clearInterval(interval);
  }, [isAuthenticated]);

  const renderContent = () => {
      if (activeQuery === 'admin_dashboard') {
          return userRole === 'ADMIN' ? (
              <div className="animate-in fade-in duration-1000">
                   <div className="flex flex-col gap-2 border-l-4 border-accent-2 pl-8 py-3 mb-10">
                        <div className="flex items-center justify-between">
                          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">
                              ADMİN KOMUTA <span className="text-accent-2">MERKEZİ</span>
                          </h1>
                          {userRole === 'ADMIN' && (
                            <button 
                                onClick={() => setShowSystemAnalysis(true)} 
                                className="px-6 py-3 bg-bg-2 border border-line-1 text-text-2 hover:text-white rounded-xl transition-all flex items-center gap-3 group"
                                title="Sistem Verimlilik Analizi"
                            >
                                <Laptop className="w-5 h-5 text-accent-2 group-hover:animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">SİSTEM ANALİZİ</span>
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="bg-accent-2/20 text-accent-2 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border border-accent-2/30 rounded-lg">ROOT_SESSION</span>
                            <span className="text-[10px] text-text-2 font-mono tracking-widest uppercase">Sistem Parametreleri & Operatör Denetimi</span>
                        </div>
                    </div>
                    <AdminDashboard 
                        keys={keys}
                        onCreateKey={handleCreateKey}
                        onDeleteKey={handleDeleteKey}
                        onBanKey={handleBanKey}
                        onExtendKey={handleExtendKey}
                        onUpdateKey={handleUpdateKey}
                        systemConfig={systemConfig}
                        setSystemConfig={setSystemConfig}
                        showSystemAnalysis={showSystemAnalysis}
                        setShowSystemAnalysis={setShowSystemAnalysis}
                    />
              </div>
          ) : <div className="text-accent-2 text-center p-20 font-black uppercase tracking-[0.5em] italic">YETKİSİZ ERİŞİM // PROTOKOL İHLALİ</div>;
      }

      const activeItem = MENU_ITEMS.find(i => i.id === activeQuery);
      const Icon = activeItem?.icon || Database;

      return (
          <div className="animate-in fade-in duration-1000">
            <div className="flex items-center gap-8 mb-10">
              <div className="p-5 bg-bg-2 border border-line-1 rounded-2xl shadow-glow">
                  <Icon className="w-10 h-10 text-accent-2"/>
              </div>
              <div className="flex-1 border-l-4 border-accent-2 pl-8 py-3">
                 <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none italic">
                     {activeItem?.label.toUpperCase() || activeQuery.replace(/_/g, ' ').toUpperCase()}
                 </h1>
                 <div className="flex items-center gap-4 mt-3">
                     <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border rounded-lg 
                        ${userRole === 'VIP' ? 'bg-gold-2 text-gold-0 border-gold-0/30' : 
                          userRole === 'ULTRA' ? 'bg-purple-900/20 text-purple-400 border-purple-500/30' :
                          userRole === 'ADMIN' ? 'bg-accent-2/20 text-accent-2 border-accent-2/30' :
                          'bg-bg-3 text-slate-500 border-line-1'}`}>
                         {userRole}_ACCESS
                     </span>
                     <span className="text-[10px] text-text-2 font-mono tracking-widest uppercase italic">MİT.INT // VERİ ANALİZ ARABİRİMİ</span>
                 </div>
              </div>
            </div>
            <LegalWarning />
            <QueryForm key={activeQuery} title={activeItem?.label || ''} queryType={activeQuery} userRole={userRole} />
          </div>
      );
  };

  if (!isAuthenticated) {
      return (
        <>
            <LoginPage onLogin={handleLogin} onOpenPremium={() => setShowPremiumModal(true)} />
            {showPremiumModal && <PremiumPricing onClose={() => setShowPremiumModal(false)} />}
        </>
      );
  }

  return (
    <div className="h-screen bg-bg-0 flex font-sans text-text-0 overflow-hidden relative selection:bg-accent-2 selection:text-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-vignette pointer-events-none z-0"></div>

      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelect={setActiveQuery}
        userRole={userRole}
        menuItems={ALL_MENU_ITEMS}
      />

      {showPremiumModal && <PremiumPricing onClose={() => setShowPremiumModal(false)} />}
      {showTicketModal && <TicketModal onClose={() => setShowTicketModal(false)} />}

      <Sidebar 
        activeQuery={activeQuery} 
        onSelect={(q) => { setActiveQuery(q); setIsSidebarOpen(false); }} 
        isOpen={isSidebarOpen} 
        userRole={userRole}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10">
        <header className="h-20 bg-bg-0/90 border-b border-line-0 backdrop-blur-xl flex items-center justify-between px-8 shadow-soft z-20">
            <div className="flex items-center gap-6">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2.5 text-text-2 hover:text-white transition-colors bg-bg-2 rounded-xl">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono text-text-2 uppercase tracking-[0.3em]">
                    <span className="flex items-center gap-2 text-status-ok bg-status-ok/5 px-3 py-1.5 rounded-lg border border-status-ok/20">
                        <Lock className="w-3.5 h-3.5 shadow-[0_0_5px_currentColor]" /> ENCRYPTED_V5
                    </span>
                    <span className="text-line-1">|</span>
                    <button 
                      onClick={() => setIsCommandPaletteOpen(true)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line-1 hover:border-text-2 text-text-2 hover:text-white transition-all bg-bg-2 hover:bg-bg-3"
                    >
                      <Zap className="w-3.5 h-3.5" /> CTRL + K
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-8">
                 <div className="hidden lg:flex items-center gap-6 border-r border-line-1 pr-8">
                     {userRole === 'FREE' && <button onClick={() => setShowPremiumModal(true)} className="text-[10px] font-black text-accent-2 hover:text-white transition-all uppercase tracking-widest bg-accent-2/10 px-4 py-2 rounded-xl border border-accent-2/20">Yükselt</button>}
                     <div className="flex items-center gap-3">
                         <div className="text-right">
                             <p className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">
                                {userRole === 'ADMIN' ? 'KURUCU ADMİN' : 
                                 userRole === 'ULTRA' ? 'ULTRA ENTERPRISE' :
                                 userRole === 'VIP' ? 'VIP COMMANDER' : 'SİSTEM ANALİSTİ'}
                             </p>
                             <p className="text-[9px] text-text-2 uppercase tracking-widest mt-1">Erişim Seviyesi: {userRole === 'ADMIN' ? 'ROOT' : userRole === 'ULTRA' ? 'LEVEL_5' : 'LEVEL_4'}</p>
                         </div>
                         <div className={`p-2.5 rounded-2xl border 
                            ${userRole === 'VIP' ? 'border-gold-0/30 bg-gold-2 text-gold-0' : 
                              userRole === 'ULTRA' ? 'border-purple-900/50 bg-purple-900/20 text-purple-400' :
                              userRole === 'ADMIN' ? 'border-accent-2/50 bg-accent-2/20 text-accent-2' :
                              'border-line-1 bg-bg-2 text-slate-500'}`}>
                            {userRole === 'VIP' || userRole === 'ULTRA' || userRole === 'ADMIN' ? <Crown className="w-5 h-5" /> : <User className="w-5 h-5" />}
                         </div>
                     </div>
                 </div>

                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 text-[10px] font-mono text-text-2 bg-bg-2 px-4 py-2 rounded-xl border border-line-0 shadow-inner">
                        <Wifi className={`w-3.5 h-3.5 ${ping > 8 ? 'text-status-warn' : 'text-status-ok'}`} />
                        <span className="font-bold">{ping}ms</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowTicketModal(true)} className="p-3 bg-bg-2 hover:bg-bg-3 border border-line-0 text-text-2 hover:text-white rounded-xl transition-all" title="Destek Talebi">
                            <HelpCircle className="w-5 h-5" />
                        </button>
                        <button onClick={handleLogout} className="p-3 bg-accent-2 hover:bg-accent-1 text-white rounded-xl transition-all shadow-glow group" title="Güvenli Çıkış">
                            <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                 </div>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 sm:p-12 lg:p-16 custom-scrollbar relative">
            <div className="max-w-7xl mx-auto space-y-12 pb-20">
                {renderContent()}

                <div className="border-t border-line-1 mt-20 pt-10 flex flex-col sm:flex-row justify-between items-center text-[10px] text-text-2 font-mono gap-6 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-4">
                        <span className="opacity-50">GATE_ID: {new Date().getTime().toString(16).toUpperCase()}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-800" />
                        <span className="text-accent-2 font-black">SECURE_ROOT_TUNNEL</span>
                    </div>
                    <div className="flex gap-8 font-black">
                       <span className="hover:text-accent-2 cursor-pointer transition-colors">Terminaller</span>
                       <span className="hover:text-accent-2 cursor-pointer transition-colors">SLA Protokol</span>
                       <button onClick={handleLogout} className="text-accent-2 hover:underline">Oturumu Kapat</button>
                    </div>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;
