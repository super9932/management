/**
 * 로그인 사용자 컨텍스트.
 *
 * ⚠️ 이 파일은 **이식 대상 프로젝트의 동명 훅으로 대체될 자리표시자**다.
 * 그쪽에는 실제 인증 컨텍스트를 읽는 `src/auth/hooks` 가 이미 있으므로,
 * 반입할 때는 이 폴더(src/auth)를 지우기만 하면 호출부는 그대로 동작한다.
 *
 * 이 저장소에는 로그인 절차가 없어(인증은 API 키로 처리) 사번을 고정값으로 돌려준다.
 */

export interface AuthUser {
  /** 사번 — 등록·수정·삭제 API 의 요청 본문 emnb 필드에 실린다 */
  emnb: string;
}

/** 개발용 고정 사번 — 이식 대상에서는 실제 로그인 사용자로 대체된다 */
const MOCK_USER: AuthUser = { emnb: '2190099' };

export function useAuthContext(): { user: AuthUser | null } {
  return { user: MOCK_USER };
}
