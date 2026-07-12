import { http, HttpResponse } from 'msw';
import { conversations, buildMessages, searchResults, purgeResult } from './data/chatbo';
import { documents, jobStatuses, uploadResult, syncResult, approveResult } from './data/documents';
import { users, roles, settings, settingUpdateResult } from './data/permissions';
import { userStats, queryStats, feedbackStats, feedbackDetails, tokenStats } from './data/stats';
import { promptTypes, promptHistory, promptUpsertResult } from './data/prompts';

const BASE = '/api/counsel';

function paginate<T>(items: T[], page = 1, limit = 20) {
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { page, limit, total: items.length },
  };
}

function ok<T>(data: T) {
  return HttpResponse.json({ success: true, data });
}

function okPaged<T>(items: T[], url: URL) {
  const page = Number(url.searchParams.get('page') ?? 1);
  const limit = Number(url.searchParams.get('limit') ?? 20);
  const { data, meta } = paginate(items, page, limit);
  return HttpResponse.json({ success: true, data, meta });
}

export const handlers = [

  // ── §06 백오피스 · 챗봇 ─────────────────────────────────────────────────────

  // No.21 — 전체 대화 목록
  http.get(`${BASE}/bo/v1/chat/conversations`, ({ request }) => {
    const url = new URL(request.url);
    const fpId = url.searchParams.get('fpId');
    const serviceType = url.searchParams.get('serviceType');
    let list = [...conversations];
    if (fpId) list = list.filter((c) => c.fpId === fpId);
    if (serviceType) list = list.filter((c) => c.serviceType === serviceType);
    return okPaged(list, url);
  }),

  // No.22 — 세션 메시지
  http.get(`${BASE}/bo/v1/chat/conversations/session`, ({ request }) => {
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversationId') ?? conversations[0].conversationId;
    return ok(buildMessages(conversationId));
  }),

  // No.23 — 키워드 검색
  http.get(`${BASE}/bo/v1/chat/conversations/search`, ({ request }) => {
    const url = new URL(request.url);
    return okPaged(searchResults, url);
  }),

  // No.24 — 대화이력 영구삭제
  http.post(`${BASE}/bo/v1/post/admin/conversations/purge`, () => {
    return ok(purgeResult);
  }),

  // ── §07 백오피스 · 문서 관리 ───────────────────────────────────────────────

  // No.25 — 문서 등록
  http.post(`${BASE}/bo/v1/post/admin/documents`, () => {
    return ok(uploadResult);
  }),

  // No.26 — 작업 상태
  http.get(`${BASE}/bo/v1/get/products/document`, ({ request }) => {
    const url = new URL(request.url);
    const documentId = url.searchParams.get('documentId');
    const status = documentId
      ? [jobStatuses.find((j) => j.documentId === documentId) ?? jobStatuses[0]]
      : [jobStatuses[0]];
    return ok(status);
  }),

  // No.27 — 상품 Sync
  http.post(`${BASE}/bo/v1/post/products/sync`, () => {
    return ok(syncResult);
  }),

  // No.28 — 임베딩 콜백 (Internal)
  http.post(`${BASE}/internal/v1/post/products/documents/:documentId/embedding-status`, ({ params }) => {
    return ok({
      documentId: params.documentId,
      phase: 'EMBED',
      status: 'SUCCESS',
      overallStatus: 'COMPLETED',
    });
  }),

  // No.29 — 문서 조회
  http.get(`${BASE}/bo/v1/get/admin/documents`, ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword')?.toLowerCase();
    const category = url.searchParams.get('category');
    const approvalStatus = url.searchParams.get('approvalStatus');
    const uploadStatus = url.searchParams.get('uploadStatus');
    let list = [...documents];
    if (keyword) list = list.filter((d) => d.title.toLowerCase().includes(keyword));
    if (category) list = list.filter((d) => d.category === category);
    if (approvalStatus) list = list.filter((d) => d.approvalStatus === approvalStatus);
    if (uploadStatus) list = list.filter((d) => d.uploadStatus === uploadStatus);
    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 20);
    const { data, meta } = paginate(list, page, limit);
    return HttpResponse.json({ success: true, data: { items: data, ...meta } });
  }),

  // No.30 — 문서 다운로드
  http.get(`${BASE}/bo/v1/get/admin/documents/download`, () => {
    return ok({ url: 'http://localhost:3845/mock-document.pdf' });
  }),

  // No.31 — 결재 승인/반려
  http.post(`${BASE}/bo/v1/post/admin/documents/approve`, () => {
    return ok(approveResult);
  }),

  // ── §08 백오피스 · 권한 관리 ───────────────────────────────────────────────

  // No.32 — 사용자 조회
  http.get(`${BASE}/bo/v1/get/admin/users`, ({ request }) => {
    const url = new URL(request.url);
    const roleCode = url.searchParams.get('roleCode');
    const keyword = url.searchParams.get('keyword')?.toLowerCase();
    let list = [...users];
    if (roleCode) list = list.filter((u) => u.roles.includes(roleCode));
    if (keyword) list = list.filter((u) => u.name.toLowerCase().includes(keyword) || u.userId.includes(keyword));
    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 20);
    const { data, meta } = paginate(list, page, limit);
    return HttpResponse.json({ success: true, data: { items: data, ...meta } });
  }),

  // No.33 — 권한 목록
  http.get(`${BASE}/bo/v1/get/admin/roles`, () => {
    return ok(roles);
  }),

  // No.34 — 시스템 설정 조회
  http.get(`${BASE}/bo/v1/get/admin/settings`, () => {
    return ok(settings);
  }),

  // No.35 — 시스템 설정 변경
  http.post(`${BASE}/bo/v1/post/admin/settings`, () => {
    return ok(settingUpdateResult);
  }),

  // ── §09 백오피스 · 통계 ────────────────────────────────────────────────────

  // No.36 — 사용자 통계
  http.get(`${BASE}/bo/v1/get/admin/stats/users`, () => {
    return ok(userStats);
  }),

  // No.37 — 질의 통계
  http.get(`${BASE}/bo/v1/get/admin/stats/queries`, () => {
    return ok(queryStats);
  }),

  // No.38 — 피드백 집계
  http.get(`${BASE}/bo/v1/get/admin/stats/feedback`, () => {
    return ok(feedbackStats);
  }),

  // No.39 — 피드백 상세
  http.get(`${BASE}/bo/v1/get/admin/feedback`, ({ request }) => {
    const url = new URL(request.url);
    const feedbackId = Number(url.searchParams.get('feedbackId') ?? 1);
    const detail = feedbackDetails.find((f) => f.feedbackId === feedbackId) ?? feedbackDetails[0];
    return ok(detail);
  }),

  // No.40 — 토큰 사용량
  http.get(`${BASE}/bo/v1/get/admin/stats/tokens`, () => {
    return ok(tokenStats);
  }),

  // ── §10 백오피스 · 프롬프트 ───────────────────────────────────────────────

  // No.41 — 프롬프트 유형 조회
  http.get(`${BASE}/bo/v1/get/admin/prompts/types`, () => {
    return ok(promptTypes);
  }),

  // No.41 이력 — 버전별 목록 (확장)
  http.get(`${BASE}/bo/v1/get/admin/prompts/history`, ({ request }) => {
    const url = new URL(request.url);
    return okPaged(promptHistory, url);
  }),

  // No.42 — 프롬프트 등록/수정
  http.post(`${BASE}/bo/v1/post/admin/prompts`, () => {
    return ok(promptUpsertResult);
  }),
];
