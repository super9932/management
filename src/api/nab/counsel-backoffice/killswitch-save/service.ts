import axiosInstance from '../../../../utils/axios';
import { NAB_COUNSEL_BACKOFFICE_API } from '../../_lib/path';
import { withEmnb } from '../../_lib/headers';

import type { ApiResponse } from '../types';
import type { CounselKillSwitchSaveRequest, CounselKillSwitchSaveResponse } from './dto';

/** 상담AI 점검 Kill-Switch 를 저장한다(없으면 생성). N 으로 저장하면 즉시 점검모드가 된다. */
export const saveCounselKillSwitch = async (data: CounselKillSwitchSaveRequest, emnb: string) => {
  const url = NAB_COUNSEL_BACKOFFICE_API.killSwitchSave;
  const response = await axiosInstance.post<ApiResponse<CounselKillSwitchSaveResponse>>(url, withEmnb(data, emnb));
  return response.data;
};
