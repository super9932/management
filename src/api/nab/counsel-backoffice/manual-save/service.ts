import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';
import { META_PART_FILENAME, withEmnb } from '../../_lib/headers';

import type { ApiResponse } from '../types';
import type { ManualSaveRequest, ManualSaveResponse } from './dto';

/**
 * 매뉴얼문서를 등록한다 (multipart/form-data).
 *
 * meta 는 JSON 파트라 Blob 으로 감싸 Content-Type 을 붙여야 서버가 객체로 역직렬화한다.
 * Content-Type 헤더는 boundary 를 브라우저가 채우도록 지정하지 않는다.
 */
export const saveManual = async ({ file, meta }: ManualSaveRequest, emnb: string) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.manualSave;

  const formData = new FormData();
  if (file) formData.append('file', file);
  // 사번도 meta 파트 안에 들어간다 (별도 폼 필드가 아니다)
  const metaWithEmnb = withEmnb(meta, emnb);
  formData.append(
    'meta',
    new Blob([JSON.stringify(metaWithEmnb)], { type: 'application/json' }),
    META_PART_FILENAME,
  );

  const response = await axiosInstance.post<ApiResponse<ManualSaveResponse>>(url, formData, {
    // axiosInstance 기본 헤더가 application/json 이라 그대로 두면 boundary 가 빠져 서버가 파싱하지 못한다.
    // undefined 로 지워 브라우저가 multipart/form-data; boundary=... 를 직접 채우게 한다.
    headers: { 'Content-Type': undefined },
  });
  return response.data;
};
