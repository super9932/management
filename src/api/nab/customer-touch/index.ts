/**
 * 고객터치AI 관리자 API (swagger: 01. 고객AI — 관리자 24종)
 *
 * 모든 API는 POST + JSON body. 경로에 /get/ 이 들어가도 HTTP 메서드는 POST다.
 * 통신은 src/utils/axios.ts의 axiosInstance를 사용하고, 각 service는 엔벨로프
 * 전체(ApiResponse<T>)를 그대로 반환한다.
 */
export * from '../_lib/path';
export * from './types';

// ── 통계 ────────────────────────────────────────────────────────────────────

// ── 서비스통계(일자별 큐브) ──────────────────────────────────────────────────
export * from './stats-message-daily/dto';
export * from './stats-message-daily/service';
export * from './stats-search-daily/dto';
export * from './stats-search-daily/service';
export * from './stats-message-excel/dto';
export * from './stats-message-excel/service';
export * from './stats-search-excel/dto';
export * from './stats-search-excel/service';

// ── 프롬프트 ─────────────────────────────────────────────────────────────────
export * from './prompt-create/dto';
export * from './prompt-create/service';
export * from './prompt-update/dto';
export * from './prompt-update/service';
export * from './prompt-delete/dto';
export * from './prompt-delete/service';
export * from './prompt-get/dto';
export * from './prompt-get/service';
export * from './prompt-list/dto';
export * from './prompt-list/service';
export * from './prompt-categories/dto';
export * from './prompt-categories/service';

// ── Kill-Switch ─────────────────────────────────────────────────────────────
export * from './killswitch-save/dto';
export * from './killswitch-save/service';
export * from './killswitch-detail/dto';
export * from './killswitch-detail/service';
export * from './killswitch-check/dto';
export * from './killswitch-check/service';

// ── NAH 콘텐츠 ───────────────────────────────────────────────────────────────
