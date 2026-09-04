/** POST /v1/get/customer/admin/touch/message/prompt/categories — 프롬프트 카테고리·항목 목록 조회 */

/** 요청 body 없음 (등록/조회 화면 셀렉트박스 소스) */
export type PromptCategoriesRequest = void;

/** 항목 후보 한 건 — 현재 필드는 item 하나뿐이다 */
export interface PromptCategoryItemEntry {
  /** 항목 코드(2-depth). 시나리오 계열은 common|guideline|validation, 그 외는 선택값 라벨 */
  item: string;
}

export interface PromptCategoryItem {
  /** 카테고리 코드(1-depth) — general|content|situation|relationship|tone|message_style */
  code: string;
  /** 카테고리 표기 — 일반|콘텐츠|고객상황|고객과의관계|메시지톤|문자유형 */
  label: string;
  /** 시나리오 계열(일반/콘텐츠) 여부. true면 항목이 common|guideline|validation 코드다. */
  scenario: boolean;
  /**
   * 이 카테고리에서 등록 가능한 항목 전체(2-depth 셀렉트박스 소스).
   * 원소가 문자열이 아니라 `{ item: '...' }` 객체다 — 그대로 렌더하면 React 가 터진다.
   */
  items: PromptCategoryItemEntry[];
}

export interface PromptCategoriesResponse {
  /** 등록 가능한 카테고리 6종과 각각의 항목 후보 */
  categories: PromptCategoryItem[];
}
