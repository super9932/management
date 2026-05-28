/**
 * §09 백오피스 · 통계 — No.36~40
 */
import { fetcher, fetcherWithParams } from '../fetcher';
import type {
  UserStats,
  QueryStats,
  FeedbackStats,
  FeedbackDetail,
  TokenStats,
} from '../types';

interface DateRange {
  from?: string;
  to?: string;
}

// No.36 — 사용자 통계 (DAU/MAU/평균 사용 시간)
export const getUserStats = (params?: DateRange) =>
  fetcherWithParams<UserStats>(
    '/bo/v1/get/admin/stats/users',
    params ?? {}
  );

// No.37 — 질의 통계 (카테고리별·되묻기율·응답시간)
export const getQueryStats = (params?: DateRange) =>
  fetcherWithParams<QueryStats>(
    '/bo/v1/get/admin/stats/queries',
    params ?? {}
  );

// No.38 — 피드백 집계 + 최근 7일 5건
export const getFeedbackStats = (params?: DateRange) =>
  fetcherWithParams<FeedbackStats>(
    '/bo/v1/get/admin/stats/feedback',
    params ?? {}
  );

// No.39 — 피드백 상세 (낱건)
export const getFeedbackDetail = (params: { feedbackId?: number; messageId?: string }) =>
  fetcherWithParams<FeedbackDetail>(
    '/bo/v1/get/admin/feedback',
    params
  );

// No.40 — 토큰 사용량 (월/일 누적·평균 비용·예산)
export const getTokenStats = () =>
  fetcher<TokenStats>('/bo/v1/get/admin/stats/tokens');
