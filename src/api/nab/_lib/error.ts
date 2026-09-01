import axios from 'axios';

import type { ApiResponse } from '../customer-touch/types';

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

/** 서버가 내려준 메시지 → Error.message → fallback 순으로 고른다 */
export const toApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiResponse<unknown> | undefined;
    const message = payload?.error?.message ?? payload?.message;

    if (message) {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
