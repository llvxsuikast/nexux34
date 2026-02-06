
import { VerificationResult, QueryType, ConsolidatedProfile } from '../types';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- Data Generators ---

const generateConsolidatedProfile = (formData: { [key: string]: string }): ConsolidatedProfile => {
    const tckn = formData.tc?.replace(/\D/g, '') || formData.tckn?.replace(/\D/g, '') || '10293847566';
    const fullName = formData.fullName ? formData.fullName.toUpperCase() : (formData.ad ? `${formData.ad} ${formData.soyad}`.toUpperCase() : 'CAN YILDIRIM');
    
    // Deterministic randomness based on TCKN
    const lastDigit = parseInt(tckn.slice(-1)) || 0;
    const isVip = lastDigit % 2 === 0; 
    const riskScore = lastDigit * 10 + randomInt(0, 9);

    return {
        fullName,
        tckn,
        riskScore,
        riskLevel: riskScore > 80 ? 'KRİTİK' : riskScore > 50 ? 'YÜKSEK' : riskScore > 20 ? 'ORTA' : 'DÜŞÜK',
        financialStatus: isVip ? 'POZİTİF (A+)' : 'STANDART (B)',
        criminalStatus: riskScore > 85 ? 'ARANIYOR' : 'TEMİZ',
        flags: isVip ? ["PROTOKOL", "KAMU_PERSONELİ", "YEŞİL_PASAPORT"] : (riskScore > 70 ? ["ADLİ_TAKİP", "YURTDIŞI_YASAĞI"] : ["SİVİL", "SEÇMEN"]),
        lastLocation: isVip ? "KONUM_GİZLİ / ANKARA" : "İSTANBUL / KADIKÖY / CADDEBOSTAN",
        photoUrl: ''
    };
};

// --- Mock Data Builders for specific categories ---

const getIdentityData = (tckn: string) => ({
    identity_card: {
        serial: `A12${randomInt(100000, 999999)}`,
        valid_until: `12.05.${randomInt(2025, 2033)}`,
        issuing_authority: 'İÇİŞLERİ BAKANLIĞI',
        type: 'TURKUAZ KART / YENİ TİP',
        reason: 'YENİLEME',
        delivery_status: 'TESLİM EDİLDİ'
    },
    vital_stats: {
        cilt_no: String(randomInt(10, 99)),
        aile_sira_no: String(randomInt(100, 999)),
        registry: 'İSTANBUL / KADIKÖY / BOSTANCI',
        birth_place: randomChoice(['ANKARA', 'İSTANBUL', 'İZMİR', 'ADANA']),
        birth_date: `15.04.${randomInt(1970, 2000)}`,
        status: randomChoice(['EVLİ', 'BEKAR', 'DUL']),
        religion: 'İSLAM',
        father_name: 'MEHMET',
        mother_name: 'AYŞE'
    }
});

const getFamilyData = () => ({
    family_tree: [
        { role: 'BABA', name: 'MEHMET YILDIRIM', birth: '1960', status: 'SAĞ', tckn: '22*******12' },
        { role: 'ANNE', name: 'AYŞE YILDIRIM', birth: '1965', status: 'SAĞ', tckn: '33*******14' },
        { role: 'EŞ', name: 'ZEYNEP YILDIRIM', birth: '1992', status: 'SAĞ', tckn: '44*******99' },
        { role: 'ÇOCUK', name: 'ALİ YILDIRIM', birth: '2015', status: 'SAĞ', tckn: '11*******22' },
        { role: 'KARDEŞ', name: 'VELİ YILDIRIM', birth: '1988', status: 'SAĞ', tckn: '55*******11' }
    ],
    relationship_graph: { nodes: 12, edges: 15, density: 'YÜKSEK' }
});

const getAddressData = () => ({
    residence: {
        full_address: 'CADDEBOSTAN MAH. BAĞDAT CAD. NO: 142 D: 8 KADIKÖY / İSTANBUL',
        move_in_date: '15.03.2019',
        type: 'APARTMAN DAİRESİ',
        muhtarlik: 'CADDEBOSTAN MUHTARLIĞI',
        uavt: String(randomInt(1000000000, 9999999999))
    },
    history: [
        { address: 'ETİLER MAH. NİSPETİYE CAD. BEŞİKTAŞ / İST', start: '2015', end: '2019' },
        { address: 'KIZILAY MAH. ATATÜRK BULVARI ÇANKAYA / ANK', start: '2010', end: '2015' }
    ],
    properties: [
        { il: 'İSTANBUL', ilçe: 'KADIKÖY', mahalle: 'CADDEBOSTAN', ada: '129', parsel: '4', yüzölçüm: '1250m2', tur: 'MESKEN', tarih: '2019', edinim: 'SATIŞ' }
    ]
});

const getGsmData = (inputGsm: string) => ({
    active_lines: [
        { number: inputGsm || '532 123 45 67', operator: 'TURKCELL', type: 'FATURALI', status: 'AKTİF', tescil: '2010', tarife: 'PLATINUM 50GB' },
        { number: '555 987 65 43', operator: 'TURK TELEKOM', type: 'FUKARA (ÖĞRENCİ)', status: 'PASİF', tescil: '2018', tarife: 'EKO PAKET' }
    ],
    devices: [
        { imei: '352938475610293', model: 'IPHONE 15 PRO MAX', last_seen: 'Bugün 14:30', location: 'İSTANBUL/KADIKÖY/BAZ_IST_421' },
        { imei: '869201938472819', model: 'SAMSUNG GALAXY S23', last_seen: 'Dün 22:15', location: 'İSTANBUL/KADIKÖY/EV_WIFI' }
    ],
    signals: [
        { time: '14:30', tower: 'KADIKÖY_MERKEZ_4', strength: '98%' },
        { time: '12:15', tower: 'BOSTANCI_SAHİL_2', strength: '85%' }
    ]
});

const getHealthData = () => ({
    diagnoses: [
        { name: 'Akut Üst Solunum Yolu Enfeksiyonu', date: '12.01.2024', code: 'J06.9', hospital: 'İSTANBUL EĞİTİM ARAŞTIRMA' },
        { name: 'Esansiyel Hipertansiyon', date: '05.11.2023', code: 'I10', hospital: 'ÖZEL MEDİCAL PARK' }
    ],
    prescriptions: [
        { code: '12AB34', date: '12.01.2024', meds: ['AUGMENTIN 1000MG', 'PAROL 500MG'], doctor: 'DR. AHMET K.' },
        { code: '99XY88', date: '05.11.2023', meds: ['DELIX 5MG', 'CORASPIN 100MG'], doctor: 'DR. FATMA Z.' }
    ],
    vaccines: [
        { name: 'COVID-19 BIONTECH', dose: '3. DOZ', date: '15.08.2022' },
        { name: 'TETANOZ', dose: 'RAPEL', date: '10.02.2020' }
    ]
});

const getFinanceData = () => ({
    summary: {
        total_asset: '2.450.000 ₺',
        total_debt: '125.000 ₺',
        score: '1650 (ÇOK İYİ)',
        risk: 'DÜŞÜK'
    },
    banks: [
        { name: 'GARANTİ BBVA', iban: 'TR12 0006 2000 0001 2345 6789 01', balance: '1.200.000 ₺', type: 'VADELİ MEVDUAT', status: 'AKTİF' },
        { name: 'İŞ BANKASI', iban: 'TR56 0006 4000 0001 9876 5432 10', balance: '45.000 ₺', type: 'VADESİZ TL', status: 'AKTİF' }
    ],
    cards: [
        { bank: 'YAPI KREDİ', limit: '250.000 ₺', debt: '12.450 ₺', cut_date: 'AYIN 15\'İ' }
    ]
});

const getVehicleData = (plate: string) => ({
    driver_license: {
        class: 'B (Otomobil)',
        date: '14.06.2012',
        serial: 'B012938',
        status: 'AKTİF',
        points: '0'
    },
    vehicles: [
        { plaka: plate || '34 VP 9921', marka: 'BMW', model: '5.20i', renk: 'SİYAH', yil: '2023', tescil: '10.01.2023', status: 'HAK MAHRUMİYETİ YOK' },
        { plaka: '35 KS 123', marka: 'FIAT', model: 'EGEA', renk: 'BEYAZ', yil: '2020', tescil: '05.05.2020', status: 'REHİNLİ' }
    ]
});

const getLegalData = (riskScore: number) => ({
    criminal_summary: {
        status: riskScore > 80 ? 'ARANIYOR' : 'TEMİZ',
        gbt: riskScore > 50 ? 'KAYIT MEVCUT' : 'TEMİZ',
        aranma: riskScore > 80 ? 'YAKALAMA KARARI AKTİF' : 'YOK'
    },
    cases: riskScore > 80 ? [
        { mahkeme: 'İSTANBUL 12. AĞIR CEZA', dosyaNo: '2023/129', tur: 'KAMU DAVASI', taraf: 'SANIK', durum: 'AÇIK' }
    ] : [
        { mahkeme: 'İSTANBUL 4. TÜKETİCİ', dosyaNo: '2021/442', tur: 'ALACAK DAVASI', taraf: 'DAVACI', durum: 'KARARA ÇIKTI' }
    ],
    past_records: riskScore > 50 ? [
        { sucTuru: 'HAKARET', kararNo: '2019/55', cezaSuresi: 'ADLİ PARA', kesinlesmeTarihi: '2019', infazDurumu: 'TAMAMLANDI' }
    ] : []
});

const getSystemLogs = () => ({
    logs: Array.from({length: 10}).map((_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        action: randomChoice(['LOGIN', 'QUERY', 'EXPORT', 'UPDATE']),
        ip: `192.168.1.${randomInt(10, 255)}`,
        status: 'SUCCESS'
    })),
    active_sessions: 1
});

const getAnalyticsData = () => ({
    timeline: [
        { date: '12.01.2024', title: 'GSM Sinyal Tespiti', desc: 'İSTANBUL / KADIKÖY - 14:30', type: 'GSM' },
        { date: '10.01.2024', title: 'Banka İşlemi', desc: 'Garanti BBVA - POS Alışveriş (250₺)', type: 'FINANCE' },
        { date: '05.01.2024', title: 'Hastane Girişi', desc: 'Medipol Hastanesi - Acil Servis', type: 'HEALTH' }
    ],
    analytics_score: '98.5 (GÜVENİLİR)',
    anomalies: [],
    network_graph: {
        nodes: [
            { id: 1, label: 'HEDEF', type: 'PERSON' },
            { id: 2, label: 'EŞ', type: 'PERSON' },
            { id: 3, label: 'ORTAK', type: 'PERSON' },
            { id: 4, label: 'ŞİRKET A', type: 'COMPANY' }
        ],
        links: [
            { source: 1, target: 2, label: 'EVLİLİK' },
            { source: 1, target: 4, label: 'SAHİP' },
            { source: 3, target: 4, label: 'YÖNETİCİ' }
        ]
    }
});

// --- Main Verification Function ---

export const verifyIdentity = async (formData: { [key: string]: string }, queryType: QueryType): Promise<VerificationResult> => {
  const startTime = performance.now();
  
  // High-fidelity latency simulation
  await new Promise(resolve => setTimeout(resolve, randomInt(1200, 2500)));

  const profile = generateConsolidatedProfile(formData);
  let data: any = {};

  // --- Massive Switch Case for 100% Coverage ---
  // PERSONAL
  if (queryType.includes('ad_soyad') || queryType.startsWith('kimlik')) {
      data = { ...getIdentityData(profile.tckn), ...getFamilyData() }; // Consolidated view
  } 
  // FAMILY
  else if (queryType.includes('aile') || queryType.includes('soy') || queryType.includes('hane') || queryType.includes('akraba')) {
      data = getFamilyData();
  }
  // ADDRESS & LOCATION
  else if (queryType.includes('adres') || queryType.includes('konum') || queryType.includes('ikamet') || queryType.includes('yerlesim')) {
      data = getAddressData();
  }
  // GSM
  else if (queryType.includes('gsm') || queryType.includes('telefon') || queryType.includes('iletisim') || queryType.includes('cihaz') || queryType.includes('hat')) {
      data = getGsmData(formData.gsm);
  }
  // HEALTH
  else if (queryType.includes('saglik') || queryType.includes('hastane') || queryType.includes('tedavi') || queryType.includes('ilac') || queryType.includes('recete') || queryType.includes('asi')) {
      data = getHealthData();
  }
  // FINANCE
  else if (queryType.includes('banka') || queryType.includes('iban') || queryType.includes('hesap') || queryType.includes('finans') || queryType.includes('tapu') || queryType.includes('mulkiyet')) {
      data = { ...getFinanceData(), ...getAddressData() }; // Include properties in finance
  }
  // VEHICLE
  else if (queryType.includes('arac') || queryType.includes('plaka') || queryType.includes('kaza') || queryType.includes('sigorta')) {
      data = getVehicleData(formData.plate);
  }
  // LEGAL & ADMIN
  else if (queryType.includes('sabika') || queryType.includes('dava') || queryType.includes('gbt') || queryType.includes('sorusturma') || queryType.includes('mahkeme') || queryType.includes('suc')) {
      data = getLegalData(profile.riskScore);
  }
  // TRAVEL
  else if (queryType.includes('seyahat') || queryType.includes('ucus') || queryType.includes('pasaport') || queryType.includes('konaklama')) {
      data = {
          passport_info: {
              passport_no: 'U12938477',
              type: 'HUSUSİ (YEŞİL)',
              issue_date: '01.02.2022',
              expiry_date: '01.02.2032',
              issuing_authority: 'NVİ GENEL MÜDÜRLÜĞÜ'
          },
          travel_history: [
              { destination: 'ALMANYA (FRANKFURT)', date: '10.12.2023', entry_point: 'İSTANBUL HL', exit_point: 'FRANKFURT', status: 'OK' },
              { destination: 'İTALYA (ROMA)', date: '05.06.2023', entry_point: 'SABİHA GÖKÇEN', exit_point: 'FIUMICINO', status: 'OK' }
          ]
      };
  }
  // BUSINESS & EDUCATION
  else if (queryType.includes('isyeri') || queryType.includes('vergi') || queryType.includes('ticari') || queryType.includes('egitim') || queryType.includes('okul') || queryType.includes('diploma')) {
      data = {
          tax_info: {
              tax_office: 'KADIKÖY VERGİ DAİRESİ',
              tax_no: '1234567890',
              status: 'MÜKELLEF',
              activity: 'YAZILIM DANIŞMANLIK'
          },
          degrees: [
              { okul: 'İSTANBUL TEKNİK ÜNİVERSİTESİ', bolum: 'BİLGİSAYAR MÜHENDİSLİĞİ', derece: 'LİSANS', tarih: '2015', gpa: '3.45' }
          ]
      };
  }
  // SYSTEM & ADMIN LOGS
  else if (queryType.includes('sistem') || queryType.includes('log') || queryType.includes('denetim') || queryType.includes('abonelik')) {
      data = getSystemLogs();
  }
  // ANALYTICS
  else if (queryType.includes('analiz') || queryType.includes('profil') || queryType.includes('tutarlilik') || queryType.includes('kesif') || queryType.includes('korelasyon')) {
      data = getAnalyticsData();
  }
  // FALLBACK
  else {
      // Intelligent fallback that tries to give at least Identity info
      data = getIdentityData(profile.tckn);
  }

  return {
      isValid: true,
      message: 'Sorgu başarıyla tamamlandı.',
      timestamp: new Date().toISOString(),
      durationMs: Math.floor(performance.now() - startTime),
      queryType,
      profile,
      data
  };
};
