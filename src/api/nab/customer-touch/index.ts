/**
 * 고객터치AI 관리자 API (swagger: 01. 고객AI — 관리자 18종)
 *
 * 모든 API는 POST + JSON body. 경로에 /get/ 이 들어가도 HTTP 메서드는 POST다.
 * 통신은 src/utils/axios.ts의 axiosInstance를 사용하고, 각 service는 엔벨로프
 * 전체(ApiResponse<T>)를 그대로 반환한다.
 */
export * from '../_lib/path';
export * from './types';

// ── 통계 ────────────────────────────────────────────────────────────────────
export * from './stats-summary/dto';
export * from './stats-summary/service';
export * from './stats-messages/dto';
export * from './stats-messages/service';
export * from './stats-excel/dto';
export * from './stats-excel/service';
export * from './stats-aggregate/dto';
export * from './stats-aggregate/service';

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
export * from './prompt-duplicate/dto';
export * from './prompt-duplicate/service';

// ── Kill-Switch ─────────────────────────────────────────────────────────────
export * from './killswitch-save/dto';
export * from './killswitch-save/service';
export * from './killswitch-list/dto';
export * from './killswitch-list/service';
export * from './killswitch-detail/dto';
export * from './killswitch-detail/service';
export * from './killswitch-check/dto';
export * from './killswitch-check/service';

// ── NAH 콘텐츠 ───────────────────────────────────────────────────────────────
export * from './content-nah-get/dto';
export * from './content-nah-get/service';
export * from './content-nah-register/dto';
export * from './content-nah-register/service';
export * from './content-nah-update/dto';
export * from './content-nah-update/service';
