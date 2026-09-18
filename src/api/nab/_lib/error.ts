import axios from 'axios';

import type { ApiError, ApiResponse } from '../customer-touch/types';

/**
 * 요청 실패에서 화면에 쓸 정보를 꺼낸다.
 *
 * 서버는 4xx·5xx 에도 공통 엔벨로프(error.message)를 실어 보내지만, axios 는 상태코드로
 * 먼저 reject 하므로 service 안의 `response.error` 검사까지 가지 못한다. 그대로 두면
 * 'Request failed with status code 409' 같은 axios 기본 문구만 남는다.
 */

/** 실패 응답의 HTTP 상태코드. 네트워크 오류 등 응답이 없으면 undefined */
export const apiErrorStatus = (error: unknown): number | undefined =>
  axios.isAxiosError(error) ? error.response?.status : undefined;

/**
 * 검증 실패 상세를 한 줄로 붙인다.
 * VALIDATION_FAILED 의 error.message 는 늘 같은 공통 문구라 details 가 없으면 원인을 알 수 없다.
 */
export const toApiErrorDetailText = (error: ApiError | undefined): string => {
  const details = error?.details ?? [];
  const parts = details
    .map((detail) => (detail?.field ? `${detail.field}: ${detail.message ?? ''}` : detail?.message))
    .filter((part): part is string => Boolean(part));

  return parts.join(', ');
};

/** 공통 엔벨로프(200 응답에도 실린다)에서 화면에 쓸 메시지를 만든다 */
export const toApiResponseErrorMessage = (
  error: ApiError | undefined,
  fallback: string,
): string => {
  const detailText = toApiErrorDetailText(error);
  const message = error?.message ?? fallback;

  return detailText ? `${message} (${detailText})` : message;
};

/** 서버가 내려준 메시지 → Error.message → fallback 순으로 고른다 */
export const toApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiResponse<unknown> | undefined;

    if (payload?.error) {
      return toApiResponseErrorMessage(payload.error, payload.message ?? fallback);
    }

    if (payload?.message) {
      return payload.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
