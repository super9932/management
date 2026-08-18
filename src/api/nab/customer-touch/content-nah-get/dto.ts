import type { ContentStatus, KeywordPairItem, UseYn } from '../types';

/**
 * POST /v1/get/customer/admin/touch/content/nah — NAH 콘텐츠 단건 조회
 *
 * content_status 폴링 겸 색인 원문 확인용. 미존재는 404.
 *
 * ⚠️ 스웨거 스키마 충돌: 요청이 프롬프트 단건조회와 `GetRequest`(id: number, "프롬프트ID")를
 * 공유한다. 응답·등록/수정 요청이 모두 contentId(문자열) 기반이라 contentId로 추론 — BE 확인 필요.
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
