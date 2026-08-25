import type { ContentWriteResult, KeywordPairItem, UseYn } from '../types';

/**
 * POST /v1/post/customer/admin/touch/content/nah/update — NAH 콘텐츠 수정
 *
 * 부분 수정 — 보낸 필드만 반영된다. description에 영향을 주는 필드가 바뀌면
 * 비동기 재생성이 돈다(updating → updated). 미존재 콘텐츠는 404.
 */
export interface ContentNahUpdateRequest {
  /** 수정 대상 콘텐츠ID */
  contentId: string;
  /** URL-encoded HTML 본문 */
  htmlData?: string;
  title?: string;
  subtitle?: string;
  displayTitle?: string;
  /** 직접 지정 시 NAH LLM 재생성 생략 */
  description?: string;
  divisionCode?: string;
  categoryKindId?: number;
  categoryKind?: string;
  categoryKindDetailId?: number;
  categoryKindDetail?: string;
  /** 키워드 쌍(전체 교체) */
  keywordPairs?: KeywordPairItem[];
  representativeImageFileId?: number;
  representativeImageFileNm?: string;
  publishStart?: string;
  publishEnd?: string;
  useYn?: UseYn;
  /** 삭제여부 */
  dltnYn?: UseYn;
  /** 전송여부 */
  trnmYn?: UseYn;
  clickCount?: number;
  shareCount?: number;
  lastChangeDttm?: string;
  lastReadDttm?: string;
}

export type ContentNahUpdateResponse = ContentWriteResult;
