import type { MsgeStatRequest } from '../stats-messages/dto';

/** POST /v1/get/counsel/admin/statistics/message/excel — 메시지통계엑셀다운로드 */

/** 목록 조회와 같은 필터를 쓴다 (page·size 는 서버가 무시하고 전건을 내려준다) */
export type MsgeStatExcelRequest = MsgeStatRequest;

/** 응답은 xlsx 바이너리(Blob) — 엔벨로프 없음 */
export type MsgeStatExcelResponse = Blob;
