import {
  DOCUMENT_ACCEPT,
  MAX_ATTACHMENT_SIZE_MB,
  RESTRICTED_WORK_HOUR_END,
  RESTRICTED_WORK_HOUR_START,
} from '../constant';

/**
 * 문서 등록 첨부 공통 규칙 (Figma COM_공통정의_006).
 * 약관 등록·매뉴얼 등록·문서 상세가 함께 쓴다.
 */

/** 첨부 가능한 최대 용량(byte) */
export const MAX_ATTACHMENT_SIZE = MAX_ATTACHMENT_SIZE_MB * 1024 * 1024;

/** 매뉴얼 등록에서 허용하는 확장자 목록 ('.pdf' 형태) */
export const ACCEPTED_EXTENSIONS = DOCUMENT_ACCEPT.split(',').map((ext) => ext.trim().toLowerCase());

/** 파일명이 허용 확장자 중 하나로 끝나는지 */
export const hasAcceptedExtension = (fileName: string, extensions = ACCEPTED_EXTENSIONS): boolean =>
  extensions.some((ext) => fileName.toLowerCase().endsWith(ext));

/**
 * 화면 일자·일시를 API 일시(yyyy-MM-dd HH:mm:ss)로 바꾼다.
 * 화면 일자는 'YYYY.MM.DD' 또는 'YYYY/MM/DD' 로 들어온다.
 * 종료일시 24:00 은 그 날의 끝을 뜻하므로 23:59:59 로 보낸다.
 */
export const toApiDateTime = (date: string, time: string): string => {
  const day = date.trim().replace(/[./]/g, '-');
  const clock = time === '24:00' ? '23:59:59' : `${time}:00`;

  return `${day} ${clock}`;
};

/** 확장자를 뺀 파일명 — 약관은 PDF·CSV 이름이 같아야 한다 */
export const toBaseName = (fileName: string): string => fileName.replace(/\.[^.]+$/, '').trim();

/**
 * 서버 시간 기준 작업 제한 시간(23:00~24:00)인지.
 * 이 구간에는 문서 등록·저장·삭제를 막고 안내 모달을 띄운다.
 */
export const isRestrictedWorkTime = (): boolean => {
  const hour = new Date().getHours();

  return hour >= RESTRICTED_WORK_HOUR_START && hour < RESTRICTED_WORK_HOUR_END;
};

/** 첨부 검사 결과 — 통과분과 위반 사유를 함께 돌려준다 */
export interface AttachmentCheck {
  /** 확장자·용량을 모두 통과한 파일 */
  accepted: File[];
  /** 지원하지 않는 확장자가 하나라도 있었는지 */
  hasInvalidExtension: boolean;
  /** 최대 용량을 넘긴 파일이 하나라도 있었는지 */
  hasOversize: boolean;
}

/** 첨부 파일을 확장자·용량 기준으로 걸러낸다 (위반 파일은 제외하고 통과분만 담는다) */
export const checkAttachments = (
  files: File[],
  extensions = ACCEPTED_EXTENSIONS,
): AttachmentCheck => {
  const accepted: File[] = [];
  let hasInvalidExtension = false;
  let hasOversize = false;

  files.forEach((file) => {
    if (!hasAcceptedExtension(file.name, extensions)) {
      hasInvalidExtension = true;
      return;
    }
    if (file.size > MAX_ATTACHMENT_SIZE) {
      hasOversize = true;
      return;
    }
    accepted.push(file);
  });

  return { accepted, hasInvalidExtension, hasOversize };
};
