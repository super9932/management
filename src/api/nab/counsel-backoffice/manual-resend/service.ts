import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';
import { withEmnb } from '../../_lib/headers';

import type { ApiResponse } from '../types';
import type { ManualResendRequest, ManualResendResponse } from './dto';

/**
 * 전처리가 끝나지 않았거나 실패한 매뉴얼문서를 AI BE 전송 큐에 다시 넣는다.
 *
 * @param emnb 요청자 사번 — 요청 본문 emnb 필드로 보낸다(필수)
 */
export const resendManuals = async (data: ManualResendRequest, emnb: string) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.manualResend;
  const response = await axiosInstance.post<ApiResponse<ManualResendResponse>>(
    url,
    withEmnb(data, emnb),
  );
  return response.data;
};
