
import React, { useState, useEffect, useRef } from 'react';
import { 
    Search, Database, History, Trash2, Activity, CornerDownRight, 
    ShieldCheck, User, MapPin, Smartphone, CreditCard, Hash, 
    AlertTriangle, Eye, Scale, Landmark, FileText, FileSignature, 
    Siren, Crosshair, ClipboardList, Network, Inbox, Pill, Stethoscope, 
    Users, Folder, Timer, Info, PlaneTakeoff, Scroll, CalendarRange, 
    Building, Map, BarChart3, GitMerge, Home, Gavel, FileWarning, 
    Download, Crown, Zap, Car, BookOpen, GraduationCap, Briefcase,
    Calendar, Filter, Copy, ChevronDown, Check, Terminal, Cpu, Lock
} from 'lucide-react';
import { ValidationStatus, VerificationResult, HistoryItem, QueryFormField, UserRole } from '../types';
import { 
    capitalize, formatTCKN, validateTCKN, 
    validatePlateNo, formatPlateNo, validateGsmNo, formatGsmNo, 
    validateIban, formatIban 
} from '../utils/tcknValidator';
import { verifyIdentity } from '../services/kpsService';
import { ResultCard } from './ResultCard';

interface QueryFormProps {
  title: string;
  queryType: string;
  userRole: UserRole;
}

// NexuX Robust Field Definitions
const FULLNAME_FIELD: QueryFormField = { name: 'fullName', label: 'Ad Soyad', type: 'text', placeholder: 'AD SOYAD', icon: User, required: true, format: capitalize };
const TCKN_FIELD: QueryFormField = { name: 'tc', label: 'T.C. Kimlik No', type: 'text', placeholder: '11 Haneli Rakam', maxLength: 11, icon: ShieldCheck, required: true, isSensitive: true };
const SERIAL_FIELD: QueryFormField = { name: 'serialNo', label: 'Kimlik Seri No', type: 'text', placeholder: 'A01X00000', maxLength: 9, icon: Hash, required: true };
const GSM_FIELD: QueryFormField = { name: 'gsm', label: 'GSM No', type: 'text', placeholder: '+90 5XX XXX XX XX', icon: Smartphone, required: true, format: formatGsmNo };
const IBAN_FIELD: QueryFormField = { name: 'iban', label: 'IBAN Numarası', type: 'text', placeholder: 'TRXX XXXX...', maxLength: 26, icon: CreditCard, required: true, format: formatIban };
const PLATE_FIELD: QueryFormField = { name: 'plate', label: 'Plaka No', type: 'text', placeholder: '34 NEX 01', icon: Car, required: true, format: formatPlateNo };
const ADDR_FIELD: QueryFormField = { name: 'addressText', label: 'Adres Metni', type: 'text', placeholder: 'MAHALLE, CADDE, NO...', icon: Home };
const CITY_FIELD: QueryFormField = { name: 'cityDistrict', label: 'İl / İlçe', type: 'text', placeholder: 'İSTANBUL / KADIKÖY', icon: MapPin };
const DATE_START: QueryFormField = { name: 'dateFrom', label: 'Başlangıç Tarihi', type: 'date', icon: Calendar };
const DATE_END: QueryFormField = { name: 'dateTo', label: 'Bitiş Tarihi', type: 'date', icon: Calendar };
const REASON_FIELD: QueryFormField = { name: 'reason', label: 'Gerekçe', type: 'text', placeholder: 'Sorgulama Nedenini Belirtin', icon: Info, required: true };
const INSTITUTION_FIELD: QueryFormField = { name: 'institution', label: 'Kurum', type: 'text', placeholder: 'KURUM ADI', icon: Building };
const DOC_REF_FIELD: QueryFormField = { name: 'docRef', label: 'Dosya Referans', type: 'text', placeholder: '2024/123-E', icon: FileText };

// Dynamic Field Mapping
const FIELD_MAPPING: { [key: string]: QueryFormField[] } = {
    // PERSONAL
    'ad_soyad': [FULLNAME_FIELD],
    'ad_soyad_detay': [FULLNAME_FIELD, CITY_FIELD],
    'ad_soyad_gecmis': [FULLNAME_FIELD],
    'ad_soyad_varyasyon': [FULLNAME_FIELD],
    'kimlik_kayit': [TCKN_FIELD],
    'kimlik_dogum_bilgisi': [TCKN_FIELD],
    'kimlik_dogum_yeri': [TCKN_FIELD],
    'kimlik_seri_no': [SERIAL_FIELD, TCKN_FIELD],
    'kimlik_arsiv': [TCKN_FIELD],
    'kimlik_tutarlilik': [TCKN_FIELD],
    'kimlik_kaynak_uyum': [TCKN_FIELD],
    'kimlik_zaman_cizelgesi': [TCKN_FIELD],
    'kimlik_risk_profil': [TCKN_FIELD],
    'kimlik_veri_butunluk': [TCKN_FIELD],
    'kimlik_capraz_kayit': [TCKN_FIELD],

    // FAMILY
    'aile_sorgu': [TCKN_FIELD],
    'aile_detay': [TCKN_FIELD],
    'aile_gecmis': [TCKN_FIELD],
    'soy_agaci': [TCKN_FIELD],
    'sulale_sorgu': [TCKN_FIELD],
    'akrabalik_sorgu': [TCKN_FIELD],
    'hane_yapi': [TCKN_FIELD],
    'hane_gecmis': [TCKN_FIELD],
    'aile_hareketlilik': [TCKN_FIELD],
    'yakinlik_yogunluk': [TCKN_FIELD],
    'aile_iliski_haritasi': [TCKN_FIELD],
    'aile_bag_stabilite': [TCKN_FIELD],

    // LOCATION
    'adres_kayit': [TCKN_FIELD],
    'adres_detay': [TCKN_FIELD],
    'adres_gecmis': [TCKN_FIELD],
    'adres_zaman_cizelgesi': [TCKN_FIELD],
    'ikamet_sorgu': [TCKN_FIELD],
    'yerlesim_sorgu': [TCKN_FIELD],
    'yerlesim_gecmis': [TCKN_FIELD],
    'bina_mahalle_sorgu': [CITY_FIELD, ADDR_FIELD],
    'konum_davranis': [CITY_FIELD, DATE_START, DATE_END],
    'adres_tutarlilik': [TCKN_FIELD],
    'adres_yogunluk_haritasi': [CITY_FIELD],
    'adres_risk_bolge': [CITY_FIELD],
    'adres_stabilite': [TCKN_FIELD],
    'adres_hareket_gecis': [TCKN_FIELD],

    // GSM
    'iletisim_sorgu': [TCKN_FIELD],
    'telefon_sorgu': [GSM_FIELD],
    'gsm_hat': [GSM_FIELD],
    'hat_gecmis': [GSM_FIELD],
    'cihaz_sorgu': [GSM_FIELD],
    'oturum_sorgu': [GSM_FIELD],
    'iletisim_frekans': [GSM_FIELD],
    'iletisim_zaman_deseni': [GSM_FIELD],
    'cihaz_degisim': [GSM_FIELD],
    'iletisim_tutarlilik': [GSM_FIELD],
    'iletisim_ag_haritasi': [GSM_FIELD],
    'iletisim_risk_profil': [GSM_FIELD],
    'iletisim_davranis_stabilite': [GSM_FIELD],

    // HEALTH
    'saglik_kayit': [TCKN_FIELD],
    'saglik_gecmis': [TCKN_FIELD],
    'hastane_kayit': [TCKN_FIELD],
    'hastane_ziyaret': [TCKN_FIELD],
    'tedavi_sorgu': [TCKN_FIELD],
    'tedavi_gecmis': [TCKN_FIELD],
    'ilac_kayit': [TCKN_FIELD],
    'recete_sorgu': [TCKN_FIELD],
    'asi_kayit': [TCKN_FIELD],
    'saglik_rapor_sorgu': [TCKN_FIELD],
    'saglik_sureklilik': [TCKN_FIELD],
    'saglik_risk_gostergesi': [TCKN_FIELD],
    'saglik_zaman_analizi': [TCKN_FIELD],
    'tedavi_tutarlilik': [TCKN_FIELD],

    // TRAVEL
    'konaklama_sorgu': [TCKN_FIELD],
    'konaklama_gecmis': [TCKN_FIELD],
    'konaklama_giris_cikis': [TCKN_FIELD, DATE_START, DATE_END],
    'seyahat_sorgu': [TCKN_FIELD],
    'seyahat_gecmis': [TCKN_FIELD],
    'seyahat_zaman_cizelgesi': [TCKN_FIELD],
    'ulasim_sorgu': [TCKN_FIELD],
    'ucus_sorgu': [TCKN_FIELD, DATE_START],
    'bilet_sorgu': [TCKN_FIELD],
    'hareketlilik_yogunluk': [TCKN_FIELD],
    'rota_davranis': [TCKN_FIELD],
    'seyahat_tutarlilik': [TCKN_FIELD],
    'konaklama_risk_bolge': [CITY_FIELD],

    // FINANCE
    'banka_sorgu': [TCKN_FIELD],
    'banka_hesap_sorgu': [TCKN_FIELD],
    'iban_sorgu': [IBAN_FIELD],
    'hesap_hareket': [IBAN_FIELD, DATE_START, DATE_END],
    'finansal_durum': [TCKN_FIELD],
    'finansal_akis': [TCKN_FIELD],
    'finansal_tutarlilik': [TCKN_FIELD],
    'mulkiyet_sorgu': [TCKN_FIELD],
    'tapu_sorgu': [TCKN_FIELD, ADDR_FIELD],
    'tapu_gecmis': [TCKN_FIELD],
    'arazi_sorgu': [TCKN_FIELD],
    'parsel_sorgu': [TCKN_FIELD, CITY_FIELD],
    'varlik_yogunluk': [TCKN_FIELD],
    'varlik_zaman_degeri': [TCKN_FIELD],
    'finansal_risk_profil': [TCKN_FIELD],

    // VEHICLE
    'arac_sorgu': [PLATE_FIELD],
    'arac_gecmis': [PLATE_FIELD],
    'plaka_sorgu': [PLATE_FIELD],
    'sigorta_sorgu': [PLATE_FIELD],
    'kasko_sorgu': [PLATE_FIELD],
    'muayene_sorgu': [PLATE_FIELD],
    'kaza_kaydi': [PLATE_FIELD],
    'arac_kullanim_deseni': [PLATE_FIELD],
    'arac_risk_profil': [PLATE_FIELD],
    'arac_sahiplik_gecmis': [PLATE_FIELD],
    'arac_aktivite_stabilite': [PLATE_FIELD],

    // BUSINESS
    'isyeri_sorgu': [TCKN_FIELD],
    'isyeri_gecmis': [TCKN_FIELD],
    'vergi_sorgu': [TCKN_FIELD],
    'gelir_sorgu': [TCKN_FIELD],
    'ortaklik_sorgu': [TCKN_FIELD],
    'ticari_ag_analizi': [TCKN_FIELD],
    'faaliyet_sureklilik': [TCKN_FIELD],
    'ekonomik_etki_profil': [TCKN_FIELD],
    'sirket_baglanti_haritasi': [TCKN_FIELD],
    'ticari_risk_analizi': [TCKN_FIELD],

    // EDUCATION
    'egitim_sorgu': [TCKN_FIELD, FULLNAME_FIELD],
    'egitim_gecmis': [TCKN_FIELD],
    'okul_sorgu': [TCKN_FIELD],
    'diploma_sorgu': [TCKN_FIELD],
    'akademik_sureklilik': [TCKN_FIELD],
    'mesleki_gecmis': [TCKN_FIELD],
    'yetkinlik_haritasi': [TCKN_FIELD],
    'meslek_stabilite': [TCKN_FIELD],
    'uzmanlik_alan_analizi': [TCKN_FIELD],

    // DEFAULT
    'DEFAULT': [TCKN_FIELD]
};

const LoadingTerminal = ({ onClose }: { onClose: () => void }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const messages = [
        "BAĞLANTI BAŞLATILIYOR [SECURE_SSL_V3]...",
        "KİMLİK DOĞRULAMA: BAŞARILI",
        "VERİ AĞACI TARANIYOR (DERİNLİK: SEVİYE 5)...",
        "PROTOKOL İMZASI ONAYLANDI...",
        "ŞİFRELİ VERİ PAKETİ ALINIYOR...",
        "SONUÇLAR DERLENİYOR..."
    ];

    useEffect(() => {
        let delay = 0;
        messages.forEach((msg, i) => {
            delay += Math.random() * 500 + 200;
            setTimeout(() => {
                setLogs(prev => [...prev, msg]);
            }, delay);
        });
    }, []);

    return (
        <div className="absolute inset-0 bg-bg-0/95 z-50 flex items-center justify-center p-8 backdrop-blur-md rounded-[2rem]">
            <div className="w-full max-w-lg font-mono text-xs text-status-ok bg-black/50 p-6 rounded-xl border border-line-1 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-status-ok animate-pulse" />
                <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="flex items-center gap-2"><Terminal className="w-4 h-4" /> SYSTEM_ROOT_PROCESS</span>
                    <Activity className="w-4 h-4 animate-spin" />
                </div>
                <div className="space-y-2 h-48 overflow-hidden flex flex-col justify-end">
                    {logs.map((log, i) => (
                        <div key={i} className="animate-in slide-in-from-left-4 fade-in duration-300">
                            <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                            <span className="text-shadow">{log}</span>
                        </div>
                    ))}
                    <div className="animate-pulse">_</div>
                </div>
            </div>
        </div>
    );
};

export const QueryForm: React.FC<QueryFormProps> = ({ title, queryType, userRole }) => {
  const [formData, setFormData] = useState<{[key: string]: string}>({});
  const [status, setStatus] = useState<ValidationStatus>(ValidationStatus.IDLE);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [resultSearch, setResultSearch] = useState('');

  const currentFields = FIELD_MAPPING[queryType] || FIELD_MAPPING['DEFAULT'];
  const isAdminQuery = queryType.includes('admin') || 
                       queryType.includes('gbt') || 
                       queryType.includes('sabika') || 
                       queryType.includes('yasal') ||
                       queryType.includes('sistem') ||
                       queryType.includes('log') ||
                       queryType.includes('denetim');
  
  const activeFields = isAdminQuery ? [...currentFields, REASON_FIELD] : currentFields;

  useEffect(() => {
    setFormData({});
    setErrors({});
    setStatus(ValidationStatus.IDLE);
    setResult(null);
  }, [queryType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let val = value;
    const config = activeFields.find(f => f.name === name);
    if (config?.format) val = config.format(value);
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    activeFields.forEach(f => {
        if (f.required && !formData[f.name]) {
            newErrors[f.name] = `${f.label} alanı zorunludur.`;
        }
        if (formData[f.name]) {
            if (f.name === 'tc' && !validateTCKN(formData[f.name])) newErrors[f.name] = 'Geçersiz T.C. Kimlik No';
            if (f.name === 'fullName') {
                if (formData[f.name].length < 2) newErrors[f.name] = 'En az 2 karakter gereklidir';
                if (/\d/.test(formData[f.name])) newErrors[f.name] = 'Rakam içeremez';
            }
            if (f.name === 'gsm' && !validateGsmNo(formData[f.name])) newErrors[f.name] = 'Hatalı GSM Formatı';
            if (f.name === 'iban' && !validateIban(formData[f.name])) newErrors[f.name] = 'Geçersiz IBAN';
        }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus(ValidationStatus.VALIDATING);
    
    // Simulate complex delay
    setTimeout(async () => {
        try {
            const res = await verifyIdentity(formData, queryType);
            setResult(res);
            setStatus(ValidationStatus.SUCCESS);
        } catch (err) {
            setStatus(ValidationStatus.ERROR);
        }
    }, 2500); // Allow time for the LoadingTerminal animation
  };

  const handleCopyAll = () => {
      if(!result?.data) return;
      const text = JSON.stringify(result.data, null, 2);
      navigator.clipboard.writeText(text);
      alert("Tüm veri panoya kopyalandı.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-bg-1 border border-line-0 rounded-[2rem] p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Activity className="w-32 h-32 text-accent-2" /></div>
        <div className="absolute inset-0 bg-scanline opacity-5 pointer-events-none" />
        
        {status === ValidationStatus.VALIDATING && <LoadingTerminal onClose={() => {}} />}

        <div className="mb-10 relative z-10">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                <Search className="w-5 h-5 text-accent-2" /> Sorgu Parametreleri
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-status-ok" /> Veri Güvenlik Seviyesi: PROTOKOL 4_B (ENCRYPTED)
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activeFields.map(field => {
                    const Icon = field.icon;
                    return (
                        <div key={field.name} className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block pl-1">{field.label}</label>
                            <div className="relative group">
                                <Icon className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors[field.name] ? 'text-accent-2' : 'text-slate-700 group-focus-within:text-accent-2'}`} />
                                <input 
                                    name={field.name}
                                    type={field.type}
                                    value={formData[field.name] || ''}
                                    onChange={handleInputChange}
                                    placeholder={field.placeholder}
                                    maxLength={field.maxLength}
                                    autoComplete="off"
                                    className={`w-full bg-bg-0 border rounded-xl p-5 pl-14 text-sm font-mono text-white outline-none transition-all placeholder-slate-800 shadow-inner
                                        ${errors[field.name] 
                                            ? 'border-accent-2/50 shadow-[0_0_20px_rgba(217,4,41,0.15)] animate-pulse' 
                                            : 'border-line-1 focus:border-accent-2/40 focus:shadow-glow'}`}
                                />
                                {errors[field.name] && <AlertTriangle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-2" />}
                            </div>
                            {errors[field.name] && <p className="text-[9px] text-accent-2 font-bold uppercase tracking-widest pl-1">{errors[field.name]}</p>}
                        </div>
                    );
                })}
            </div>

            {/* Advanced Filters Accordion */}
            <div className="border border-line-1 rounded-2xl overflow-hidden bg-bg-2/30">
                <button 
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between p-4 bg-transparent text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors"
                >
                    <div className="flex items-center gap-3"><Filter className="w-4 h-4" /> Gelişmiş Sorgu Filtreleri & Tarih Aralığı</div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>
                {showAdvanced && (
                    <div className="p-6 border-t border-line-1 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <span className="text-[9px] text-slate-600 uppercase font-black">Tarih Aralığı (Sınır: Tier Belirler)</span>
                            <div className="flex gap-4">
                                <input type="date" className="flex-1 bg-bg-0 border border-line-1 rounded-lg p-3 text-xs text-white outline-none focus:border-accent-2/30" />
                                <input type="date" className="flex-1 bg-bg-0 border border-line-1 rounded-lg p-3 text-xs text-white outline-none focus:border-accent-2/30" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[9px] text-slate-600 uppercase font-black">Derinlik Seviyesi</span>
                            <div className="flex gap-2">
                                {['Özet', 'Detay', 'Karşılaştırmalı'].map(l => (
                                    <button key={l} type="button" className="flex-1 py-3 bg-bg-0 border border-line-1 rounded-lg text-[9px] font-black uppercase text-slate-500 hover:text-accent-ice hover:border-accent-ice/30 transition-all">{l}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setFormData({})} className="flex-1 py-5 bg-bg-2 border border-line-1 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-bg-3 transition-all flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" /> Formu Temizle
                </button>
                <button type="submit" disabled={status === ValidationStatus.VALIDATING} className="flex-[2] py-5 bg-accent-2 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.4em] shadow-glow hover:bg-accent-1 transition-all flex items-center justify-center gap-4 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                    {status === ValidationStatus.VALIDATING ? <Activity className="w-5 h-5 animate-spin" /> : <Database className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    {status === ValidationStatus.VALIDATING ? 'İŞLENİYOR...' : 'SORGULAMAYI BAŞLAT'}
                </button>
            </div>
        </form>
      </div>

      {status === ValidationStatus.SUCCESS && result && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
              {/* Results Toolbar */}
              <div className="bg-bg-1 border border-line-1 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                      <span className="bg-status-ok/10 text-status-ok px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-status-ok/20 flex items-center gap-2">
                          <Check className="w-3 h-3" /> Sonuçlar Hazır
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono italic">
                          İşlem Süresi: <span className="text-white">{result.durationMs}ms</span>
                      </span>
                  </div>
                  
                  <div className="flex-1 max-w-md relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-accent-ice transition-colors" />
                      <input 
                        value={resultSearch}
                        onChange={(e) => setResultSearch(e.target.value)}
                        placeholder="Sonuçlarda Ara..." 
                        className="w-full bg-bg-2 border border-line-1 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-accent-ice/30 focus:shadow-ice-glow transition-all placeholder-slate-700"
                      />
                  </div>

                  <button onClick={handleCopyAll} className="px-6 py-3 bg-bg-3 border border-line-1 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-2 hover:text-white hover:border-white/20 transition-all flex items-center gap-3 group">
                      <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> TÜMÜNÜ KOPYALA
                  </button>
              </div>

              <ResultCard result={result} onReset={() => setStatus(ValidationStatus.IDLE)} userRole={userRole} />
          </div>
      )}
    </div>
  );
};
