
export type UserRole = 'FREE' | 'PREMIUM' | 'VIP' | 'ULTRA' | 'ADMIN' | 'GUEST';

export interface UserSession {
  isAuthenticated: boolean;
  role: UserRole;
  key: string;
  expiryDate?: string;
}

export interface AccessKey {
  id: string;
  key: string;
  role: UserRole;
  status: 'ACTIVE' | 'BANNED' | 'EXPIRED';
  createdAt: string;
  expiresAt: string;
  owner?: string;
  email?: string; // Added for user management
  lastLogin?: string; // Added for user stats
  usageCount: number;
}

export enum LogSeverity {
  CRITICAL = 'CRITICAL',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

export enum AdminLogEvent {
  FAILED_LOGIN = 'GİRİŞ_İHLALİ',
  UNAUTHORIZED_QUERY = 'YETKİSİZ_ERİŞİM',
  SYSTEM_LOGIN = 'SİSTEM_OTURUMU',
  KEY_MANAGEMENT = 'ANAHTAR_İŞLEMİ',
  ROLE_MODIFICATION = 'ROL_GÜNCELLEME',
  MAINTENANCE_TOGGLE = 'BAKIM_MODU_DEĞİŞİMİ',
}

export interface AuditLog {
  id: string;
  timestamp: string;
  event: AdminLogEvent | string;
  user: string;
  ip: string;
  severity: LogSeverity;
  details: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: QueryType[];
  color: string;
}

export interface SystemConfig {
  theme: 'obsidian' | 'steel' | 'blue';
  notifications: {
      enableEmail: boolean;
      enableInApp: boolean;
      cpuThreshold: number;
      failedLoginThreshold: number;
  };
  maintenanceMode: boolean;
}

export interface VerificationResult {
  isValid: boolean;
  message: string;
  timestamp: string;
  durationMs?: number;
  queryType: string;
  profile?: ConsolidatedProfile; 
  data?: any;
}

export interface ConsolidatedProfile {
  fullName: string;
  tckn: string;
  riskScore: number;
  riskLevel: 'DÜŞÜK' | 'ORTA' | 'YÜKSEK' | 'KRİTİK';
  financialStatus: string;
  criminalStatus: string;
  flags: string[];
  lastLocation?: string;
  photoUrl?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  queryType: string;
  tckn: string;
  label: string;
  summary?: string;
  [key: string]: any;
}

export enum ValidationStatus {
  IDLE = 'IDLE',
  VALIDATING = 'VALIDATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type QueryType = string;

export interface MenuItem {
  id: QueryType;
  label: string;
  icon: any;
  requiredRole: UserRole;
  category: 'PERSONAL' | 'FAMILY' | 'LOCATION' | 'GSM' | 'HEALTH' | 'TRAVEL' | 'FINANCE' | 'VEHICLE' | 'BUSINESS' | 'EDUCATION' | 'LEGAL' | 'SYSTEM' | 'ANALYTICS';
}

export interface QueryFormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  maxLength?: number;
  icon: any;
  required?: boolean;
  validation?: (value: string) => string | null;
  format?: (value: string) => string;
  isSensitive?: boolean;
}

export interface Ticket {
  id: string;
  type: 'SUPPORT' | 'PERMISSION' | 'UPGRADE' | 'REPORT_REQUEST';
  subject: string;
  message: string;
  status: 'Oluşturuldu' | 'İşlemde' | 'Onaylandı' | 'Cevaplandı' | 'Tamamlandı' | 'Reddedildi';
  createdAt: string;
  priority: 'NORMAL' | 'HIGH';
}

// Added SystemAnalysisData interface
export interface SystemAnalysisData {
  cpu: number[];
  networkIn: number[];
  networkOut: number[];
  activeConnections: number;
}
