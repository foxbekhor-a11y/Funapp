export type AppId = 
  | 'self_help'
  | 'defrag'
  | 'task_mgr'
  | 'certificate'
  | 'recycle_bin'
  | 'bsod'
  | 'readme'
  | 'settings'
  | 'games'
  | 'minecraft'
  | 'browser'
  | 'macos';

export interface WindowState {
  id: AppId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isFullscreen?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export type PersonaId = 'clippy' | 'dr_bsod' | 'karen_sysadmin' | 'defrag_guru';

export interface PersonaInfo {
  id: PersonaId;
  name: string;
  title: string;
  description: string;
  avatarIcon: string;
  themeColor: string;
}

export interface ConsultationResponse {
  roast: string;
  systemDiagnosis: string;
  unhelpfulAdvice: string[];
  emotionalSeverity: 'MILD_DISAPPOINTMENT' | 'KERNEL_PANIC' | 'EGO_SHATTERED' | 'FATAL_EXCEPTION';
  clippyThought: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  diagnosis?: string;
  unhelpfulAdvice?: string[];
  severity?: string;
  thought?: string;
  persona?: PersonaId;
}

export interface LifeProcess {
  name: string;
  pid: number;
  cpu: number;
  mem: string;
  status: 'Running' | 'Not Responding' | 'Corrupted' | 'Zombie' | 'Suspended' | 'Hung';
  description: string;
}

export interface CertificateData {
  title: string;
  recipient: string;
  awardedFor: string;
  citation: string;
  grade: string;
  serialNumber: string;
}
