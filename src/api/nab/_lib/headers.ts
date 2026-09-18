/**
 * NAB API 공통 요청 조각.
 *
 * 인증 키(x-api-header)는 axios 인터셉터가 모든 요청에 붙인다.
 *
 * 작업자 사번은 한때 x-api-emnb 커스텀 헤더로 보냈으나, 서버 앞단 중간 레이어가
 * 그 헤더를 CORS 프리플라이트에서 차단해 **요청 본문 필드(emnb)로 옮겨졌다**
 * (스웨거: "커스텀 헤더(x-api-emnb)는 FE 와 서버 사이 중간 레이어가 차단하므로
 * 요청 본문으로 받는다"). 지금은 헤더를 보내도 무시되고 본문 emnb 만 인정한다.
 */

/** 쓰기 요청 본문에 작업자 사번을 얹는다 */
export const withEmnb = <T extends object>(data: T, emnb: string): T & { emnb: string } => ({
  ...data,
  emnb,
});

/**
 * 멀티파트 meta 파트의 파일명.
 *
 * FormData 에 Blob 을 파일명 없이 넣으면 브라우저가 `filename="blob"` 으로 내보낸다.
 * 서버 앞단 중간 레이어가 그 파트를 파일로 인정하지 않고 떨어뜨려 Spring 이
 * "필수 파트가 없습니다 : meta" 로 400 을 되돌리는 사례가 있었다.
 * 확장자가 있는 파일명을 직접 지정해 curl `-F meta=@meta.json` 과 같은 모양으로 맞춘다.
 */
export const META_PART_FILENAME = 'meta.json';
