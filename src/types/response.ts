/** 서버 공통 응답 엔벨로프 */
export interface NextLabResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
}
