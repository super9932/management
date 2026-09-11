import type { AdminTypeCode, ManualClassCode, PageRequest, RegisteredDateRange } from '../types';

/** POST /v1/get/counsel/admin/statistics/message/list — 메시지통계목록조회 */

export interface MsgeStatRequest extends PageRequest, RegisteredDateRange {
  /**
   * 조회 시작 일시 (yyyy-MM-dd 또는 yyyy-MM-dd HH:mm).
   * 시각을 생략하면 해당일 00:00. 미입력이면 서버가 최근 30일을 적용한다
   */
  rgstDttmFrom?: string;
  /**
   * 조회 종료 일시 (yyyy-MM-dd 또는 yyyy-MM-dd HH:mm).
   * 시각을 생략하면 해당일 23:59:59. 미입력이면 오늘
   */
  rgstDttmTo?: string;
  /** 페이지 크기. 화면 옵션 10/30/50/70/100, 최대 100. 미입력이면 10 */
  size?: number;
}

/** 답변이 참조한 매뉴얼 문서 1건 — 문서를 찾을 수 없으면 각 필드가 null 이다 */
export interface MsgeStatManlDoc {
  /** 매뉴얼문서ID */
  nabCuslManlDcmtId: number;
  /** 관리주체(담당부서) — UDW 언더라이팅 / ISRN_ADT 보험심사 / ISRN_SVC 보험공통 */
  nabCuslAdmrTypeCode: AdminTypeCode | null;
  /** 매뉴얼 분류. 분류 도입 이전 등록분이면 null */
  manlClsfCode: ManualClassCode | null;
  /** 매뉴얼명 */
  manlNm: string | null;
  /** 임시 다운로드 URL — 조회 시점 발급이라 만료가 있다. 저장해 두고 재사용하지 않는다 */
  downloadUrl: string | null;
}

/** 질문-답변 한 턴. 사용자가 중지한 턴은 답변 계열 값이 모두 null 이다 */
export interface MsgeStatItem {
  /** 질문 전송 일시. 중지 턴도 이 기준이다 */
  rgstDttm: string;
  /** 사용자 사번 */
  fpUniqNo: string;
  // 조직 4단계 — 스웨거에는 필수로 적혀 있으나 실제 응답에는 null 이 온다 (본사 소속 등 하위 조직이 없는 경우)
  /** 사업본부 */
  lvl1OrgnNm: string | null;
  /** 권역 */
  lvl2OrgnNm: string | null;
  /** 지역단 */
  lvl3OrgnNm: string | null;
  /** 지점 */
  lvl4OrgnNm: string | null;
  /** 대화방ID */
  convRoomId: string;
  /** 화면 구분 (01 타겟고객발굴 / 02 고객계약관리 / 03 신계약상담). 표시명 변환은 FE 공통코드가 한다 */
  cuslSrvcTypeCode: string;
  /** 추천질문ID — 방 단위 값이라 같은 방의 모든 턴에 같은 값이 온다. 질문 없이 시작한 방은 null */
  rcmdQustId: number | null;
  /** 질문 내용 (마스킹본) */
  qustCntn: string;
  /** 답변 내용 (마스킹본). 중지 턴은 null */
  answCntn: string | null;
  /** 생성 모델명. 중지 턴은 null */
  llmNm: string | null;
  /** 소요시간(초). 중지 턴은 null */
  rqrdTime: number | null;
  /** 발생 비용(USD). 중지 턴은 null */
  costUsd: number | null;
  /** 피드백 선호 여부. 피드백이 없으면 null */
  fdbkLikeYn: 'Y' | 'N' | null;
  /** 피드백 사유 (마스킹본). 없으면 null */
  fdbkCmmt: string | null;
  /** 답변이 참조한 매뉴얼 문서 목록. 중지 턴이거나 참조가 없으면 빈 배열 */
  manlDocList: MsgeStatManlDoc[];
}

export interface MsgeStatResponse {
  /** 메시지 통계 목록. 없으면 빈 배열(오류 아님) */
  msgeStatList: MsgeStatItem[];
}
