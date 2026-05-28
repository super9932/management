// ── 공통 ────────────────────────────────────────────────────────────────────

export interface Meta {
  page: number;
  limit: number;
  total: number;
}

// ── Enum ────────────────────────────────────────────────────────────────────

export type ServiceType = 'CUSTOMER_MGMT' | 'NEW_CONTRACT' | 'PROSPECT';
export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';
export type SourceType = 'TERMS' | 'MANUAL';
export type SourceSection = 'DISCLAIMER' | 'SUMMARY' | 'DETAIL' | 'CAUTION';
export type TriggerType = 'SCHEDULED' | 'MANUAL';

export type DocCategory = 'POLICY' | 'MANUAL' | 'GUIDE' | 'OTHER';
export type DocType = 'POLICY_TERMS' | 'SERVICE_MANUAL' | 'PRODUCT_MANUAL' | 'OPS_GUIDE';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type UploadStatus = 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type JobPhase = 'UPLOAD' | 'CHUNK' | 'EMBEDDING' | 'INDEXING';

export type RoleCode =
  | 'SYSTEM_ADMIN'
  | 'DOC_ADMIN'
  | 'PROMPT_ADMIN'
  | 'MONITOR_ADMIN'
  | 'DOC_REVIEWER';

export type SettingValueType = 'STRING' | 'INT' | 'BOOL' | 'JSON';
export type Rating = 'POSITIVE' | 'NEGATIVE';
export type AiSyncStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

// ── §06 챗봇 ────────────────────────────────────────────────────────────────

export interface ConversationItem {
  conversationId: string;
  fpId: string;
  serviceType: ServiceType;
  title: string;
  lastMessageAt: string;
}

export interface ConversationListResponse {
  data: ConversationItem[];
  meta: Meta;
}

export interface MessageSource {
  documentId: string;
  fileId: string;
  sourceType: SourceType;
  section: SourceSection | null;
  page: number;
}

export interface Message {
  messageId: string;
  seqNo: number;
  role: MessageRole;
  content: string;
  sources?: MessageSource[];
  createdAt: string;
}

export interface MessageListResponse {
  conversationId: string;
  messages: Message[];
}

export interface SearchResultItem {
  messageId: string;
  conversationId: string;
  fpId: string;
  snippet: string;
  createdAt: string;
}

export interface SearchResponse {
  data: SearchResultItem[];
  meta: Meta;
}

export interface PurgeResult {
  triggerType: TriggerType;
  dryRun: boolean;
  deletedConversations: number;
  deletedMessages: number;
  deletedSources: number;
  deletedFeedback: number;
  deletedToolCalls: number;
  earliestDeleted: string;
  latestDeleted: string;
  executedAt: string;
  durationMs: number;
}

// ── §07 문서 관리 ────────────────────────────────────────────────────────────

export interface DocumentUploadResult {
  documentId: string;
  category: DocCategory;
  documentType: DocType;
  title: string;
  fileName: string;
  parsedProdKind: string | null;
  parsedProdName: string | null;
  productMasterId: number | null;
  prodCode: string | null;
  effectiveFrom: string;
  approvalId: number;
  approvalStatus: ApprovalStatus;
  status: UploadStatus;
}

export interface DocumentJobStatus {
  documentId: string;
  title: string;
  status: UploadStatus;
  phase: JobPhase;
  attemptNo: number;
  errorMessage: string | null;
  updatedAt: string;
}

export interface SyncResult {
  syncLogId: number;
  status: 'STARTED';
  triggerType: TriggerType;
}

export interface DocumentItem {
  documentId: string;
  category: DocCategory;
  documentType: DocType;
  title: string;
  fileName: string;
  productMasterId: number | null;
  approvalStatus: ApprovalStatus;
  uploadStatus: UploadStatus;
  registeredBy: string;
  approvedBy: string | null;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  createdAt: string;
}

export interface DocumentListResponse {
  items: DocumentItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ApproveResult {
  approvalId: number;
  documentId: string;
  approvalStatus: ApprovalStatus;
  approvedAt: string;
  approvedBy: string;
}

// ── §08 권한 관리 ────────────────────────────────────────────────────────────

export interface UserItem {
  userId: string;
  name: string;
  roles: RoleCode[];
  lastLoginAt: string;
  isActive: boolean;
}

export interface UserListResponse {
  items: UserItem[];
  total: number;
  page: number;
  limit: number;
}

export interface RoleItem {
  roleCode: RoleCode;
  name: string;
  permissions: string[];
  userCount: number;
}

export interface SettingItem {
  key: string;
  value: string;
  valueType: SettingValueType;
  updatedAt: string;
  updatedBy: string;
}

export interface SettingCategory {
  category: string;
  settings: SettingItem[];
}

export interface SettingUpdateResult {
  updated: { key: string; oldValue: string; newValue: string }[];
}

// ── §09 통계 ────────────────────────────────────────────────────────────────

export interface UserStats {
  dau: number;
  mau: number;
  avgSessionMinutes: number;
  byDate: { date: string; dau: number; sessions: number }[];
}

export interface QueryStats {
  totalQueries: number;
  byCategory: { category: string; count: number; rephrasingRate: number }[];
  avgResponseTimeMs: number;
  p95ResponseTimeMs: number;
}

export interface FeedbackStats {
  positive: number;
  negative: number;
  ratio: number;
  recent: {
    feedbackId: number;
    messageId: string;
    rating: Rating;
    comment: string;
    createdAt: string;
  }[];
}

export interface FeedbackDetail {
  feedbackId: number;
  messageId: string;
  conversationId: string;
  userId: string;
  rating: Rating;
  comment: string;
  messageContent: string;
  userQuery: string;
}

export interface TokenStats {
  monthlyTotalTokens: number;
  monthlyCostUsd: number;
  dailyAvgTokens: number;
  dailyAvgCostUsd: number;
  budget: {
    monthlyLimitUsd: number;
    remainingUsd: number;
    alertThreshold: number;
  };
}

// ── §10 프롬프트 ─────────────────────────────────────────────────────────────

export interface PromptActive {
  templateId: number;
  version: number;
  body: string;
  aiSyncStatus: AiSyncStatus;
  aiSyncedAt: string;
}

export interface PromptType {
  typeCode: string;
  name: string;
  active: PromptActive | null;
}

export interface PromptUpsertResult {
  templateId: number;
  typeCode: string;
  version: number;
  status: 'ACTIVE';
  aiSyncStatus: AiSyncStatus;
}
