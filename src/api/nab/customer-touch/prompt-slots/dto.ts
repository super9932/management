import type { UseYn } from '../types';

/**
 * POST /v1/get/customer/admin/touch/message/prompt/slots — 프롬프트 슬롯 현황 조회
 *
 * 카탈로그 슬롯 29종이 각각 등록돼 있는지 훑는다. 미등록 슬롯은 그 슬롯을 쓰는
 * 생성 호출이 이미 503 이라는 뜻이라, FP 화면에서 터지기 전에 미리 드러내는 용도다.
 * registered=true 라도 useYn='N' 이면 주입되지 않아 결과는 미등록과 같다.
 */

/** 요청 body 없음 */
export type PromptSlotsRequest = void;

export interface PromptSlotItem {
  /** 카테고리 코드(1-depth) */
  category: string;
  /** 카테고리 표기 */
  categoryLabel: string;
  /** 항목 코드(2-depth) */
  item: string;
  /** 등록 여부 — false 면 이 슬롯을 쓰는 생성 호출이 503 이다 */
  registered: boolean;
  /** 등록돼 있을 때의 사용여부 (미등록이면 null) */
  useYn: UseYn | null;
  /** 등록돼 있을 때의 프롬프트ID (미등록이면 null) */
  promptId: number | null;
  /** 등록돼 있을 때의 프롬프트명 (미등록이면 null) */
  name: string | null;
}

export interface PromptSlotsResponse {
  /** 카탈로그 슬롯 29종 현황 (카테고리 선언 순서) */
  slots: PromptSlotItem[];
  /** 카탈로그 슬롯 총 개수 (항상 29) */
  totalCount: number;
  /** 그중 등록된 슬롯 수 */
  registeredCount: number;
  /** 미등록 슬롯 — 'category/item' 형태. 비어 있지 않으면 그 생성 경로가 503 이다 */
  missing: string[];
}
