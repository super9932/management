import type { CategoryModel, UseYn } from '../types';

/**
 * POST /v1/get/customer/admin/touch/content/category/list — 카테고리 목록 조회
 *
 * ⚠️ 스웨거상 요청이 프롬프트 목록과 `ListRequest`(categoryCode, useYn)를 공유한다.
 * 카테고리 목록에 categoryCode 필터는 의미가 없어 useYn만 노출 — BE 확인 필요.
 */
export interface CategoryListRequest {
  /** 사용여부 필터 (미지정 = 전체) */
  useYn?: UseYn;
}

export interface CategoryListResponse {
  categories: CategoryModel[];
}
