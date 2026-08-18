import type { ContentWriteResult, KeywordPairItem, UseYn } from '../types';

/**
 * POST /v1/post/customer/admin/touch/content/nah — NAH 콘텐츠 등록
 *
 * 메타 전체 필드를 전달하면 NAH가 description을 비동기 생성한다(processing → created).
 * 중복 contentId는 409.
 */
export interface ContentNahRegisterRequest {
  /** 콘텐츠ID (COS cuosCntsId 문자열) */
  contentId: string;
  /** URL-encoded HTML 본문 */
  htmlData?: string;
  title?: string;
  subtitle?: string;
  displayTitle?: string;
  /** 직접 지정 시 NAH LLM 생성 생략 */
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

export type ContentNahRegisterResponse = ContentWriteResult;
