import type { CategoryModel } from '../types';

/**
 * POST /v1/get/customer/admin/touch/content/category — 카테고리 단건 조회
 *
 * ⚠️ 스웨거 스키마 충돌: 요청이 프롬프트 단건조회와 `GetRequest`(id: number, "프롬프트ID")를
 * 공유한다. 응답이 cgryCode 기반인 점과 UseYnRequest를 근거로 cgryCode로 추론 — BE 확인 필요.
 */
export interface CategoryGetRequest {
  cgryCode: string;
}

export type CategoryGetResponse = CategoryModel;
