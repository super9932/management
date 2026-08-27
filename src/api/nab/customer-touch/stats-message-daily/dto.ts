import type {
  Pagination,
  StatsEntryPoint,
  StatsFpType,
  StatsGenerationMethod,
  StatsPageSize,
} from '../types';

/**
 * POST /v1/get/customer/admin/touch/stats/message/daily — AI 메시지 생성 통계 (일자별)
 *
 * 조회기간의 **모든 날짜**를 최신순으로 내려준다. 집계가 없는 날도 0 행으로 나가므로
 * pagination.totalElements 는 큐브 행 수가 아니라 **조회 기간의 일수**다.
 *
 * 오늘·미래, 그리고 03:00 이전의 어제는 전부 0 이다 — 집계 상한선이
 * `현재시각 >= 03:00 ? 어제 : 그저께` 이며 상한선을 넘는 날짜는 계산도 저장도 하지 않는다.
 * 상한선 이내의 미집계 날짜는 이 호출이 계산해 확정 저장하므로 첫 조회만 느리다.
 */
export interface StatsMessageDailyRequest {
  /** 조회 시작일(yyyy-MM-dd, 해당일 포함) */
  from: string;
  /** 조회 종료일(yyyy-MM-dd, 해당일 포함). from~to 최대 366일 */
  to: string;
  /** 메시지 생성 기준(진입점, 미지정 = ALL) */
  entryPoint?: StatsEntryPoint;
  /** 메시지 생성 유형(생성방식, 미지정 = ALL) */
  generationMethod?: StatsGenerationMethod;
  /** FP 유형(미지정 = ALL) */
  fpType?: StatsFpType;
  /**
   * 페이지 번호(1-base, 미지정 = 1).
   * 스웨거는 문자열로 선언돼 있으나 스테이징에서 숫자로 호출해 200을 확인했다.
   */
  pageNum?: number;
  /** 페이지 크기(미지정 = 10). 10/30/50/70/100 외 값은 400 */
  pageSize?: StatsPageSize;
}

/** 일자별 메시지 집계 한 행 */
export interface MessageStatsRow {
  /** 일자(yyyy-MM-dd) */
  statDate: string;
  /** 접속 FP수(UV) — 그날 생성 또는 발송을 한 FP 수(중복 제외) */
  fpUvCount: number;
  /** 메시지 생성 건수(최초 생성만) */
  generateCount: number;
  /** 메시지 수정 건수(재생성 포함) */
  modifyCount: number;
  /** 메시지 발송 건수(발송하기 버튼 클릭 수) */
  sendCount: number;
  /** 발송 고객 수(UV) — 그날 발송 대상이 된 고객 수(중복 제외) */
  sendCustomerUvCount: number;
}

/**
 * ⚠️ 스웨거 Example 은 `data` 가 행 배열이고 페이징이 엔벨로프 `page` 에 실리는 것처럼
 * 적혀 있으나, 실제 응답은 다른 목록 API 와 동일한 Page 래퍼다(스테이징 확인).
 * 엔벨로프의 `page` 는 null 이다.
 */
export interface StatsMessageDailyResponse {
  pagination: Pagination;
  list: MessageStatsRow[];
}
