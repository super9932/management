import type { ContentStatus, KeywordPairItem, UseYn } from '../types';

/**
 * POST /v1/get/customer/admin/touch/content/nah — NAH 콘텐츠 단건 조회
 *
 * contentStatus 폴링 겸 색인 원문 확인용. 미존재는 404.
 */
export interface ContentNahGetRequest {
  /** 콘텐츠ID (COS cuosCntsId 문자열) */
  contentId: string;
}

export interface ContentNahGetResponse {
  contentId: string;
  title: string;
  subtitle: string;
  displayTitle: string;
  description: string;
  /** 색인 상태 — processing|created|updating|updated */
  contentStatus: ContentStatus;
  categoryKind: string;
  categoryKindDetail: string;
  keywordPairs: KeywordPairItem[];
  bodyText: string;
  imageUrls: string[];
  ocrText: string;
  publishStart: string;
  publishEnd: string;
  useYn: UseYn;
}
