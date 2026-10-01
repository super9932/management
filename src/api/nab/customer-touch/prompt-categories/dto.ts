/** POST /v1/get/customer/admin/touch/message/prompt/categories — 프롬프트 카테고리·항목 목록 조회 */

/**
 * 요청 body 없음 (등록/조회 화면 셀렉트박스 소스).
 * 중계 레이어가 본문 없는 POST 를 거부하므로 service 가 항상 빈 객체 {} 를 보낸다.
 */
export type PromptCategoriesRequest = void;

/** 항목 후보 한 건 */
export interface PromptCategoryItemEntry {
  /**
   * 항목 후보(2-depth 셀렉트박스 값) — 등록/조회 요청에 쓰는 코드.
   * 시나리오 계열은 common|guideline|validation, 그 외는 선택값 라벨
   */
  item: string;
  /**
   * 항목 표기명 — 화면 표시용. 고객상황은 코드와 다를 수 있다(상속인미지정 → 보험금수령인 미지정),
   * 그 외는 코드와 동일. 스웨거 Example 상 고객상황 외 카테고리에서는 생략된다.
   */
  itemLabel?: string;
}

export interface PromptCategoryItem {
  /** 카테고리 코드(1-depth) — general|content|situation|relationship|tone|message_style */
  code: string;
  /** 카테고리 표기 — 일반|콘텐츠|고객상황|고객과의관계|메시지톤|문자유형 */
  label: string;
  /** 시나리오 계열(일반/콘텐츠)인지 여부. true 면 항목이 common|guideline|validation 이다. */
  scenario: boolean;
  /**
   * 이 카테고리에서 등록 가능한 항목 전체(2-depth 셀렉트박스 소스).
   * 원소가 문자열이 아니라 `{ item, itemLabel? }` 객체다 — 그대로 렌더하면 React 가 터진다.
   */
  items: PromptCategoryItemEntry[];
}

export interface PromptCategoriesResponse {
  /** 등록 가능한 카테고리 6종과 각각의 항목 후보 */
  categories: PromptCategoryItem[];
}
