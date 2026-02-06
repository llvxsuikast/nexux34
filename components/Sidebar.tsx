
import React, { useState } from 'react';
import { 
  User, Users, MapPin, Smartphone, CreditCard, FileText, 
  Search, Shield, Database, Activity, Lock, Unlock, 
  Briefcase, HeartPulse, Car, Home, Gavel, FileJson,
  Zap, Crown, BarChart3, Radio, Server, FileWarning,
  LayoutDashboard, ChevronDown, ChevronRight, LogOut,
  UserCheck, Hash, PlaneTakeoff, BookOpen, AlertTriangle,
  Scroll, CalendarRange, Map, Info, Scale, 
  Landmark, Siren, Crosshair, ClipboardList, Timer, 
  Network, Inbox, Building, GitMerge, FileSearch, BadgeCheck,
  Radar, Fingerprint, GraduationCap, Plane, Boxes, Ghost,
  ShieldAlert, ShieldCheck, FileSignature, Key, Globe, TrendingUp,
  Pill, Clock, History as HistoryIcon, Eye, ShieldX, Link, HelpCircle,
  Rocket
} from 'lucide-react';
import { MenuItem, QueryType, UserRole } from '../types';

const History = (props: any) => <Clock {...props} />;
const Anchor = (props: any) => <div {...props}><ShieldX size={16} /></div>;
const Check = (props: any) => <div {...props}><BadgeCheck size={16} /></div>;

interface SidebarProps {
  activeQuery: QueryType;
  onSelect: (query: QueryType) => void;
  isOpen: boolean;
  userRole: UserRole;
}

export const MENU_ITEMS: MenuItem[] = [
    // [KİŞİSEL KİMLİK SORGULARI]
    { id: 'ad_soyad', label: 'Ad Soyad Sorgu', icon: UserCheck, requiredRole: 'FREE', category: 'PERSONAL' },
    { id: 'ad_soyad_detay', label: 'Ad Soyad Detay Sorgu', icon: User, requiredRole: 'PREMIUM', category: 'PERSONAL' },
    { id: 'ad_soyad_gecmis', label: 'Ad Soyad Geçmiş Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'PERSONAL' },
    { id: 'ad_soyad_varyasyon', label: 'Ad Soyad Varyasyon Sorgu', icon: FileSearch, requiredRole: 'PREMIUM', category: 'PERSONAL' },
    { id: 'kimlik_kayit', label: 'Kimlik Kayıt Sorgu', icon: FileSignature, requiredRole: 'PREMIUM', category: 'PERSONAL' },
    { id: 'kimlik_dogum_bilgisi', label: 'Kimlik Doğum Bilgisi Sorgu', icon: CalendarRange, requiredRole: 'PREMIUM', category: 'PERSONAL' },
    { id: 'kimlik_dogum_yeri', label: 'Kimlik Doğum Yeri Sorgu', icon: MapPin, requiredRole: 'PREMIUM', category: 'PERSONAL' },
    { id: 'kimlik_seri_no', label: 'Kimlik Seri No Sorgu', icon: Hash, requiredRole: 'PREMIUM', category: 'PERSONAL' },
    { id: 'kimlik_arsiv', label: 'Kimlik Arşiv Sorgu', icon: Database, requiredRole: 'ULTRA', category: 'PERSONAL' },
    { id: 'kimlik_tutarlilik', label: 'Kimlik Tutarlılık Sorgu', icon: ShieldCheck, requiredRole: 'ULTRA', category: 'PERSONAL' },
    { id: 'kimlik_kaynak_uyum', label: 'Kimlik Kaynak Uyum Sorgu', icon: Link, requiredRole: 'ULTRA', category: 'PERSONAL' },
    { id: 'kimlik_zaman_cizelgesi', label: 'Kimlik Zaman Çizelgesi Sorgu', icon: Activity, requiredRole: 'VIP', category: 'PERSONAL' },
    { id: 'kimlik_risk_profil', label: 'Kimlik Risk Profil Sorgu', icon: ShieldAlert, requiredRole: 'ULTRA', category: 'PERSONAL' },
    { id: 'kimlik_veri_butunluk', label: 'Kimlik Veri Bütünlük Sorgu', icon: Shield, requiredRole: 'ULTRA', category: 'PERSONAL' },
    { id: 'kimlik_capraz_kayit', label: 'Kimlik Çapraz Kayıt Sorgu', icon: GitMerge, requiredRole: 'VIP', category: 'PERSONAL' },

    // [AİLE & YAKINLIK SORGULARI]
    { id: 'aile_sorgu', label: 'Aile Sorgu', icon: Users, requiredRole: 'FREE', category: 'FAMILY' },
    { id: 'aile_detay', label: 'Aile Detay Sorgu', icon: Users, requiredRole: 'PREMIUM', category: 'FAMILY' },
    { id: 'aile_gecmis', label: 'Aile Geçmiş Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'FAMILY' },
    { id: 'soy_agaci', label: 'Soy Ağacı Sorgu', icon: Network, requiredRole: 'PREMIUM', category: 'FAMILY' },
    { id: 'sulale_sorgu', label: 'Sülale Sorgu', icon: GitMerge, requiredRole: 'PREMIUM', category: 'FAMILY' },
    { id: 'akrabalik_sorgu', label: 'Akrabalık Sorgu', icon: Link, requiredRole: 'PREMIUM', category: 'FAMILY' },
    { id: 'hane_yapi', label: 'Hane Yapı Sorgu', icon: Home, requiredRole: 'PREMIUM', category: 'FAMILY' },
    { id: 'hane_gecmis', label: 'Hane Geçmiş Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'FAMILY' },
    { id: 'aile_hareketlilik', label: 'Aile Hareketlilik Sorgu', icon: Activity, requiredRole: 'VIP', category: 'FAMILY' },
    { id: 'yakinlik_yogunluk', label: 'Yakınlık Yoğunluk Sorgu', icon: Users, requiredRole: 'VIP', category: 'FAMILY' },
    { id: 'aile_iliski_haritasi', label: 'Aile İlişki Haritası Sorgu', icon: Map, requiredRole: 'VIP', category: 'FAMILY' },
    { id: 'aile_bag_stabilite', label: 'Aile Bağ Stabilite Sorgu', icon: ShieldCheck, requiredRole: 'ULTRA', category: 'FAMILY' },

    // [ADRES & KONUM SORGULARI]
    { id: 'adres_kayit', label: 'Adres Kayıt Sorgu', icon: MapPin, requiredRole: 'FREE', category: 'LOCATION' },
    { id: 'adres_detay', label: 'Adres Detay Sorgu', icon: MapPin, requiredRole: 'PREMIUM', category: 'LOCATION' },
    { id: 'adres_gecmis', label: 'Adres Geçmiş Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'LOCATION' },
    { id: 'adres_zaman_cizelgesi', label: 'Adres Zaman Çizelgesi Sorgu', icon: Activity, requiredRole: 'VIP', category: 'LOCATION' },
    { id: 'ikamet_sorgu', label: 'İkamet Sorgu', icon: Building, requiredRole: 'PREMIUM', category: 'LOCATION' },
    { id: 'yerlesim_sorgu', label: 'Yerleşim Sorgu', icon: Home, requiredRole: 'PREMIUM', category: 'LOCATION' },
    { id: 'yerlesim_gecmis', label: 'Yerleşim Geçmiş Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'LOCATION' },
    { id: 'bina_mahalle_sorgu', label: 'Bina Mahalle Sorgu', icon: Building, requiredRole: 'PREMIUM', category: 'LOCATION' },
    { id: 'konum_davranis', label: 'Konum Davranış Sorgu', icon: Crosshair, requiredRole: 'VIP', category: 'LOCATION' },
    { id: 'adres_tutarlilik', label: 'Adres Tutarlılık Sorgu', icon: ShieldCheck, requiredRole: 'ULTRA', category: 'LOCATION' },
    { id: 'adres_yogunluk_haritasi', label: 'Adres Yoğunluk Haritası Sorgu', icon: Map, requiredRole: 'VIP', category: 'LOCATION' },
    { id: 'adres_risk_bolge', label: 'Adres Risk Bölge Sorgu', icon: AlertTriangle, requiredRole: 'ULTRA', category: 'LOCATION' },
    { id: 'adres_stabilite', label: 'Adres Stabilite Sorgu', icon: Activity, requiredRole: 'ULTRA', category: 'LOCATION' },
    { id: 'adres_hareket_gecis', label: 'Adres Hareket Geçiş Sorgu', icon: GitMerge, requiredRole: 'VIP', category: 'LOCATION' },

    // [İLETİŞİM & GSM SORGULARI]
    { id: 'iletisim_sorgu', label: 'İletişim Sorgu', icon: Smartphone, requiredRole: 'FREE', category: 'GSM' },
    { id: 'telefon_sorgu', label: 'Telefon Sorgu', icon: Smartphone, requiredRole: 'PREMIUM', category: 'GSM' },
    { id: 'gsm_hat', label: 'GSM Hat Sorgu', icon: Radio, requiredRole: 'PREMIUM', category: 'GSM' },
    { id: 'hat_gecmis', label: 'Hat Geçmiş Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'GSM' },
    { id: 'cihaz_sorgu', label: 'Cihaz Sorgu', icon: Smartphone, requiredRole: 'PREMIUM', category: 'GSM' },
    { id: 'oturum_sorgu', label: 'Oturum Sorgu', icon: Radio, requiredRole: 'PREMIUM', category: 'GSM' },
    { id: 'iletisim_frekans', label: 'İletişim Frekans Sorgu', icon: Activity, requiredRole: 'VIP', category: 'GSM' },
    { id: 'iletisim_zaman_deseni', label: 'İletişim Zaman Deseni Sorgu', icon: Clock, requiredRole: 'VIP', category: 'GSM' },
    { id: 'cihaz_degisim', label: 'Cihaz Değişim Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'GSM' },
    { id: 'iletisim_tutarlilik', label: 'İletişim Tutarlılık Sorgu', icon: ShieldCheck, requiredRole: 'ULTRA', category: 'GSM' },
    { id: 'iletisim_ag_haritasi', label: 'İletişim Ağ Haritası Sorgu', icon: Network, requiredRole: 'VIP', category: 'GSM' },
    { id: 'iletisim_risk_profil', label: 'İletişim Risk Profil Sorgu', icon: ShieldAlert, requiredRole: 'ULTRA', category: 'GSM' },
    { id: 'iletisim_davranis_stabilite', label: 'İletişim Davranış Stabilite Sorgu', icon: Activity, requiredRole: 'ULTRA', category: 'GSM' },

    // [SAĞLIK & YAŞAM SORGULARI]
    { id: 'saglik_kayit', label: 'Sağlık Kayıt Sorgu', icon: HeartPulse, requiredRole: 'PREMIUM', category: 'HEALTH' },
    { id: 'saglik_gecmis', label: 'Sağlık Geçmiş Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'HEALTH' },
    { id: 'hastane_kayit', label: 'Hastane Kayıt Sorgu', icon: Building, requiredRole: 'PREMIUM', category: 'HEALTH' },
    { id: 'hastane_ziyaret', label: 'Hastane Ziyaret Sorgu', icon: Building, requiredRole: 'PREMIUM', category: 'HEALTH' },
    { id: 'tedavi_sorgu', label: 'Tedavi Sorgu', icon: Pill, requiredRole: 'PREMIUM', category: 'HEALTH' },
    { id: 'tedavi_gecmis', label: 'Tedavi Geçmiş Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'HEALTH' },
    { id: 'ilac_kayit', label: 'İlaç Kayıt Sorgu', icon: Boxes, requiredRole: 'ULTRA', category: 'HEALTH' },
    { id: 'recete_sorgu', label: 'Reçete Sorgu', icon: Scroll, requiredRole: 'ULTRA', category: 'HEALTH' },
    { id: 'asi_kayit', label: 'Aşı Kayıt Sorgu', icon: Pill, requiredRole: 'PREMIUM', category: 'HEALTH' },
    { id: 'saglik_rapor_sorgu', label: 'Sağlık Rapor Sorgu', icon: FileText, requiredRole: 'ULTRA', category: 'HEALTH' },
    { id: 'saglik_sureklilik', label: 'Sağlık Süreklilik Sorgu', icon: Activity, requiredRole: 'ULTRA', category: 'HEALTH' },
    { id: 'saglik_risk_gostergesi', label: 'Sağlık Risk Göstergesi Sorgu', icon: ShieldAlert, requiredRole: 'ULTRA', category: 'HEALTH' },
    { id: 'saglik_zaman_analizi', label: 'Sağlık Zaman Analizi Sorgu', icon: Clock, requiredRole: 'VIP', category: 'HEALTH' },
    { id: 'tedavi_tutarlilik', label: 'Tedavi Tutarlılık Sorgu', icon: ShieldCheck, requiredRole: 'ULTRA', category: 'HEALTH' },

    // [SEYAHAT & KONAKLAMA SORGULARI]
    { id: 'konaklama_sorgu', label: 'Konaklama Sorgu', icon: Home, requiredRole: 'PREMIUM', category: 'TRAVEL' },
    { id: 'konaklama_gecmis', label: 'Konaklama Geçmiş Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'TRAVEL' },
    { id: 'konaklama_giris_cikis', label: 'Konaklama Giriş Çıkış Sorgu', icon: LogOut, requiredRole: 'ULTRA', category: 'TRAVEL' },
    { id: 'seyahat_sorgu', label: 'Seyahat Sorgu', icon: Plane, requiredRole: 'PREMIUM', category: 'TRAVEL' },
    { id: 'seyahat_gecmis', label: 'Seyahat Geçmiş Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'TRAVEL' },
    { id: 'seyahat_zaman_cizelgesi', label: 'Seyahat Zaman Çizelgesi Sorgu', icon: CalendarRange, requiredRole: 'VIP', category: 'TRAVEL' },
    { id: 'ulasim_sorgu', label: 'Ulaşım Sorgu', icon: Car, requiredRole: 'PREMIUM', category: 'TRAVEL' },
    { id: 'ucus_sorgu', label: 'Uçuş Sorgu', icon: PlaneTakeoff, requiredRole: 'PREMIUM', category: 'TRAVEL' },
    { id: 'bilet_sorgu', label: 'Bilet Sorgu', icon: FileText, requiredRole: 'PREMIUM', category: 'TRAVEL' },
    { id: 'hareketlilik_yogunluk', label: 'Hareketlilik Yoğunluk Sorgu', icon: Activity, requiredRole: 'VIP', category: 'TRAVEL' },
    { id: 'rota_davranis', label: 'Rota Davranış Sorgu', icon: Map, requiredRole: 'VIP', category: 'TRAVEL' },
    { id: 'seyahat_tutarlilik', label: 'Seyahat Tutarlılık Sorgu', icon: ShieldCheck, requiredRole: 'ULTRA', category: 'TRAVEL' },
    { id: 'konaklama_risk_bolge', label: 'Konaklama Risk Bölge Sorgu', icon: AlertTriangle, requiredRole: 'ULTRA', category: 'TRAVEL' },

    // [FİNANS & VARLIK SORGULARI]
    { id: 'banka_sorgu', label: 'Banka Sorgu', icon: Landmark, requiredRole: 'PREMIUM', category: 'FINANCE' },
    { id: 'banka_hesap_sorgu', label: 'Banka Hesap Sorgu', icon: CreditCard, requiredRole: 'PREMIUM', category: 'FINANCE' },
    { id: 'iban_sorgu', label: 'IBAN Sorgu', icon: CreditCard, requiredRole: 'PREMIUM', category: 'FINANCE' },
    { id: 'hesap_hareket', label: 'Hesap Hareket Sorgu', icon: Activity, requiredRole: 'ULTRA', category: 'FINANCE' },
    { id: 'finansal_durum', label: 'Finansal Durum Sorgu', icon: BarChart3, requiredRole: 'PREMIUM', category: 'FINANCE' },
    { id: 'finansal_akis', label: 'Finansal Akış Sorgu', icon: TrendingUp, requiredRole: 'VIP', category: 'FINANCE' },
    { id: 'finansal_tutarlilik', label: 'Finansal Tutarlılık Sorgu', icon: ShieldCheck, requiredRole: 'ULTRA', category: 'FINANCE' },
    { id: 'mulkiyet_sorgu', label: 'Mülkiyet Sorgu', icon: Home, requiredRole: 'PREMIUM', category: 'FINANCE' },
    { id: 'tapu_sorgu', label: 'Tapu Sorgu', icon: FileText, requiredRole: 'ULTRA', category: 'FINANCE' },
    { id: 'tapu_gecmis', label: 'Tapu Geçmiş Sorgu', icon: History, requiredRole: 'ULTRA', category: 'FINANCE' },
    { id: 'arazi_sorgu', label: 'Arazi Sorgu', icon: Map, requiredRole: 'PREMIUM', category: 'FINANCE' },
    { id: 'parsel_sorgu', label: 'Parsel Sorgu', icon: MapPin, requiredRole: 'PREMIUM', category: 'FINANCE' },
    { id: 'varlik_yogunluk', label: 'Varlık Yoğunluk Sorgu', icon: BarChart3, requiredRole: 'VIP', category: 'FINANCE' },
    { id: 'varlik_zaman_degeri', label: 'Varlık Zaman Değeri Sorgu', icon: Clock, requiredRole: 'VIP', category: 'FINANCE' },
    { id: 'finansal_risk_profil', label: 'Finansal Risk Profil Sorgu', icon: ShieldAlert, requiredRole: 'ULTRA', category: 'FINANCE' },

    // [ARAÇ & ULAŞIM VARLIKLARI]
    { id: 'arac_sorgu', label: 'Araç Sorgu', icon: Car, requiredRole: 'PREMIUM', category: 'VEHICLE' },
    { id: 'arac_gecmis', label: 'Araç Geçmiş Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'VEHICLE' },
    { id: 'plaka_sorgu', label: 'Plaka Sorgu', icon: Hash, requiredRole: 'PREMIUM', category: 'VEHICLE' },
    { id: 'sigorta_sorgu', label: 'Sigorta Sorgu', icon: FileText, requiredRole: 'PREMIUM', category: 'VEHICLE' },
    { id: 'kasko_sorgu', label: 'Kasko Sorgu', icon: FileText, requiredRole: 'PREMIUM', category: 'VEHICLE' },
    { id: 'muayene_sorgu', label: 'Muayene Sorgu', icon: ClipboardList, requiredRole: 'PREMIUM', category: 'VEHICLE' },
    { id: 'kaza_kaydi', label: 'Kaza Kaydı Sorgu', icon: AlertTriangle, requiredRole: 'ULTRA', category: 'VEHICLE' },
    { id: 'arac_kullanim_deseni', label: 'Araç Kullanım Deseni Sorgu', icon: Activity, requiredRole: 'VIP', category: 'VEHICLE' },
    { id: 'arac_risk_profil', label: 'Araç Risk Profil Sorgu', icon: ShieldAlert, requiredRole: 'ULTRA', category: 'VEHICLE' },
    { id: 'arac_sahiplik_gecmis', label: 'Araç Sahiplik Geçmiş Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'VEHICLE' },
    { id: 'arac_aktivite_stabilite', label: 'Araç Aktivite Stabilite Sorgu', icon: Activity, requiredRole: 'VIP', category: 'VEHICLE' },

    // [İŞ & EKONOMİK FAALİYET]
    { id: 'isyeri_sorgu', label: 'İşyeri Sorgu', icon: Briefcase, requiredRole: 'PREMIUM', category: 'BUSINESS' },
    { id: 'isyeri_gecmis', label: 'İşyeri Geçmiş Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'BUSINESS' },
    { id: 'vergi_sorgu', label: 'Vergi Sorgu', icon: FileText, requiredRole: 'ULTRA', category: 'BUSINESS' },
    { id: 'gelir_sorgu', label: 'Gelir Sorgu', icon: TrendingUp, requiredRole: 'PREMIUM', category: 'BUSINESS' },
    { id: 'ortaklik_sorgu', label: 'Ortaklık Sorgu', icon: Users, requiredRole: 'PREMIUM', category: 'BUSINESS' },
    { id: 'ticari_ag_analizi', label: 'Ticari Ağ Analizi Sorgu', icon: Network, requiredRole: 'VIP', category: 'BUSINESS' },
    { id: 'faaliyet_sureklilik', label: 'Faaliyet Süreklilik Sorgu', icon: Activity, requiredRole: 'ULTRA', category: 'BUSINESS' },
    { id: 'ekonomik_etki_profil', label: 'Ekonomik Etki Profil Sorgu', icon: BarChart3, requiredRole: 'VIP', category: 'BUSINESS' },
    { id: 'sirket_baglanti_haritasi', label: 'Şirket Bağlantı Haritası Sorgu', icon: Map, requiredRole: 'VIP', category: 'BUSINESS' },
    { id: 'ticari_risk_analizi', label: 'Ticari Risk Analizi', icon: ShieldAlert, requiredRole: 'ULTRA', category: 'BUSINESS' },

    // [EĞİTİM & MESLEK]
    { id: 'egitim_sorgu', label: 'Eğitim Sorgu', icon: GraduationCap, requiredRole: 'PREMIUM', category: 'EDUCATION' },
    { id: 'egitim_gecmis', label: 'Eğitim Geçmiş Sorgu', icon: History, requiredRole: 'PREMIUM', category: 'EDUCATION' },
    { id: 'okul_sorgu', label: 'Okul Sorgu', icon: Building, requiredRole: 'PREMIUM', category: 'EDUCATION' },
    { id: 'diploma_sorgu', label: 'Diploma Sorgu', icon: FileSignature, requiredRole: 'ULTRA', category: 'EDUCATION' },
    { id: 'akademik_sureklilik', label: 'Akademik Süreklilik Sorgu', icon: Activity, requiredRole: 'VIP', category: 'EDUCATION' },
    { id: 'mesleki_gecmis', label: 'Mesleki Geçmiş Sorgu', icon: Briefcase, requiredRole: 'PREMIUM', category: 'EDUCATION' },
    { id: 'yetkinlik_haritasi', label: 'Yetkinlik Haritası Sorgu', icon: Network, requiredRole: 'VIP', category: 'EDUCATION' },
    { id: 'meslek_stabilite', label: 'Meslek Stabilite Sorgu', icon: ShieldCheck, requiredRole: 'VIP', category: 'EDUCATION' },
    { id: 'uzmanlik_alan_analizi', label: 'Uzmanlık Alan Analizi Sorgu', icon: BarChart3, requiredRole: 'VIP', category: 'EDUCATION' },

    // [YASAL & DENETİM SORGULARI (YETKİLİ)]
    { id: 'sabika_sorgu', label: 'Sabıka Sorgu', icon: Fingerprint, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'sabika_detay', label: 'Sabıka Detay Sorgu', icon: FileText, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'adli_dosya', label: 'Adli Dosya Sorgu', icon: FileText, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'adli_arsiv', label: 'Adli Arşiv Sorgu', icon: Database, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'sorusturma_sorgu', label: 'Soruşturma Sorgu', icon: Search, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'sorusturma_gecmis', label: 'Soruşturma Geçmiş Sorgu', icon: History, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'dava_sorgu', label: 'Dava Sorgu', icon: Gavel, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'dava_dosyasi', label: 'Dava Dosyası Sorgu', icon: FileText, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'mahkeme_sorgu', label: 'Mahkeme Sorgu', icon: Landmark, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'mahkeme_karar', label: 'Mahkeme Karar Sorgu', icon: Gavel, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'ifade_sorgu', label: 'İfade Sorgu', icon: FileText, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'suc_kaydi', label: 'Suç Kaydı Sorgu', icon: Fingerprint, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'gbt_sorgu', label: 'GBT Sorgu', icon: FileWarning, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'yakalama_karari', label: 'Yakalama Kararı Sorgu', icon: Siren, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'arama_kaydi', label: 'Arama Kaydı Sorgu', icon: Search, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'yasal_surec_zaman_cizelgesi', label: 'Yasal Süreç Zaman Çizelgesi', icon: Activity, requiredRole: 'ADMIN', category: 'LEGAL' },
    { id: 'denetim_risk_gostergesi', label: 'Denetim Risk Göstergesi', icon: Shield, requiredRole: 'ADMIN', category: 'LEGAL' },

    // [SİSTEM & YÖNETİM SORGULARI]
    { id: 'sistem_erisim_log', label: 'Sistem Erişim Log Sorgu', icon: Server, requiredRole: 'ADMIN', category: 'SYSTEM' },
    { id: 'kullanici_oturum_log', label: 'Kullanıcı Oturum Log Sorgu', icon: Users, requiredRole: 'ADMIN', category: 'SYSTEM' },
    { id: 'yetki_degisiklik_log', label: 'Yetki Değişiklik Log Sorgu', icon: ShieldCheck, requiredRole: 'ADMIN', category: 'SYSTEM' },
    { id: 'rol_atama_gecmis', label: 'Rol Atama Geçmiş Sorgu', icon: History, requiredRole: 'ADMIN', category: 'SYSTEM' },
    { id: 'denetim_kaydi', label: 'Denetim Kaydı Sorgu', icon: FileSearch, requiredRole: 'ADMIN', category: 'SYSTEM' },
    { id: 'islem_onay_gecmis', label: 'İşlem Onay Geçmiş Sorgu', icon: Check, requiredRole: 'ADMIN', category: 'SYSTEM' },
    { id: 'abonelik_anahtar_sorgu', label: 'Abonelik Anahtar Sorgu', icon: Key, requiredRole: 'ADMIN', category: 'SYSTEM' },
    { id: 'abonelik_kullanim_sorgu', label: 'Abonelik Kullanım Sorgu', icon: Activity, requiredRole: 'ADMIN', category: 'SYSTEM' },
    { id: 'odeme_gecmis', label: 'Ödeme Geçmiş Sorgu', icon: CreditCard, requiredRole: 'ADMIN', category: 'SYSTEM' },
    { id: 'paket_yetki_eslestirme', label: 'Paket Yetki Eşleştirme Sorgu', icon: Link, requiredRole: 'ADMIN', category: 'SYSTEM' },
    { id: 'limit_asim_analizi', label: 'Limit Aşım Analizi Sorgu', icon: BarChart3, requiredRole: 'ADMIN', category: 'SYSTEM' },

    // [ÖZEL ANALİTİK & NADİR PROFİL]
    { id: 'davranissal_tutarlilik', label: 'Davranışsal Tutarlılık Sorgu', icon: Activity, requiredRole: 'VIP', category: 'ANALYTICS' },
    { id: 'coklu_kimlik_cakisma', label: 'Çoklu Kimlik Çakışma Sorgu', icon: Users, requiredRole: 'ULTRA', category: 'ANALYTICS' },
    { id: 'zaman_deseni_anomali', label: 'Zaman Deseni Anomali Sorgu', icon: Clock, requiredRole: 'ULTRA', category: 'ANALYTICS' },
    { id: 'ag_yogunluk_kesif', label: 'Ağ Yoğunluk Keşif Sorgu', icon: Network, requiredRole: 'VIP', category: 'ANALYTICS' },
    { id: 'uzun_donem_profil_evrimi', label: 'Uzun Dönem Profil Evrimi Sorgu', icon: TrendingUp, requiredRole: 'VIP', category: 'ANALYTICS' },
    { id: 'capraz_alan_korelasyon', label: 'Çapraz Alan Korelasyon Sorgu', icon: GitMerge, requiredRole: 'ULTRA', category: 'ANALYTICS' },
    { id: 'sessiz_degisim_gostergesi', label: 'Sessiz Değişim Göstergesi Sorgu', icon: Ghost, requiredRole: 'ULTRA', category: 'ANALYTICS' },
    { id: 'profil_guven_endeksi', label: 'Profil Güven Endeksi Sorgu', icon: ShieldCheck, requiredRole: 'VIP', category: 'ANALYTICS' },
    { id: 'veri_sapma_analizi', label: 'Veri Sapma Analizi Sorgu', icon: Activity, requiredRole: 'ULTRA', category: 'ANALYTICS' },
    { id: 'profil_stabilite', label: 'Profil Stabilite Sorgu', icon: Anchor, requiredRole: 'VIP', category: 'ANALYTICS' },
    { id: 'risk_davranis_ongoru', label: 'Risk Davranış Öngörü Sorgu', icon: Radar, requiredRole: 'ULTRA', category: 'ANALYTICS' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeQuery, onSelect, isOpen, userRole }) => {
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['PERSONAL', 'FAMILY']);

    const toggleCategory = (cat: string) => {
        setExpandedCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const categories = [
        { id: 'PERSONAL', label: 'Kişisel Kimlik' },
        { id: 'FAMILY', label: 'Aile & Yakınlık' },
        { id: 'LOCATION', label: 'Adres & Konum' },
        { id: 'GSM', label: 'İletişim & GSM' },
        { id: 'HEALTH', label: 'Sağlık & Yaşam' },
        { id: 'TRAVEL', label: 'Seyahat & Konaklama' },
        { id: 'FINANCE', label: 'Finans & Varlık' },
        { id: 'VEHICLE', label: 'Araç & Ulaşım' },
        { id: 'BUSINESS', label: 'İş & Ekonomik' },
        { id: 'EDUCATION', label: 'Eğitim & Meslek' },
        { id: 'LEGAL', label: 'Yasal & Denetim' },
        { id: 'SYSTEM', label: 'Sistem & Yönetim' },
        { id: 'ANALYTICS', label: 'Özel Analitik' },
    ];

    const getRolePriority = (role: UserRole) => {
        switch(role) {
            case 'ADMIN': return 5;
            case 'ULTRA': return 4;
            case 'VIP': return 3;
            case 'PREMIUM': return 2;
            case 'FREE': return 1;
            default: return 0;
        }
    };

    return (
        <aside className={`fixed inset-y-0 left-0 w-80 bg-bg-1 border-r border-line-1 transform transition-transform duration-300 z-40 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="p-8 border-b border-line-1 flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-ice/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <h1 className="text-2xl font-black text-white italic tracking-tighter flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-accent-2" />
                    NEXU<span className="text-accent-ice drop-shadow-[0_0_8px_rgba(127,211,255,0.6)]">X</span><span className="text-white/20 font-light mx-1">|</span>MARKA
                </h1>
                <div className="flex items-center gap-2">
                    <p className="text-[9px] text-text-2 font-mono tracking-[0.25em] uppercase">Control & Inquiry</p>
                    <div className="flex-1 h-px bg-line-1 opacity-20" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3">
                {categories.map(category => {
                    // Hide SYSTEM category for non-admins
                    if (category.id === 'SYSTEM' && userRole !== 'ADMIN') return null;

                    const categoryItems = MENU_ITEMS.filter(item => item.category === category.id);
                    if (categoryItems.length === 0) return null;
                    
                    const isExpanded = expandedCategories.includes(category.id);
                    const hasActiveItem = categoryItems.some(i => i.id === activeQuery);

                    return (
                        <div key={category.id} className="space-y-1.5">
                            <button 
                                onClick={() => toggleCategory(category.id)}
                                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all
                                ${hasActiveItem || isExpanded ? 'text-white bg-white/5' : 'text-text-2 hover:text-white hover:bg-white/2'}`}
                            >
                                <span className="flex items-center gap-2.5">
                                    <div className={`w-1.5 h-1.5 rounded-full transition-all ${hasActiveItem ? 'bg-accent-ice shadow-[0_0_8px_#7FD3FF]' : 'bg-slate-700'}`} />
                                    {category.label}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            {isExpanded && (
                                <div className="space-y-1 pl-3 animate-in slide-in-from-top-2 duration-300">
                                    {categoryItems.map(item => {
                                        const isLocked = getRolePriority(userRole) < getRolePriority(item.requiredRole);
                                        const isActive = activeQuery === item.id;

                                        return (
                                            <div key={item.id} className="group/item relative">
                                                <button
                                                    onClick={() => !isLocked && onSelect(item.id)}
                                                    disabled={isLocked}
                                                    title={isLocked ? `${item.requiredRole} YETKİSİ GEREKLİ` : item.label}
                                                    className={`w-full text-left p-3 pl-4 rounded-lg text-[10px] font-mono transition-all flex items-center justify-between group/btn
                                                        ${isActive 
                                                            ? 'bg-accent-2 text-white shadow-glow' 
                                                            : isLocked 
                                                                ? 'text-slate-700 cursor-not-allowed' 
                                                                : 'text-text-2 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : isLocked ? 'text-slate-800' : 'text-slate-500 group-hover/btn:text-accent-2 transition-colors'}`} />
                                                        <span className={isLocked ? 'line-through opacity-50' : ''}>{item.label}</span>
                                                    </div>
                                                    {isLocked && <Lock className="w-3 h-3 text-slate-800" />}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer / User Info */}
            <div className="p-5 border-t border-line-1 bg-bg-2/30">
                 <div className="flex items-center gap-3 mb-3">
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${userRole === 'ADMIN' ? 'bg-accent-2/20 border-accent-2 text-accent-2' : 'bg-bg-3 border-line-1 text-slate-500'}`}>
                         <User className="w-4 h-4" />
                     </div>
                     <div className="flex-1 min-w-0">
                         <div className="text-[10px] font-black text-white uppercase truncate">{userRole} USER</div>
                         <div className="text-[9px] text-slate-500 font-mono truncate">ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
                     </div>
                 </div>
                 <div className="flex gap-2 text-[9px] font-mono text-slate-600">
                     <span>v2.4.1</span>
                     <span>•</span>
                     <span className="text-status-ok">ONLINE</span>
                 </div>
            </div>
        </aside>
    );
};
