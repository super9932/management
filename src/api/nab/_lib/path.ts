/**
 * NAB API 경로 단일 관리
 *
 * - 모든 경로 앞에 BASE_PATH가 붙는다(현재는 빈 값 — 서버가 /api 바로 아래에 라우팅한다).
 * - axios baseURL(ENV_CONFIG.APP_API_BASE_URL)과 합쳐져 `{서버}/api/v1/...` 형태가 된다.
 * - 조회성 API도 경로에 /get/ 이 들어갈 뿐 HTTP 메서드는 모두 POST다.
 */

export const BASE_PATH = '';

const withBase = (path: string) => `${BASE_PATH}${path}` as const;

export const NAB_CUSTOMER_TOUCH_API = {
  // ── 고객터치AI · 관리자 · 통계 ─────────────────────────────────────────────

  // ── 고객터치AI · 관리자 · 서비스통계(일자별 큐브) ───────────────────────────
  statsMessageDaily: withBase('/v1/get/customer/admin/touch/stats/message/daily'),
  statsSearchDaily: withBase('/v1/get/customer/admin/touch/stats/search/daily'),
  // 앞단이 바이너리 응답을 file/download 패턴 경로에서만 내보낸다 (종전 /stats/*/excel 은 404)
  statsMessageExcel: withBase('/v1/post/customer/admin/touch/stats/message/file/download/excel'),
  statsSearchExcel: withBase('/v1/post/customer/admin/touch/stats/search/file/download/excel'),

  // ── 고객터치AI · 관리자 · 프롬프트 ─────────────────────────────────────────
  promptCreate: withBase('/v1/post/customer/admin/touch/message/prompt'),
  promptUpdate: withBase('/v1/post/customer/admin/touch/message/prompt/update'),
  promptDelete: withBase('/v1/post/customer/admin/touch/message/prompt/delete'),
  promptGet: withBase('/v1/get/customer/admin/touch/message/prompt'),
  promptList: withBase('/v1/get/customer/admin/touch/message/prompt/list'),
  promptCategories: withBase('/v1/get/customer/admin/touch/message/prompt/categories'),

  // ── 고객터치AI · 관리자 · Kill-Switch ──────────────────────────────────────
  killSwitchSave: withBase('/v1/post/customer/admin/touch/killswitch/save'),
  killSwitchDetail: withBase('/v1/get/customer/admin/touch/killswitch/detail'),
  killSwitchCheck: withBase('/v1/get/customer/admin/touch/killswitch/check'),

  // ── 고객터치AI · 관리자 · NAH 콘텐츠 ───────────────────────────────────────
} as const;

export type NabCustomerTouchApiKey = keyof typeof NAB_CUSTOMER_TOUCH_API;

export const NAB_COUNSEL_BACKOFFICE_API = {
  // ── 상담AI · 백오피스 · 통계 ───────────────────────────────────────────────
  statsMessageList: withBase('/v1/get/counsel/admin/statistics/message/list'),
  // 앞단이 바이너리 응답을 file/download 패턴 경로에서만 내보낸다 (종전 /statistics/message/excel 은 404)
  statsMessageExcel: withBase('/v1/get/counsel/admin/statistics/message/file/download/excel'),

  // ── 상담AI · 백오피스 · 매뉴얼 ─────────────────────────────────────────────
  manualList: withBase('/v1/get/counsel/admin/manual/list'),
  manualDetail: withBase('/v1/get/counsel/admin/manual/detail'),
  manualHistoryList: withBase('/v1/get/counsel/admin/manual/history/list'),
  // 분류 원장은 서버 enum 이라 요청 본문이 없다 — 관리주체별 분류는 FE 가 걸러 쓴다
  manualClsfList: withBase('/v1/get/counsel/admin/manual/clsf/list'),
  // 앞단이 멀티파트를 file/upload 패턴 경로에서만 받는다 (종전 /manual/save 는 전환 기간 한정)
  manualSave: withBase('/v1/post/counsel/admin/manual/file/upload/save'),
  manualUpdate: withBase('/v1/post/counsel/admin/manual/update'),
  manualDelete: withBase('/v1/delete/counsel/admin/manual'),

  // ── 상담AI · 백오피스 · 약관 ───────────────────────────────────────────────
  stipulationList: withBase('/v1/get/counsel/admin/stipulation/list'),
  stipulationDetail: withBase('/v1/get/counsel/admin/stipulation/detail'),
  // 앞단이 멀티파트를 file/upload 패턴 경로에서만 받는다 (종전 /stipulation/save 는 전환 기간 한정)
  stipulationSave: withBase('/v1/post/counsel/admin/stipulation/file/upload/save'),
  stipulationDelete: withBase('/v1/delete/counsel/admin/stipulation'),

  // ── 상담AI · 백오피스 · 점검 Kill-Switch ───────────────────────────────────
  killSwitchDetail: withBase('/v1/get/counsel/admin/killswitch/detail'),
  killSwitchSave: withBase('/v1/post/counsel/admin/killswitch/save'),
} as const;

export type NabCounselBackofficeApiKey = keyof typeof NAB_COUNSEL_BACKOFFICE_API;
