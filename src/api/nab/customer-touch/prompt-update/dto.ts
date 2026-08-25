import type { MutationResponse, UseYn } from '../types';

/**
 * POST /v1/post/customer/admin/touch/message/prompt/update — 프롬프트 수정
 *
 * 부분 수정이 아니라 **전량 교체**다. 등록(CreateRequest)과 같은 형상에 id가 추가된 형태이며,
 * 보내지 않은 필드는 "그대로 두기"가 아니라 필수값 누락(400)이 된다.
 * 슬롯 키(category/item)도 바꿀 수 있지만 옮겨 간 자리에 이미 슬롯이 있으면 409다.
 * 수정자 사번은 바디로 받지 않고 토큰(subject)에서 채운다.
 *
 * ⚠️ 스웨거 스키마 충돌: 요청 스키마가 NAH 콘텐츠 수정과 `UpdateRequest` 이름을 공유해
 * Schema 탭에는 NAH 필드(contentId/htmlData/…)로 표시된다. 실제 본문은 아래 형상이며
 * 해당 엔드포인트의 Examples가 이를 따른다.
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
  /** 사용여부(미지정 = Y). N이면 행은 남고 생성 주입만 멈춘다 — 삭제(DEL_YN)와는 별개 축. */
  useYn?: UseYn;
}

/** id = 수정된 프롬프트ID */
export type PromptUpdateResponse = MutationResponse;
