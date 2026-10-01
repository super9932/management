/** POST /v1/post/counsel/admin/stipulation/file/upload/save — 약관문서등록 (multipart/form-data) */

/** meta 파트(필수) — 요청자(변경자) 사번만 담는다. service 가 withEmnb 로 채운다 */
export interface StipulationUploadMeta {
  /** 요청자(변경자) 사번 (필수) */
  emnb: string;
}

export interface StipulationSaveRequest {
  /** 약관 PDF 파일 (Storage 보관용) */
  pdfFile?: File;
  /** 특약 CSV 파일 (AI BE 전송 대상) */
  csvFile?: File;
}

export interface StipulationSaveResponse {
  /** 생성된 약관문서ID */
  nabCuslIsrnStplDcmtId: number;
  /** 처리상태. 등록 직후는 항상 PENDING 이며 완료·오류 확정은 AI BE 콜백이 담당한다 */
  status: 'PENDING';
}
