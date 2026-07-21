/**
 * NAB API 경로 단일 관리
 *
 * - 모든 경로 앞에는 BASE_PATH('/nab')가 붙는다.
 * - axios baseURL('/api')과 합쳐져 최종 호출은 `/api/nab/v1/...` 형태가 된다.
 * - 조회성 API도 경로에 /get/ 이 들어갈 뿐 HTTP 메서드는 모두 POST다.
 */

export const BASE_PATH = '/nab';

const withBase = (path: string) => `${BASE_PATH}${path}` as const;

export const NAB_CUSTOMER_TOUCH_API = {
  // ── 고객터치AI · 관리자 · 통계 ─────────────────────────────────────────────
  statsSummary: withBase('/v1/get/customer/admin/touch/stats/summary'),
  statsMessages: withBase('/v1/get/customer/admin/touch/stats/messages'),
  statsExcel: withBase('/v1/post/customer/admin/touch/stats/excel'),
  statsAggregate: withBase('/v1/post/customer/admin/touch/stats/aggregate'),

  // ── 고객터치AI · 관리자 · 프롬프트 ─────────────────────────────────────────
  promptCreate: withBase('/v1/post/customer/admin/touch/message/prompt'),
  promptUpdate: withBase('/v1/post/customer/admin/touch/message/prompt/update'),
  promptDelete: withBase('/v1/post/customer/admin/touch/message/prompt/delete'),
  promptGet: withBase('/v1/get/customer/admin/touch/message/prompt'),
  promptList: withBase('/v1/get/customer/admin/touch/message/prompt/list'),
  promptGuide: withBase('/v1/get/customer/admin/touch/message/prompt/guide'),
  promptDuplicate: withBase('/v1/get/customer/admin/touch/message/prompt/duplicate'),

  // ── 고객터치AI · 관리자 · Kill-Switch ──────────────────────────────────────
  killSwitchSave: withBase('/v1/post/customer/admin/touch/killswitch/save'),
  killSwitchList: withBase('/v1/get/customer/admin/touch/killswitch/list'),
  killSwitchDetail: withBase('/v1/get/customer/admin/touch/killswitch/detail'),
  killSwitchCheck: withBase('/v1/get/customer/admin/touch/killswitch/check'),

  // ── 고객터치AI · 관리자 · 카테고리 ─────────────────────────────────────────
  categoryCreate: withBase('/v1/post/customer/admin/touch/content/category'),
  categoryUpdate: withBase('/v1/post/customer/admin/touch/content/category/update'),
  categoryUseYn: withBase('/v1/post/customer/admin/touch/content/category/useYn'),
  categoryGet: withBase('/v1/get/customer/admin/touch/content/category'),
  categoryList: withBase('/v1/get/customer/admin/touch/content/category/list'),
} as const;

export type NabCustomerTouchApiKey = keyof typeof NAB_CUSTOMER_TOUCH_API;
