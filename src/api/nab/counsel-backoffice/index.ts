/**
 * 상담AI 백오피스 API (swagger: 04. 상담AI_백오피스)
 *
 * 모든 API는 POST + JSON body. 경로에 /get/ 이 들어가도 HTTP 메서드는 POST다.
 * 통신은 src/utils/axios.ts의 axiosInstance를 사용하고, 각 service는 엔벨로프
 * 전체(ApiResponse<T>)를 그대로 반환한다.
 */
export * from '../_lib/path';
export * from './types';

// ── 통계 ────────────────────────────────────────────────────────────────────
export * from './stats-messages/dto';
export * from './stats-messages/service';
export * from './stats-excel/dto';
export * from './stats-excel/service';

// ── 매뉴얼 ───────────────────────────────────────────────────────────────────
export * from './manual-list/dto';
export * from './manual-list/service';
export * from './manual-detail/dto';
export * from './manual-detail/service';
export * from './manual-history/dto';
export * from './manual-history/service';
export * from './manual-save/dto';
export * from './manual-save/service';
export * from './manual-update/dto';
export * from './manual-update/service';
export * from './manual-delete/dto';
export * from './manual-delete/service';
export * from './manual-init-load/dto';
export * from './manual-init-load/service';
export * from './manual-resend/dto';
export * from './manual-resend/service';

// ── 약관 ────────────────────────────────────────────────────────────────────
export * from './stipulation-list/dto';
export * from './stipulation-list/service';
export * from './stipulation-detail/dto';
export * from './stipulation-detail/service';
export * from './stipulation-save/dto';
export * from './stipulation-save/service';
export * from './stipulation-delete/dto';
export * from './stipulation-delete/service';
export * from './stipulation-init-load/dto';
export * from './stipulation-init-load/service';
export * from './stipulation-resend/dto';
export * from './stipulation-resend/service';

// ── 점검 Kill-Switch ────────────────────────────────────────────────────────
export * from './killswitch-list/dto';
export * from './killswitch-list/service';
export * from './killswitch-detail/dto';
export * from './killswitch-detail/service';
export * from './killswitch-save/dto';
export * from './killswitch-save/service';
