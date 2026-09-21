import type { PageRequest } from '../types';

/** POST /v1/get/counsel/admin/manual/history/list — 매뉴얼문서수정이력목록조회 */

/**
 * 변경된 속성. 원천 컬럼ID를 그대로 내려주며 화면 라벨 매핑은 FE 가 한다.
 *
 * 분류 컬럼ID 는 한때 스웨거만 MANL_CLSF_CODE 였고 실제 응답은 NAB_ 접두어가 붙었다.
 * 지금은 스웨거도 NAB_MANL_CLSF_CODE 로 맞춰졌지만, 되돌아가도 깨지지 않게 둘 다 받는다.
 */
export type ManualHistoryColumnId =
  | 'VALD_STAR_DTTM'
  | 'VALD_END_DTTM'
  | 'NAB_MANL_CLSF_CODE'
  | 'MANL_CLSF_CODE';

export interface ManualHistoryRequest extends PageRequest {
  nabCuslManlDcmtId: number;
}

export interface ManualHistoryItem {
  /** 변경된 속성 */
  chngClmnId: ManualHistoryColumnId;
  /** 변경 전 값. 유효종료일시를 지정하지 않았던 경우 null */
  chngBefoVal: string | null;
  /** 변경 후 값. 유효종료일시를 지우고 무기한으로 바꾼 경우 null */
  chngAftrVal: string | null;
  /** 수정자 소속기관명 */
  rgstOrgnNm: string;
  /** 수정자명 */
  rgsrNm: string;
  /** 수정자 사번 — 화면은 '이름(사번)' 으로 표기한다 */
  chnrEmnb: string;
  /** 적용일시 (KST). 관리자 수정은 즉시 적용이라 등록일시와 같다 */
  aplyDttm: string;
}

export interface ManualHistoryResponse {
  /** 수정이력 목록(최신순). 수정한 적이 없거나 문서가 없으면 빈 배열(정상 응답) */
  historyList: ManualHistoryItem[];
}
