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
  statsSummary: withBase('/v1/get/customer/admin/touch/stats/summary'),
  statsMessages: withBase('/v1/get/customer/admin/touch/stats/messages'),
  statsExcel: withBase('/v1/post/customer/admin/touch/stats/excel'),
  statsAggregate: withBase('/v1/post/customer/admin/touch/stats/aggregate'),

  // ── 고객터치AI · 관리자 · 서비스통계(일자별 큐브) ───────────────────────────
  statsMessageDaily: withBase('/v1/get/customer/admin/touch/stats/message/daily'),
  statsSearchDaily: withBase('/v1/get/customer/admin/touch/stats/search/daily'),
  statsMessageExcel: withBase('/v1/post/customer/admin/touch/stats/message/excel'),
  statsSearchExcel: withBase('/v1/post/customer/admin/touch/stats/search/excel'),
  statsRecompute: withBase('/v1/post/customer/admin/touch/stats/recompute'),

  // ── 고객터치AI · 관리자 · 프롬프트 ─────────────────────────────────────────
  promptCreate: withBase('/v1/post/customer/admin/touch/message/prompt'),
  promptUpdate: withBase('/v1/post/customer/admin/touch/message/prompt/update'),
  promptDelete: withBase('/v1/post/customer/admin/touch/message/prompt/delete'),
  promptGet: withBase('/v1/get/customer/admin/touch/message/prompt'),
  promptList: withBase('/v1/get/customer/admin/touch/message/prompt/list'),
  promptCategories: withBase('/v1/get/customer/admin/touch/message/prompt/categories'),
  promptSlots: withBase('/v1/get/customer/admin/touch/message/prompt/slots'),
  promptDuplicate: withBase('/v1/get/customer/admin/touch/message/prompt/duplicate'),

  // ── 고객터치AI · 관리자 · Kill-Switch ──────────────────────────────────────
  killSwitchSave: withBase('/v1/post/customer/admin/touch/killswitch/save'),
  killSwitchList: withBase('/v1/get/customer/admin/touch/killswitch/list'),
  killSwitchDetail: withBase('/v1/get/customer/admin/touch/killswitch/detail'),
  killSwitchCheck: withBase('/v1/get/customer/admin/touch/killswitch/check'),

  // ── 고객터치AI · 관리자 · NAH 콘텐츠 ───────────────────────────────────────
  contentNahGet: withBase('/v1/get/customer/admin/touch/content/nah'),
  contentNahRegister: withBase('/v1/post/customer/admin/touch/content/nah'),
  contentNahUpdate: withBase('/v1/post/customer/admin/touch/content/nah/update'),
} as const;

export type NabCustomerTouchApiKey = keyof typeof NAB_CUSTOMER_TOUCH_API;

export const NAB_COUNSEL_BACKOFFICE_API = {
  // ── 상담AI · 백오피스 · 통계 ───────────────────────────────────────────────
  statsMessageList: withBase('/v1/get/counsel/admin/statistics/message/list'),
  statsMessageExcel: withBase('/v1/get/counsel/admin/statistics/message/excel'),

  // ── 상담AI · 백오피스 · 매뉴얼 ─────────────────────────────────────────────
  manualList: withBase('/v1/get/counsel/admin/manual/list'),
  manualDetail: withBase('/v1/get/counsel/admin/manual/detail'),
  manualHistoryList: withBase('/v1/get/counsel/admin/manual/history/list'),
  manualSave: withBase('/v1/post/counsel/admin/manual/save'),
  manualUpdate: withBase('/v1/post/counsel/admin/manual/update'),
  manualDelete: withBase('/v1/delete/counsel/admin/manual'),
  manualInitLoad: withBase('/v1/post/counsel/admin/manual/init-load'),

  // ── 상담AI · 백오피스 · 약관 ───────────────────────────────────────────────
  stipulationList: withBase('/v1/get/counsel/admin/stipulation/list'),
  stipulationDetail: withBase('/v1/get/counsel/admin/stipulation/detail'),
  stipulationSave: withBase('/v1/post/counsel/admin/stipulation/save'),
  stipulationDelete: withBase('/v1/delete/counsel/admin/stipulation'),
  stipulationInitLoad: withBase('/v1/post/counsel/admin/stipulation/init-load'),

  // ── 상담AI · 백오피스 · 점검 Kill-Switch ───────────────────────────────────
  killSwitchList: withBase('/v1/get/counsel/admin/killswitch/list'),
  killSwitchDetail: withBase('/v1/get/counsel/admin/killswitch/detail'),
  killSwitchSave: withBase('/v1/post/counsel/admin/killswitch/save'),
} as const;

export type NabCounselBackofficeApiKey = keyof typeof NAB_COUNSEL_BACKOFFICE_API;
