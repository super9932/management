import type { ContentWriteResult } from '../types';

import type { ContentNahRegisterRequest } from '../content-nah-register/dto';

/**
 * POST /v1/post/customer/admin/touch/content/nah/update — NAH 콘텐츠 수정
 *
 * 부분 수정 — description에 영향을 주는 필드가 바뀌면 비동기 재생성(updating → updated).
 *
 * ⚠️ 스웨거 스키마 충돌: 요청이 프롬프트 수정과 `UpdateRequest`(id/name/type/content/…) 이름을
 * 공유해 프롬프트 필드로 덮어써져 있다. 응답(WriteResult)과 "부분 수정" 설명을 근거로
 * 등록 요청의 부분 집합으로 추론 — BE 확인 필요.
 */
export type ContentNahUpdateRequest = Partial<Omit<ContentNahRegisterRequest, 'contentId'>> & {
  /** 수정 대상 콘텐츠ID */
  contentId: string;
};

export type ContentNahUpdateResponse = ContentWriteResult;
