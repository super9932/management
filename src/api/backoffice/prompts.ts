/**
 * §10 백오피스 · 프롬프트 — No.41~42
 */
import { fetcher, postFetcher } from '../fetcher';
import type { PromptType, PromptUpsertResult } from '../types';

// No.41 — 프롬프트 유형 조회 (active 버전 포함)
export const getPromptTypes = () =>
  fetcher<PromptType[]>('/bo/v1/get/admin/prompts/types');

// No.42 — 프롬프트 등록/수정 (versioning + AI BE 동기화)
export interface UpsertPromptBody {
  typeCode: string;
  body: string;
  changeNote?: string;
  effectiveFrom?: string;
}

export const upsertPrompt = (body: UpsertPromptBody) =>
  postFetcher<PromptUpsertResult>(
    '/bo/v1/post/admin/prompts',
    body
  );
