import type { StipulationStatus } from '../types';

/** POST /v1/get/counsel/admin/stipulation/detail — 약관문서상세조회 */

export interface StipulationDetailRequest {
  /** 조회할 약관문서ID */
  nabCuslIsrnStplDcmtId: number;
}

export interface StipulationDetailResponse {
  nabCuslIsrnStplDcmtId: number;
  /** 약관PDF파일명 */
  pdfDcmtFileNm: string;
  /** NCP 에서 발급한 약관PDF 다운로드 URL (만료형) */
  pdfDcmtUrlPathNm: string;
  /** 약관CSV파일명 */
  csvDcmtFileNm: string;
  /** NCP 에서 발급한 약관CSV 다운로드 URL (만료형) */
  csvDcmtUrlPathNm: string;
  /** 보종세목코드 목록. 전처리 전이면 빈 배열 */
  isrnKindCodeList: string[];
  /** 판매시작일 */
  saleStarDate: string | null;
  /** 판매종료일 */
  saleEndDate: string | null;
  status: StipulationStatus;
  /** 등록기관명 */
  rgstOrgnNm: string;
  /** 등록자명 */
  rgsrNm: string;
  /** 등록자사원번호 */
  rgsrEmnb: string;
  /** 등록일시 (KST) */
  rgstDttm: string;
}
