/** POST /v1/get/customer/admin/touch/message/prompt/types — 프롬프트 유형 목록 조회 */

/** 요청 body 없음 (등록 화면 셀렉트박스 소스) */
export type PromptTypesRequest = void;

export interface PromptTypeItem {
  /** 유형 코드 */
  code: string;
  /** 카테고리가 시나리오 네임스페이스('일반'|'콘텐츠')인지 여부. false면 카테고리가 곧 선택값 라벨. */
  namespaced: boolean;
}

export interface PromptTypesResponse {
  /** 등록 가능한 유형 전체 */
  types: PromptTypeItem[];
  /** 네임스페이스 유형이 쓰는 카테고리 후보 */
  namespaceCategories: string[];
}
