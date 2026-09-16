/** 고객터치AI 관리자 API MSW 핸들러 — src/mocks/handlers.ts에서 스프레드해 등록한다. */

import { statsMessageDailyHandlers } from './stats-message-daily/mock';
import { statsSearchDailyHandlers } from './stats-search-daily/mock';
import { statsMessageExcelHandlers } from './stats-message-excel/mock';
import { statsSearchExcelHandlers } from './stats-search-excel/mock';

import { promptCreateHandlers } from './prompt-create/mock';
import { promptUpdateHandlers } from './prompt-update/mock';
import { promptDeleteHandlers } from './prompt-delete/mock';
import { promptGetHandlers } from './prompt-get/mock';
import { promptListHandlers } from './prompt-list/mock';
import { promptCategoriesHandlers } from './prompt-categories/mock';

import { killSwitchSaveHandlers } from './killswitch-save/mock';
import { killSwitchDetailHandlers } from './killswitch-detail/mock';
import { killSwitchCheckHandlers } from './killswitch-check/mock';

export const customerTouchAdminHandlers = [

  ...statsMessageDailyHandlers,
  ...statsSearchDailyHandlers,
  ...statsMessageExcelHandlers,
  ...statsSearchExcelHandlers,

  ...promptCreateHandlers,
  ...promptUpdateHandlers,
  ...promptDeleteHandlers,
  ...promptGetHandlers,
  ...promptListHandlers,
  ...promptCategoriesHandlers,

  ...killSwitchSaveHandlers,
  ...killSwitchDetailHandlers,
  ...killSwitchCheckHandlers,
];
