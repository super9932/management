import type { MutationResponse, UseYn } from '../types';

/**
 * POST /v1/post/customer/admin/touch/message/prompt/update — 프롬프트 수정
 *
 * 부분 수정이 아니라 **전량 교체**다. 등록(CreateRequest)과 같은 형상에 id가 추가된 형태이며,
 * 보내지 않은 필드는 "그대로 두기"가 아니라 필수값 누락(400)이 된다.
 * 슬롯 키(category/item)도 바꿀 수 있지만 옮겨 간 자리에 이미 슬롯이 있으면 409다.
 * 저장 즉시 다음 생성 호출부터 반영된다.
 *
 * 요청자(변경자) 사번 `emnb` 는 스웨거상 필수 본문 필드지만 이 타입에는 두지 않는다 —
 * service(updatePrompt)가 두 번째 인자로 받아 withEmnb 로 본문에 얹는다.
 */
export interface PromptUpdateRequest {
  /** 프롬프트ID */
  id: number;
  /** 프롬프트명 */
  name: string;
  /** 카테고리(1-depth) */
  category: string;
  /** 항목(2-depth) */
  item: string;
  /** 프롬프트 본문 */
  content: string;
  /**
   * 사용여부(미지정 = Y). N이면 행은 남고 생성 주입만 멈춘다 — 삭제(DEL_YN)와는 별개 축.
   * 필수 슬롯을 N 으로 끄면 그 생성 경로는 503 이 된다.
   */
  useYn?: UseYn;
}

/** id = 수정된 프롬프트ID */
export type PromptUpdateResponse = MutationResponse;
