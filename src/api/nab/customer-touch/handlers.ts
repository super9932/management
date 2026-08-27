/** 고객터치AI 관리자 API MSW 핸들러 — src/mocks/handlers.ts에서 스프레드해 등록한다. */
import { statsSummaryHandlers } from './stats-summary/mock';
import { statsMessagesHandlers } from './stats-messages/mock';
import { statsExcelHandlers } from './stats-excel/mock';
import { statsAggregateHandlers } from './stats-aggregate/mock';

import { statsMessageDailyHandlers } from './stats-message-daily/mock';
import { statsSearchDailyHandlers } from './stats-search-daily/mock';
import { statsMessageExcelHandlers } from './stats-message-excel/mock';
import { statsSearchExcelHandlers } from './stats-search-excel/mock';
import { statsRecomputeHandlers } from './stats-recompute/mock';

import { promptCreateHandlers } from './prompt-create/mock';
import { promptUpdateHandlers } from './prompt-update/mock';
import { promptDeleteHandlers } from './prompt-delete/mock';
import { promptGetHandlers } from './prompt-get/mock';
import { promptListHandlers } from './prompt-list/mock';
import { promptCategoriesHandlers } from './prompt-categories/mock';
import { promptSlotsHandlers } from './prompt-slots/mock';
import { promptDuplicateHandlers } from './prompt-duplicate/mock';

import { killSwitchSaveHandlers } from './killswitch-save/mock';
import { killSwitchListHandlers } from './killswitch-list/mock';
import { killSwitchDetailHandlers } from './killswitch-detail/mock';
import { killSwitchCheckHandlers } from './killswitch-check/mock';

import { contentNahGetHandlers } from './content-nah-get/mock';
import { contentNahRegisterHandlers } from './content-nah-register/mock';
import { contentNahUpdateHandlers } from './content-nah-update/mock';

export const customerTouchAdminHandlers = [
  ...statsSummaryHandlers,
  ...statsMessagesHandlers,
  ...statsExcelHandlers,
  ...statsAggregateHandlers,

  ...statsMessageDailyHandlers,
  ...statsSearchDailyHandlers,
  ...statsMessageExcelHandlers,
  ...statsSearchExcelHandlers,
  ...statsRecomputeHandlers,

  ...promptCreateHandlers,
  ...promptUpdateHandlers,
  ...promptDeleteHandlers,
  ...promptGetHandlers,
  ...promptListHandlers,
  ...promptCategoriesHandlers,
  ...promptSlotsHandlers,
  ...promptDuplicateHandlers,

  ...killSwitchSaveHandlers,
  ...killSwitchListHandlers,
  ...killSwitchDetailHandlers,
  ...killSwitchCheckHandlers,

  ...contentNahGetHandlers,
  ...contentNahRegisterHandlers,
  ...contentNahUpdateHandlers,
];
