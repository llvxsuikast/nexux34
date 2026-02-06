
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldAlert, Key, Trash2, Clock, 
  CheckCircle, Activity, Search, Server, Lock, Settings, 
  Filter, Bell, Save, Database, Users, Palette,
  Plus, X, Edit, ChevronUp, ChevronDown, RotateCcw,
  ShieldCheck, LayoutDashboard, UserPlus, Fingerprint,
  AlertTriangle, Terminal, Cpu, ShieldX, TrendingUp,
  Mail, Monitor, Globe, HardDrive, BarChart, Ghost, Eye, Check, Laptop,
  Calendar, Info
} from 'lucide-react';
import { AccessKey, UserRole, AuditLog, RoleDefinition, SystemConfig, AdminLogEvent, LogSeverity, QueryType } from '../types';
import { MENU_ITEMS } from './Sidebar';
import { SystemAnalysisModal } from './SystemAnalysisModal';
import { PermissionMatrix } from './PermissionMatrix';

interface AdminDashboardProps {
  keys: AccessKey[];
  onCreateKey: (role: UserRole, durationDays: number, owner: string) => void;
  onDeleteKey: (id: string) => void;
  onBanKey: (id: string) => void;
  onExtendKey: (id: string, days: number) => void;
  onUpdateKey: (key: AccessKey) => void;
  systemConfig: SystemConfig;
  setSystemConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
  showSystemAnalysis: boolean;
  setShowSystemAnalysis: React.Dispatch<React.SetStateAction<boolean>>;
}

const MOCK_LOGS: AuditLog[] = Array.from({ length: 100 }).map((_, i) => ({
    id: `LOG-${3000 + i}`,
    timestamp: new Date(Date.now() - i * 900000).toISOString(),
    event: i % 15 === 0 ? AdminLogEvent.FAILED_LOGIN : i % 10 === 0 ? AdminLogEvent.UNAUTHORIZED_QUERY : AdminLogEvent.SYSTEM_LOGIN,
    user: i % 15 === 0 ? 'ANON_IP: 95.12.XX.X' : ['SİSTEM_ADM', 'ANALİST_CAN', 'OPERATOR_42'][i % 3],
    ip: `10.42.${Math.floor(Math.random()*255)}.${100 + i}`,
    severity: i % 15 === 0 ? LogSeverity.CRITICAL : i % 10 === 0 ? LogSeverity.WARNING : LogSeverity.INFO,
    details: i % 15 === 0 ? 'Multi-deneme başarısız giriş. Olası Brute-Force denemesi tespit edildi.' : 'Kayıt erişim protokolü onaylandı. Veri transferi başarıyla tamamlandı.'
}));

const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  theme: 'obsidian',
  notifications: { enableEmail: true, enableInApp: true, cpuThreshold: 85, failedLoginThreshold: 5 },
  maintenanceMode: false
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  keys, onCreateKey, onDeleteKey, onBanKey, onExtendKey, onUpdateKey,
  systemConfig, setSystemConfig, showSystemAnalysis, setShowSystemAnalysis
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'audit' | 'roles' | 'settings'>('overview');
  
  // --- Create Key State ---
  const [newKeyRole, setNewKeyRole] = useState<UserRole>('PREMIUM');
  const [newKeyOwner, setNewKeyOwner] = useState('');
  const [newKeyDays, setNewKeyDays] = useState(30);
  
  // --- User Management State ---
  const [extendKeyDropdownOpen, setExtendKeyDropdownOpen] = useState<string | null>(null);
  const [customExtendDays, setCustomExtendDays] = useState<number | ''>('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AccessKey | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<UserRole | 'ALL'>('ALL');

  // --- Audit Log State ---
  const [logSearch, setLogSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<LogSeverity | 'ALL'>('ALL');
  const [filterEvent, setFilterEvent] = useState<string>('ALL');
  const [logSort, setLogSort] = useState<{ key: keyof AuditLog, dir: 'asc' | 'desc' }>({ key: 'timestamp', dir: 'desc' });

  // --- Role Definitions State ---
  const [roles, setRoles] = useState<RoleDefinition[]>(() => {
    const savedRoles = localStorage.getItem('roleDefinitions');
    return savedRoles ? JSON.parse(savedRoles) : [
      { id: '1', name: 'FREE_USER', description: 'Temel sorgu erişimi.', permissions: MENU_ITEMS.filter(item => item.requiredRole === 'FREE').map(item => item.id), color: '#64748B' },
      { id: '2', name: 'PREMIUM_OPERATOR', description: 'Genişletilmiş sivil veri erişimi.', permissions: MENU_ITEMS.filter(item => item.requiredRole === 'PREMIUM' || item.requiredRole === 'FREE').map(item => item.id), color: '#6366F1' },
      { id: '3', name: 'VIP_COMMANDER', description: 'Tüm sivil veri, timeline ve karşılaştırma yetkisi.', permissions: MENU_ITEMS.filter(item => item.requiredRole === 'VIP' || item.requiredRole === 'PREMIUM' || item.requiredRole === 'FREE').map(item => item.id), color: '#D4AF37' },
      { id: '4', name: 'ROOT_ADMIN', description: 'Tüm sistem ve yasal sorgulara erişim.', permissions: MENU_ITEMS.map(item => item.id), color: '#C10F2B' },
    ];
  });
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Partial<RoleDefinition> | null>(null);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem('roleDefinitions', JSON.stringify(roles));
  }, [roles]);

  // --- Filtering Logic ---
  const filteredKeys = useMemo(() => {
      return keys.filter(key => {
          const search = userSearchQuery.toLowerCase();
          const matchesSearch = 
              (key.owner?.toLowerCase() || '').includes(search) ||
              (key.email?.toLowerCase() || '').includes(search) ||
              key.key.toLowerCase().includes(search);
          
          const matchesRole = userRoleFilter === 'ALL' || key.role === userRoleFilter;
          return matchesSearch && matchesRole;
      });
  }, [keys, userSearchQuery, userRoleFilter]);

  const sortedAndFilteredLogs = useMemo(() => {
    let list = MOCK_LOGS.filter(l => {
        const term = logSearch.toLowerCase();
        const matchesSearch = l.user.toLowerCase().includes(term) || 
                              l.details.toLowerCase().includes(term) || 
                              l.ip.toLowerCase().includes(term) ||
                              l.id.toLowerCase().includes(term);
        const matchesSeverity = filterSeverity === 'ALL' || l.severity === filterSeverity;
        const matchesEvent = filterEvent === 'ALL' || l.event === filterEvent;
        return matchesSearch && matchesSeverity && matchesEvent;
    });
    
    list.sort((a, b) => {
        const aVal = a[logSort.key];
        const bVal = b[logSort.key];
        
        if (logSort.key === 'timestamp') {
            const timeA = new Date(aVal as string).getTime();
            const timeB = new Date(bVal as string).getTime();
            return logSort.dir === 'asc' ? timeA - timeB : timeB - timeA;
        }

        const strA = String(aVal);
        const strB = String(bVal);
        return logSort.dir === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
    return list;
  }, [logSearch, filterSeverity, filterEvent, logSort]);

  const handleLogSort = (key: keyof AuditLog) => {
    setLogSort(prev => ({
        key,
        dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleSaveSystemSettings = () => {
    localStorage.setItem('systemConfig', JSON.stringify(systemConfig));
    alert('Sistem protokolleri başarıyla güncellendi.');
  };

  const handleResetSystemSettings = () => {
    if (confirm('Sistem ayarlarını varsayılana döndürmek istediğinize emin misiniz?')) {
        setSystemConfig(DEFAULT_SYSTEM_CONFIG);
        localStorage.setItem('systemConfig', JSON.stringify(DEFAULT_SYSTEM_CONFIG));
    }
  };

  const handleSaveUser = () => {
      if (editingUser) {
          onUpdateKey(editingUser);
          setIsEditUserModalOpen(false);
          setEditingUser(null);
      }
  };

  return (
    <div className="flex flex-col h-full bg-bg-1 border border-line-0 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-700">
        
        {showSystemAnalysis && <SystemAnalysisModal onClose={() => setShowSystemAnalysis(false)} />}

        {/* Navigation Tabs */}
        <div className="flex bg-bg-0/60 border-b border-line-0 overflow-x-auto no-scrollbar backdrop-blur-xl">
            {[
                { id: 'overview', label: 'GÖSTERGE PANELİ', icon: LayoutDashboard },
                { id: 'keys', label: 'ERİŞİM ANAHTARLARI', icon: Users }, // Changed icon to Users for semantic correctness
                { id: 'audit', label: 'DENETİM LOGLARI', icon: ShieldAlert },
                { id: 'roles', label: 'ROL TANIMLARI', icon: Lock },
                { id: 'settings', label: 'SİSTEM AYARLARI', icon: Settings },
            ].map(tab => (
                <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative group
                        ${activeTab === tab.id ? 'text-white' : 'text-text-2 hover:text-slate-200'}`}
                >
                    <tab.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-accent-2' : 'text-slate-600'}`} />
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-accent-2 shadow-[0_0_15px_rgba(193,15,43,0.6)]" />}
                </button>
            ))}
        </div>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-gradient-to-b from-bg-1 to-bg-0">
            {activeTab === 'overview' && (
                <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-bg-2 border border-line-0 p-8 rounded-3xl relative overflow-hidden group hover:border-accent-2/40 transition-all">
                             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Users className="w-16 h-16" /></div>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Aktif Oturum</p>
                             <h3 className="text-3xl font-black text-white">124</h3>
                             <p className="text-[9px] text-status-ok font-mono mt-3 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5"/> +12% Verimlilik Artışı</p>
                        </div>
                        <div className="bg-bg-2 border border-line-0 p-8 rounded-3xl group hover:border-status-info/40 transition-all">
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Bellek Kullanımı</p>
                             <h3 className="text-3xl font-black text-status-info">4.2 GB</h3>
                             <div className="w-full h-1.5 bg-bg-3 mt-4 rounded-full overflow-hidden">
                                <div className="h-full bg-status-info w-[42%]" />
                             </div>
                        </div>
                        <div className="bg-bg-2 border border-line-0 p-8 rounded-3xl group hover:border-accent-2 transition-all">
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Güvenlik Tehdidi</p>
                             <h3 className="text-3xl font-black text-accent-2 flex items-center gap-2 tracking-tighter italic">SIFIR <ShieldCheck className="w-6 h-6" /></h3>
                             <p className="text-[9px] text-slate-600 mt-3 font-mono">SİSTEM STABİL // IPS AKTİF</p>
                        </div>
                        <div className="bg-bg-2 border border-line-0 p-8 rounded-3xl group hover:border-status-ok transition-all">
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Veri İletimi</p>
                             <h3 className="text-3xl font-black text-white">824 TB</h3>
                             <p className="text-[9px] text-slate-600 mt-3 font-mono">Toplam Ayrıştırılan Paket</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-bg-2 border border-line-0 rounded-3xl p-8 relative overflow-hidden">
                             <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
                             <h4 className="text-[11px] font-black text-text-1 uppercase tracking-widest mb-8 flex items-center gap-3"><Monitor className="w-4 h-4 text-accent-2" /> Düğüm (Node) Analizi</h4>
                             <div className="space-y-5">
                                {['ANKARA_HUB_01', 'ISTANBUL_CORE_04', 'IZMIR_SECONDARY'].map(node => (
                                    <div key={node} className="flex items-center justify-between p-5 bg-bg-3/50 rounded-2xl border border-line-0 group hover:border-accent-2/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2.5 h-2.5 rounded-full bg-status-ok animate-pulse shadow-[0_0_10px_#1F8A5B]" />
                                            <span className="text-xs font-mono font-bold text-white tracking-widest">{node}</span>
                                        </div>
                                        <div className="text-[11px] font-mono text-slate-500 bg-bg-3 px-3 py-1 rounded">RSP: {Math.floor(Math.random()*8)+2}ms</div>
                                    </div>
                                ))}
                             </div>
                        </div>
                        <div className="bg-bg-2 border border-line-0 rounded-3xl p-8 relative overflow-hidden">
                             <h4 className="text-[11px] font-black text-text-1 uppercase tracking-widest mb-8 flex items-center gap-3"><BarChart className="w-4 h-4 text-status-info" /> Veri Trafik Yoğunluğu</h4>
                             <div className="flex items-end justify-between gap-1.5 h-48">
                                {[40, 70, 55, 95, 65, 85, 50, 90, 45, 30, 60, 40].map((v, i) => (
                                    <div key={i} className="flex-1 bg-accent-2/5 rounded-t-xl group relative cursor-crosshair">
                                        <div className="absolute bottom-0 w-full bg-accent-2/20 group-hover:bg-accent-2 transition-all duration-700" style={{ height: `${v}%` }} />
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-3 text-[10px] px-2 py-1 rounded font-bold">%{v}</div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'keys' && (
                <div className="space-y-10 animate-in fade-in duration-700">
                    <div className="bg-bg-2 border border-line-0 p-10 rounded-3xl shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-scanline opacity-10 pointer-events-none" />
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] mb-10 flex items-center gap-4"><UserPlus className="w-6 h-6 text-accent-2"/> Yetki Protokolü Tanımla</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Protokol Seviyesi</label>
                                <select value={newKeyRole} onChange={e => setNewKeyRole(e.target.value as any)} className="w-full bg-bg-3 border border-line-1 rounded-xl p-4 text-xs text-white outline-none focus:border-accent-2 transition-all">
                                    <option value="FREE">SİVİL (FREE)</option>
                                    <option value="PREMIUM">OPERATÖR (PREMIUM)</option>
                                    <option value="VIP">KOMUTAN (VIP)</option>
                                    <option value="ADMIN">ROOT (ADMIN)</option>
                                </select>
                            </div>
                            <div className="space-y-3 lg:col-span-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Birim Tanımlayıcı / Operatör</label>
                                <input value={newKeyOwner} onChange={e => setNewKeyOwner(e.target.value)} className="w-full bg-bg-3 border border-line-1 rounded-xl p-4 text-xs text-white outline-none focus:border-accent-2 transition-all font-mono" placeholder="Örn: ANALIZ_BİRİMİ_D5" />
                            </div>
                            <button onClick={() => { onCreateKey(newKeyRole, newKeyDays, newKeyOwner); setNewKeyOwner(''); }} className="py-4 bg-white text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-xl hover:bg-slate-200 transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98]">YETKİ AKTİF ET</button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-bg-2 border border-line-0 p-6 rounded-3xl">
                        <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    value={userSearchQuery}
                                    onChange={(e) => setUserSearchQuery(e.target.value)}
                                    placeholder="İsim, E-posta veya Anahtar Ara..."
                                    className="w-full bg-bg-3 border border-line-1 rounded-xl pl-12 pr-4 py-3 text-xs text-white focus:border-accent-2 outline-none"
                                />
                            </div>
                            <select 
                                value={userRoleFilter}
                                onChange={(e) => setUserRoleFilter(e.target.value as any)}
                                className="bg-bg-3 border border-line-1 rounded-xl px-4 py-3 text-xs text-white focus:border-accent-2 outline-none font-bold uppercase"
                            >
                                <option value="ALL">Tüm Roller</option>
                                <option value="FREE">FREE</option>
                                <option value="PREMIUM">PREMIUM</option>
                                <option value="VIP">VIP</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            {filteredKeys.length} KULLANICI LİSTELENDİ
                        </div>
                    </div>

                    <div className="bg-bg-2 border border-line-0 rounded-3xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-bg-0/60 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-line-0">
                                    <th className="p-7">İMZA (KEY)</th>
                                    <th className="p-7">SEVİYE</th>
                                    <th className="p-7">SAHİP / KULLANICI</th>
                                    <th className="p-7">DURUM</th>
                                    <th className="p-7 text-right">İŞLEMLER</th>
                                </tr>
                            </thead>
                            <tbody className="text-[11px] font-mono divide-y divide-line-0/50">
                                {filteredKeys.map(key => (
                                    <React.Fragment key={key.id}>
                                        <tr 
                                            className={`hover:bg-white/[0.02] transition-colors group cursor-pointer ${expandedUserId === key.id ? 'bg-white/[0.03]' : ''}`}
                                            onClick={() => setExpandedUserId(expandedUserId === key.id ? null : key.id)}
                                        >
                                            <td className="p-7 text-white font-bold tracking-tight flex items-center gap-3">
                                                <div className={`transition-transform duration-300 ${expandedUserId === key.id ? 'rotate-90' : ''}`}>
                                                    <ChevronDown className="w-3 h-3 text-slate-500" />
                                                </div>
                                                {key.key}
                                            </td>
                                            <td className="p-7">
                                                <span className={`px-2.5 py-1 rounded text-[9px] font-black tracking-tighter ${key.role === 'ADMIN' ? 'bg-accent-2/20 text-accent-2 border border-accent-2/30' : key.role === 'VIP' ? 'bg-gold-2 text-gold-0 border border-gold-0/30' : 'bg-bg-3 text-text-2 border border-line-0'}`}>{key.role}</span>
                                            </td>
                                            <td className="p-7 text-slate-400 font-bold uppercase">
                                                <div className="flex flex-col">
                                                    <span className="text-white">{key.owner || 'SİSTEM'}</span>
                                                    {key.email && <span className="text-[9px] text-slate-600 lowercase">{key.email}</span>}
                                                </div>
                                            </td>
                                            <td className="p-7">
                                                <span className={`flex items-center gap-2.5 font-black uppercase tracking-widest ${key.status === 'ACTIVE' ? 'text-status-ok' : key.status === 'BANNED' ? 'text-status-bad' : 'text-status-warn'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${key.status === 'ACTIVE' ? 'bg-status-ok animate-pulse shadow-[0_0_8px_#1F8A5B]' : 'bg-status-bad'}`} />
                                                    {key.status === 'ACTIVE' ? 'AKTİF' : key.status === 'BANNED' ? 'YASAKLI' : 'SÜRESİ DOLMUŞ'}
                                                </span>
                                            </td>
                                            <td className="p-7 text-right relative" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex gap-2.5 justify-end">
                                                    <div className="relative">
                                                        <button 
                                                            onClick={() => setExtendKeyDropdownOpen(extendKeyDropdownOpen === key.id ? null : key.id)} 
                                                            title="Süre Uzat" 
                                                            className="p-2.5 bg-bg-3 border border-line-0 rounded-xl text-text-2 hover:text-white transition-all"
                                                        >
                                                            <Clock className="w-4 h-4" />
                                                        </button>
                                                        {extendKeyDropdownOpen === key.id && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-bg-2 border border-line-1 rounded-lg shadow-xl z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                                                                <button onClick={() => { onExtendKey(key.id, 30); setExtendKeyDropdownOpen(null); }} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-bg-3 rounded-t-lg">30 Gün Ekle</button>
                                                                <button onClick={() => { onExtendKey(key.id, 90); setExtendKeyDropdownOpen(null); }} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-bg-3">90 Gün Ekle</button>
                                                                <button onClick={() => { onExtendKey(key.id, 180); setExtendKeyDropdownOpen(null); }} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-bg-3">180 Gün Ekle</button>
                                                                <div className="border-t border-line-0 mt-1 pt-1">
                                                                    <input 
                                                                        type="number" 
                                                                        placeholder="Özel Gün" 
                                                                        value={customExtendDays}
                                                                        onChange={(e) => setCustomExtendDays(parseInt(e.target.value) || '')}
                                                                        className="w-full bg-bg-0 border border-line-0 text-sm text-white px-4 py-2 focus:outline-none"
                                                                    />
                                                                    <button 
                                                                        onClick={() => { if (customExtendDays) onExtendKey(key.id, customExtendDays as number); setExtendKeyDropdownOpen(null); setCustomExtendDays(''); }}
                                                                        disabled={!customExtendDays}
                                                                        className={`block w-full text-center px-4 py-2 text-sm font-bold uppercase rounded-b-lg ${customExtendDays ? 'bg-accent-2 text-white' : 'bg-bg-3 text-slate-500 cursor-not-allowed'}`}
                                                                    >
                                                                        Uygula
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button onClick={() => { setEditingUser(key); setIsEditUserModalOpen(true); }} title="Düzenle" className="p-2.5 bg-bg-3 border border-line-0 rounded-xl text-text-2 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                                                    <button onClick={() => onBanKey(key.id)} title={key.status === 'BANNED' ? 'Aktif Et' : 'Engelle'} className="p-2.5 bg-bg-3 border border-line-0 rounded-xl text-text-2 hover:text-status-bad transition-all"><ShieldX className="w-4 h-4" /></button>
                                                    <button onClick={() => onDeleteKey(key.id)} title="Yok Et" className="p-2.5 bg-bg-3 border border-line-0 rounded-xl text-text-2 hover:text-accent-2 transition-all"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedUserId === key.id && (
                                            <tr className="bg-bg-0/30">
                                                <td colSpan={6} className="p-0">
                                                    <div className="p-8 border-y border-line-0 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-top-2">
                                                        <div className="space-y-4">
                                                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                                <Mail className="w-3 h-3" /> İletişim & Kimlik
                                                            </h4>
                                                            <div className="space-y-2">
                                                                <div className="bg-bg-2 p-3 rounded-xl border border-line-0 flex justify-between">
                                                                    <span className="text-[10px] text-slate-500">E-Posta</span>
                                                                    <span className="text-[10px] font-bold text-white">{key.email || 'Tanımlanmamış'}</span>
                                                                </div>
                                                                <div className="bg-bg-2 p-3 rounded-xl border border-line-0 flex justify-between">
                                                                    <span className="text-[10px] text-slate-500">Kayıt ID</span>
                                                                    <span className="text-[10px] font-mono text-slate-400">{key.id.split('-')[0]}...</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                                <Activity className="w-3 h-3" /> Aktivite Metrikleri
                                                            </h4>
                                                            <div className="space-y-2">
                                                                <div className="bg-bg-2 p-3 rounded-xl border border-line-0 flex justify-between">
                                                                    <span className="text-[10px] text-slate-500">Toplam Sorgu</span>
                                                                    <span className="text-[10px] font-black text-white">{key.usageCount}</span>
                                                                </div>
                                                                <div className="bg-bg-2 p-3 rounded-xl border border-line-0 flex justify-between">
                                                                    <span className="text-[10px] text-slate-500">Son Erişim</span>
                                                                    <span className="text-[10px] font-mono text-accent-2">{key.lastLogin ? new Date(key.lastLogin).toLocaleString('tr-TR') : 'Hiç Görülmedi'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                                <Calendar className="w-3 h-3" /> Zaman Çizelgesi
                                                            </h4>
                                                            <div className="space-y-2">
                                                                <div className="bg-bg-2 p-3 rounded-xl border border-line-0 flex justify-between">
                                                                    <span className="text-[10px] text-slate-500">Oluşturulma</span>
                                                                    <span className="text-[10px] font-mono text-slate-400">{new Date(key.createdAt).toLocaleDateString('tr-TR')}</span>
                                                                </div>
                                                                <div className="bg-bg-2 p-3 rounded-xl border border-line-0 flex justify-between">
                                                                    <span className="text-[10px] text-slate-500">Bitiş Tarihi</span>
                                                                    <span className="text-[10px] font-mono text-status-warn">{new Date(key.expiresAt).toLocaleDateString('tr-TR')}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'audit' && (
                <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-bg-2/80 border border-line-0 p-7 rounded-3xl shadow-xl backdrop-blur-2xl">
                        <div className="md:col-span-1 relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-600 group-focus-within:text-accent-2 transition-colors" />
                            <input value={logSearch} onChange={e => setLogSearch(e.target.value)} className="w-full bg-bg-3 border border-line-1 rounded-xl pl-14 pr-5 py-4 text-xs text-white focus:border-accent-2 outline-none transition-all" placeholder="ID, IP veya Operatör ara..." />
                        </div>
                        <div className="flex gap-3">
                             <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value as any)} className="flex-1 bg-bg-3 border border-line-1 rounded-xl px-6 py-4 text-xs text-text-2 outline-none focus:border-accent-2 transition-all uppercase font-black tracking-widest">
                                <option value="ALL">TÜM SEVİYELER</option>
                                <option value={LogSeverity.CRITICAL}>KRİTİK</option>
                                <option value={LogSeverity.WARNING}>UYARI</option>
                                <option value={LogSeverity.INFO}>BİLGİ</option>
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <select value={filterEvent} onChange={e => setFilterEvent(e.target.value)} className="flex-1 bg-bg-3 border border-line-1 rounded-xl px-6 py-4 text-xs text-text-2 outline-none focus:border-accent-2 transition-all uppercase font-black tracking-widest">
                                <option value="ALL">TÜM OLAYLAR</option>
                                {Object.values(AdminLogEvent).map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                            <button onClick={() => { setLogSearch(''); setFilterSeverity('ALL'); setFilterEvent('ALL'); }} className="p-4 bg-bg-3 border border-line-1 rounded-xl text-text-2 hover:text-white transition-all"><RotateCcw className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="bg-bg-2 border border-line-0 rounded-3xl overflow-hidden shadow-2xl relative">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-bg-0/60 text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] border-b border-line-0">
                                        <th className="p-7 cursor-pointer hover:text-white transition-colors" onClick={() => handleLogSort('timestamp')}>
                                            ZAMAN {logSort.key === 'timestamp' && (logSort.dir === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th className="p-7">SEVİYE</th>
                                        <th className="p-7 cursor-pointer hover:text-white transition-colors" onClick={() => handleLogSort('event')}>
                                            İŞLEM {logSort.key === 'event' && (logSort.dir === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th className="p-7 cursor-pointer hover:text-white transition-colors" onClick={() => handleLogSort('user')}>
                                            OPERATÖR {logSort.key === 'user' && (logSort.dir === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th className="p-7">OPERASYONEL DETAYLAR</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px] font-mono divide-y divide-line-0/30">
                                    {sortedAndFilteredLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-7 text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString('tr-TR')}</td>
                                            <td className="p-7">
                                                <span className={`px-2 py-1 rounded text-[9px] font-black ${
                                                    log.severity === LogSeverity.CRITICAL ? 'bg-accent-2/20 text-accent-2' : 
                                                    log.severity === LogSeverity.WARNING ? 'bg-status-warn/20 text-status-warn' : 
                                                    'bg-bg-3 text-slate-500'
                                                }`}>{log.severity}</span>
                                            </td>
                                            <td className="p-7 font-bold text-white uppercase tracking-tighter">{log.event}</td>
                                            <td className="p-7 text-slate-300">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold tracking-widest">{log.user}</span>
                                                    <span className="text-[9px] text-slate-600 italic">{log.ip}</span>
                                                </div>
                                            </td>
                                            <td className="p-7 text-slate-500 leading-relaxed max-w-sm">{log.details}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {sortedAndFilteredLogs.length === 0 && <div className="p-24 text-center text-slate-800 text-xs font-black uppercase tracking-[0.5em]">HİÇBİR KAYIT PROTOKOLÜNE RASTLANMADI</div>}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'roles' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-700">
                    <div className="lg:col-span-1 space-y-5">
                        <button onClick={() => { setEditingRole({name: '', permissions: [], description: '', color: '#C10F2B'}); setIsRoleModalOpen(true); }} className="w-full py-6 bg-accent-2 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-accent-1 shadow-glow transition-all flex items-center justify-center gap-4 group">
                            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" /> YENİ ROL PROTOTİPİ
                        </button>
                        <div className="bg-bg-2 border border-line-0 rounded-3xl overflow-hidden divide-y divide-line-0/40">
                            {roles.map(role => (
                                <div key={role.id} className="p-7 hover:bg-white/[0.02] transition-colors flex justify-between items-center group">
                                    <div className="flex-1">
                                        <div className={`font-black text-sm uppercase tracking-tighter flex items-center gap-2.5`} style={{ color: role.color }}>
                                            <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: role.color }} />
                                            {role.name}
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-2 line-clamp-1 italic font-mono">{role.description}</div>
                                        <div className="mt-2 text-[9px] font-black text-slate-600 bg-bg-3 inline-block px-2 py-0.5 rounded border border-line-0 uppercase tracking-widest">
                                            {role.permissions.length} YETKİ TANIMLI
                                        </div>
                                    </div>
                                    <div className="flex gap-2.5 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                        <button onClick={() => { setEditingRole(role); setIsRoleModalOpen(true); }} className="p-2.5 bg-bg-3 border border-line-0 rounded-xl text-text-2 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => { if(confirm('Rolü silmek istediğinize emin misiniz?')) setRoles(roles.filter(r => r.id !== role.id)); }} className="p-2.5 bg-bg-3 border border-line-0 rounded-xl text-text-2 hover:text-accent-2 transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-2 bg-bg-2/30 border border-line-0 rounded-3xl p-8 relative overflow-hidden">
                        <PermissionMatrix roles={roles} />
                    </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-16">
                    <div className="bg-bg-2 border border-line-0 rounded-3xl p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5"><Palette className="w-32 h-32" /></div>
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] mb-12 flex items-center gap-4"><Palette className="w-6 h-6 text-accent-2" /> Görsel Protokol & Arayüz</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            {(['obsidian', 'steel', 'blue'] as const).map(t => (
                                <button key={t} onClick={() => setSystemConfig({...systemConfig, theme: t})} className={`group p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-5 relative overflow-hidden ${systemConfig.theme === t ? 'bg-accent-2/5 border-accent-2 text-white shadow-glow scale-105' : 'bg-bg-3 border-line-1 text-slate-500 hover:border-text-2'}`}>
                                    <div className={`w-full h-20 rounded-2xl bg-gradient-to-br transition-transform group-hover:scale-110 shadow-lg ${t === 'obsidian' ? 'from-black to-slate-900 border border-slate-800' : t === 'steel' ? 'from-slate-700 to-slate-500 border border-slate-600' : 'from-blue-950 to-indigo-900 border border-blue-900'}`} />
                                    <span className="text-[12px] font-black uppercase tracking-widest">{t}</span>
                                    {systemConfig.theme === t && <Check className="absolute top-4 right-4 w-5 h-5 text-accent-2" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-bg-2 border border-line-0 rounded-3xl p-12">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] mb-12 flex items-center gap-4"><Bell className="w-6 h-6 text-status-info" /> Eşik Değerleri & Güvenlik Kısıtlamaları</h3>
                        <div className="space-y-12">
                            <div className="flex items-center justify-between p-8 bg-accent-2/5 border border-accent-2/30 rounded-3xl shadow-inner group">
                                <div className="space-y-2">
                                    <p className="text-base font-black text-white uppercase flex items-center gap-3 italic tracking-tight"><Ghost className="w-5 h-5 text-accent-2 animate-pulse" /> SİSTEM BAKIM (QUARANTINE) MODU</p>
                                    <p className="text-[11px] text-slate-500 font-mono leading-relaxed max-w-lg">Bu protokol aktif edildiğinde sadece ROOT kimlikli operatörler sisteme erişebilir. Mevcut tüm diğer oturumlar otomatik olarak sonlandırılır.</p>
                                </div>
                                <button onClick={() => setSystemConfig({...systemConfig, maintenanceMode: !systemConfig.maintenanceMode})} className={`px-10 py-4 rounded-xl text-[11px] font-black tracking-widest transition-all transform active:scale-95 border ${systemConfig.maintenanceMode ? 'bg-accent-2 text-white border-accent-2 shadow-glow' : 'bg-bg-3 text-text-2 border-line-1 hover:text-white'}`}>
                                    {systemConfig.maintenanceMode ? 'AKTİF (PROTOKOL 4)' : 'PASİF (STANDART)'}
                                </button>
                            </div>
                            <div className="space-y-8">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <Cpu className="w-5 h-5 text-slate-600" />
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Merkezi İşlemci Kritik Alarm Eşiği</p>
                                    </div>
                                    <span className="text-sm font-mono font-bold text-accent-2 bg-accent-2/10 px-4 py-1.5 rounded-full border border-accent-2/20">%{systemConfig.notifications.cpuThreshold}</span>
                                </div>
                                <input type="range" min="10" max="99" value={systemConfig.notifications.cpuThreshold} onChange={e => setSystemConfig({...systemConfig, notifications: {...systemConfig.notifications, cpuThreshold: parseInt(e.target.value)}})} className="w-full h-2 bg-bg-3 rounded-lg appearance-none accent-accent-2 cursor-pointer" />
                            </div>
                            <div className="flex items-center justify-between p-8 bg-bg-0/50 rounded-3xl border border-line-1 hover:border-slate-700 transition-colors shadow-soft">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-status-warn/10 rounded-2xl border border-status-warn/20 text-status-warn">
                                        <Lock className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-black text-white uppercase tracking-widest">Hatalı Giriş Otomatik IP Karantinası</p>
                                        <p className="text-[10px] text-slate-600 mt-2 font-mono leading-relaxed">Belirlenen deneme sınırını aşan IP adresleri sistemsel olarak kısıtlanır.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-bg-3 p-2 rounded-2xl border border-line-1">
                                    <span className="text-[10px] font-black text-slate-500 uppercase px-3">DENEME:</span>
                                    <input type="number" value={systemConfig.notifications.failedLoginThreshold} onChange={e => setSystemConfig({...systemConfig, notifications: {...systemConfig.notifications, failedLoginThreshold: parseInt(e.target.value)}})} className="w-20 bg-bg-0 border border-line-1 rounded-xl p-3 text-center text-sm text-white font-bold focus:border-accent-2 outline-none transition-all shadow-inner" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-6">
                        <button onClick={handleResetSystemSettings} className="px-12 py-6 bg-bg-3 text-slate-600 font-black uppercase text-[11px] tracking-[0.4em] rounded-2xl border border-line-1 hover:text-white hover:bg-bg-3/80 transition-all">DEĞİŞİKLİKLERİ İPTAL ET</button>
                        <button onClick={handleSaveSystemSettings} className="px-12 py-6 bg-white text-black font-black uppercase text-[11px] tracking-[0.4em] rounded-2xl shadow-glow hover:bg-slate-200 transition-all flex items-center gap-4 group">
                            <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" /> SİSTEM AYARLARINI KODLA
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* User Edit Modal */}
        {isEditUserModalOpen && editingUser && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6">
                <div className="bg-bg-1 border border-line-1 w-full max-w-2xl rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[95vh]">
                    <div className="p-10 border-b border-line-0 bg-bg-0 flex justify-between items-center relative">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4 relative z-10 italic">
                            <Edit className="w-6 h-6 text-accent-2" /> KULLANICI DÜZENLEME PANELİ
                        </h3>
                        <button onClick={() => setIsEditUserModalOpen(false)} className="text-slate-500 hover:text-white transition-all relative z-10 p-3 bg-bg-3 rounded-full hover:rotate-90"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Erişim Anahtarı (READ-ONLY)</label>
                            <input value={editingUser.key} disabled className="w-full bg-bg-2 border border-line-1 rounded-xl p-4 text-xs font-mono text-slate-400 outline-none cursor-not-allowed" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Sahip / İsim</label>
                                <input 
                                    value={editingUser.owner || ''} 
                                    onChange={e => setEditingUser({...editingUser, owner: e.target.value})} 
                                    className="w-full bg-bg-3 border border-line-1 rounded-xl p-4 text-xs text-white outline-none focus:border-accent-2 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">E-Posta Adresi</label>
                                <input 
                                    value={editingUser.email || ''} 
                                    onChange={e => setEditingUser({...editingUser, email: e.target.value})} 
                                    className="w-full bg-bg-3 border border-line-1 rounded-xl p-4 text-xs text-white outline-none focus:border-accent-2 transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Yetki Rolü</label>
                                <select 
                                    value={editingUser.role} 
                                    onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})} 
                                    className="w-full bg-bg-3 border border-line-1 rounded-xl p-4 text-xs text-white outline-none focus:border-accent-2 transition-all"
                                >
                                    <option value="FREE">FREE</option>
                                    <option value="PREMIUM">PREMIUM</option>
                                    <option value="VIP">VIP</option>
                                    <option value="ULTRA">ULTRA</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Hesap Durumu</label>
                                <select 
                                    value={editingUser.status} 
                                    onChange={e => setEditingUser({...editingUser, status: e.target.value as any})} 
                                    className="w-full bg-bg-3 border border-line-1 rounded-xl p-4 text-xs text-white outline-none focus:border-accent-2 transition-all"
                                >
                                    <option value="ACTIVE">AKTİF</option>
                                    <option value="BANNED">YASAKLI</option>
                                    <option value="EXPIRED">SÜRESİ DOLMUŞ</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 bg-bg-0 border-t border-line-0 flex gap-4">
                        <button onClick={() => setIsEditUserModalOpen(false)} className="flex-1 py-4 bg-bg-3 text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] rounded-xl hover:text-white transition-all">İPTAL</button>
                        <button onClick={handleSaveUser} className="flex-[2] py-4 bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-xl shadow-glow hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
                            <Save className="w-4 h-4" /> KAYDET VE GÜNCELLE
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Role Edit Modal */}
        {isRoleModalOpen && editingRole && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6">
                <div className="bg-bg-1 border border-line-1 w-full max-w-5xl rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[95vh]">
                    <div className="p-10 border-b border-line-0 bg-bg-0 flex justify-between items-center relative">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-5 relative z-10 italic">
                            <Plus className="w-8 h-8 text-accent-2" /> {editingRole.id ? 'ROL KONFİGÜRASYONUNU GÜNCELLE' : 'YENİ ROL PROTOTİPİ OLUŞTUR'}
                        </h3>
                        <button onClick={() => setIsRoleModalOpen(false)} className="text-slate-500 hover:text-white transition-all relative z-10 p-3 bg-bg-3 rounded-full hover:rotate-90"><X className="w-6 h-6" /></button>
                    </div>
                    <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12 overflow-y-auto custom-scrollbar">
                        <div className="space-y-10">
                            <div>
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Birim Tanımlayıcı (ROL ID)</label>
                                <input value={editingRole.name} onChange={e => setEditingRole({...editingRole, name: e.target.value.toUpperCase().replace(/\s/g, '_')})} className="w-full bg-bg-0 border border-line-1 rounded-2xl p-5 text-white text-base font-black outline-none focus:border-accent-2 transition-all placeholder-slate-900 shadow-inner" placeholder="Örn: FIELD_COMMANDER_V2" />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Operasyonel Görev Tanımı</label>
                                <textarea value={editingRole.description} onChange={e => setEditingRole({...editingRole, description: e.target.value})} className="w-full bg-bg-0 border border-line-1 rounded-2xl p-5 text-white text-xs h-40 resize-none outline-none focus:border-accent-2 transition-all font-mono leading-relaxed placeholder-slate-900 shadow-inner" placeholder="Bu rolün sistem fonksiyonları üzerindeki hakimiyetini detaylandırın..." />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-5 block">Görsel Kod (Renk Ataması)</label>
                                <div className="flex gap-5">
                                    {['#64748B', '#C10F2B', '#6366F1', '#10B981', '#D4AF37', '#3B82F6'].map(c => (
                                        <button key={c} onClick={() => setEditingRole({...editingRole, color: c})} className={`w-12 h-12 rounded-full border-4 transition-all flex items-center justify-center ${editingRole.color === c ? 'border-white scale-125 shadow-glow' : 'border-transparent'}`} style={{ backgroundColor: c }}>
                                            {editingRole.color === c && <Check className="w-5 h-5 text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block">Fonksiyonel Yetkilendirme Listesi ({editingRole.permissions?.length || 0})</label>
                                <button onClick={() => setEditingRole({...editingRole, permissions: editingRole.permissions?.length === MENU_ITEMS.length ? [] : MENU_ITEMS.map(i => i.id)})} className="text-[10px] font-black text-accent-2 uppercase hover:underline tracking-widest decoration-2">TÜMÜNÜ SEÇ / SIFIRLA</button>
                            </div>
                            <div className="bg-bg-0/60 border border-line-1 rounded-3xl p-4 max-h-[500px] overflow-y-auto custom-scrollbar space-y-2 shadow-inner">
                                {MENU_ITEMS.map(perm => {
                                    const active = editingRole.permissions?.includes(perm.id);
                                    return (
                                        <button 
                                            key={perm.id} 
                                            onClick={() => {
                                                const current = editingRole.permissions || [];
                                                setEditingRole({...editingRole, permissions: active ? current.filter(p => p !== perm.id) : [...current, perm.id]});
                                            }}
                                            className={`w-full text-left p-5 rounded-2xl text-[10px] font-mono font-black transition-all flex justify-between items-center group
                                                ${active ? 'bg-accent-2/10 text-white border border-accent-2/30 shadow-glow' : 'text-slate-700 hover:bg-white/5 border border-transparent'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <perm.icon className={`w-5 h-5 transition-colors ${active ? 'text-accent-2' : 'text-slate-900 group-hover:text-slate-700'}`} />
                                                <span className="tracking-tight uppercase">{perm.label}</span>
                                            </div>
                                            {active ? <div className="w-5 h-5 rounded-full bg-accent-2 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" /></div> : <div className="w-5 h-5 rounded-full border-2 border-slate-900" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="p-10 bg-bg-0 border-t border-line-0 flex gap-6">
                        <button onClick={() => setIsRoleModalOpen(false)} className="flex-1 py-6 bg-bg-3 text-slate-500 font-black uppercase text-[11px] tracking-[0.4em] rounded-2xl hover:text-white transition-all">İptal Et</button>
                        <button onClick={() => {
                             if (!editingRole?.name) return;
                             if (editingRole.id) {
                                 setRoles(roles.map(r => r.id === editingRole.id ? (editingRole as RoleDefinition) : r));
                             } else {
                                 setRoles([...roles, { ...editingRole, id: crypto.randomUUID() } as RoleDefinition]);
                             }
                             setIsRoleModalOpen(false);
                        }} className="flex-[2] py-6 bg-white text-black font-black uppercase text-[12px] tracking-[0.4em] rounded-2xl shadow-glow hover:bg-slate-200 transition-all transform active:scale-95">DEĞİŞİKLİKLERİ SİSTEME ENJEKTE ET</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
