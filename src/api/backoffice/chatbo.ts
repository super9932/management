/**
 * §06 백오피스 · 챗봇 — No.21~24
 */
import { fetcherWithParams, postFetcher } from '../fetcher';
import type {
  ConversationListResponse,
  MessageListResponse,
  SearchResponse,
  PurgeResult,
  ServiceType,
  TriggerType,
} from '../types';

// No.21 — 전체 대화 목록 조회
export interface GetConversationsParams {
  page?: number;
  limit?: number;
  fpId?: string;
  serviceType?: ServiceType;
  fromDate?: string;
  toDate?: string;
}

export const getConversations = (params?: GetConversationsParams) =>
  fetcherWithParams<ConversationListResponse>(
    '/bo/v1/chat/conversations',
    params ?? {}
  );

// No.22 — 전체 메시지 조회
export const getMessages = (conversationId: string) =>
  fetcherWithParams<MessageListResponse>(
    '/bo/v1/chat/conversations/session',
    { conversationId }
  );

// No.23 — 대화 메시지 키워드 검색
export interface SearchMessagesParams {
  keyword: string;
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
}

export const searchMessages = (params: SearchMessagesParams) =>
  fetcherWithParams<SearchResponse>(
    '/bo/v1/chat/conversations/search',
    params
  );

// No.24 — 대화이력 영구삭제 (HARD DELETE)
export interface PurgeParams {
  triggerType: TriggerType;
  dryRun?: boolean;
  batchSize?: number;
  olderThan?: string;
}

export const purgeConversations = (body: PurgeParams) =>
  postFetcher<PurgeResult>(
    '/bo/v1/post/admin/conversations/purge',
    body
  );
