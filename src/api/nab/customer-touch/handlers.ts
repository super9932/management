/** 고객터치AI 관리자 API MSW 핸들러 — src/mocks/handlers.ts에서 스프레드해 등록한다. */
import { statsSummaryHandlers } from './stats-summary/mock';
import { statsMessagesHandlers } from './stats-messages/mock';
import { statsExcelHandlers } from './stats-excel/mock';
import { statsAggregateHandlers } from './stats-aggregate/mock';

import { promptCreateHandlers } from './prompt-create/mock';
import { promptUpdateHandlers } from './prompt-update/mock';
import { promptDeleteHandlers } from './prompt-delete/mock';
import { promptGetHandlers } from './prompt-get/mock';
import { promptListHandlers } from './prompt-list/mock';
import { promptGuideHandlers } from './prompt-guide/mock';
import { promptDuplicateHandlers } from './prompt-duplicate/mock';

import { killSwitchSaveHandlers } from './killswitch-save/mock';
import { killSwitchListHandlers } from './killswitch-list/mock';
import { killSwitchDetailHandlers } from './killswitch-detail/mock';
import { killSwitchCheckHandlers } from './killswitch-check/mock';

import { categoryCreateHandlers } from './category-create/mock';
import { categoryUpdateHandlers } from './category-update/mock';
import { categoryUseYnHandlers } from './category-useyn/mock';
import { categoryGetHandlers } from './category-get/mock';
import { categoryListHandlers } from './category-list/mock';

export const customerTouchAdminHandlers = [
  ...statsSummaryHandlers,
  ...statsMessagesHandlers,
  ...statsExcelHandlers,
  ...statsAggregateHandlers,

  ...promptCreateHandlers,
  ...promptUpdateHandlers,
  ...promptDeleteHandlers,
  ...promptGetHandlers,
  ...promptListHandlers,
  ...promptGuideHandlers,
  ...promptDuplicateHandlers,

  ...killSwitchSaveHandlers,
  ...killSwitchListHandlers,
  ...killSwitchDetailHandlers,
  ...killSwitchCheckHandlers,

  ...categoryCreateHandlers,
  ...categoryUpdateHandlers,
  ...categoryUseYnHandlers,
  ...categoryGetHandlers,
  ...categoryListHandlers,
];
