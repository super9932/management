/**
 * §07 백오피스 · 문서 관리 — No.25~31
 */
import { fetcherWithParams, postFetcher, uploadFetcher } from '../fetcher';
import client from '../client';
import type {
  DocumentUploadResult,
  DocumentJobStatus,
  SyncResult,
  DocumentListResponse,
  ApproveResult,
  DocCategory,
  ApprovalStatus,
  UploadStatus,
  TriggerType,
} from '../types';

// No.25 — 문서 등록 (i) PDF 단건
export interface UploadPdfParams {
  file: File;
  category: DocCategory;
  documentType: string;
  title: string;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export const uploadDocument = (params: UploadPdfParams) => {
  const form = new FormData();
  form.append('file', params.file);
  form.append('category', params.category);
  form.append('documentType', params.documentType);
  form.append('title', params.title);
  if (params.effectiveFrom) form.append('effectiveFrom', params.effectiveFrom);
  if (params.effectiveTo) form.append('effectiveTo', params.effectiveTo);
  return uploadFetcher<DocumentUploadResult>('/bo/v1/post/admin/documents', form);
};

// No.25 — 문서 등록 (ii) PDF + CSV 일괄
export interface UploadBulkParams {
  pdf: File;
  csv: File;
  category: DocCategory;
  requestApproval?: boolean;
}

export const uploadBulkDocument = (params: UploadBulkParams) => {
  const form = new FormData();
  form.append('pdf', params.pdf);
  form.append('csv', params.csv);
  form.append('category', params.category);
  form.append('requestApproval', String(params.requestApproval ?? true));
  return uploadFetcher<DocumentUploadResult>('/bo/v1/post/admin/documents', form);
};

// No.26 — 업로드 문서 작업 상태 조회 (폴링용)
export const getDocumentStatus = (documentId: string) =>
  fetcherWithParams<DocumentJobStatus[]>(
    '/bo/v1/get/products/document',
    { documentId }
  );

// No.27 — 상품 정보 Pulling (Core sync)
export const syncProducts = (productCode?: string) =>
  postFetcher<SyncResult>(
    '/bo/v1/post/products/sync',
    productCode ? { productCode } : {}
  );

// No.28 — 임베딩 작업 상태 콜백 (AI BE → NAB BE, Internal)
// ※ HMAC + IP 화이트리스트 인증 — 일반 JWT와 다름. BE 내부 호출 전용.
export interface EmbeddingCallbackBody {
  phase: 'CHUNK' | 'EMBED';
  status: 'PENDING' | 'SUCCESS' | 'ERROR';
  attemptNo: number;
  chunkCount?: number;
  errorMessage?: string;
  occurredAt: string;
}

export const callbackEmbeddingStatus = (
  documentId: string,
  body: EmbeddingCallbackBody,
  hmacSignature: string
) =>
  client
    .post(
      `/internal/v1/post/products/documents/${documentId}/embedding-status`,
      body,
      { headers: { 'X-Internal-Signature': hmacSignature } }
    )
    .then((r) => r.data.data);

// No.29 — 문서 조회
export interface GetDocumentsParams {
  keyword?: string;
  category?: DocCategory;
  approvalStatus?: ApprovalStatus;
  prodCode?: string;
  prodKindCode?: string;
  uploadStatus?: UploadStatus;
  page?: number;
  limit?: number;
}

export const getDocuments = (params?: GetDocumentsParams) =>
  fetcherWithParams<DocumentListResponse>(
    '/bo/v1/get/admin/documents',
    params ?? {}
  );

// No.30 — 문서 다운로드 (signed URL redirect)
export const getDocumentDownloadUrl = (documentId: string) =>
  fetcherWithParams<{ url: string }>(
    '/bo/v1/get/admin/documents/download',
    { documentId }
  );

// No.31 — 결재 승인/반려
export interface ApproveBody {
  approvalId: number;
  decision: 'APPROVED' | 'REJECTED';
  reason?: string;
}

export const approveDocument = (body: ApproveBody) =>
  postFetcher<ApproveResult>(
    '/bo/v1/post/admin/documents/approve',
    body
  );

// ── 헬퍼: TriggerType re-export ──────────────────────────────────────────────
export type { TriggerType };
