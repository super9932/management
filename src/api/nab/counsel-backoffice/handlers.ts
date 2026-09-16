/** 상담AI 백오피스 API MSW 핸들러 — src/mocks/handlers.ts에서 스프레드해 등록한다. */
import { statsMessagesHandlers } from './stats-messages/mock';
import { statsExcelHandlers } from './stats-excel/mock';

import { manualListHandlers } from './manual-list/mock';
import { manualDetailHandlers } from './manual-detail/mock';
import { manualHistoryHandlers } from './manual-history/mock';
import { manualSaveHandlers } from './manual-save/mock';
import { manualUpdateHandlers } from './manual-update/mock';
import { manualDeleteHandlers } from './manual-delete/mock';

import { stipulationListHandlers } from './stipulation-list/mock';
import { stipulationDetailHandlers } from './stipulation-detail/mock';
import { stipulationSaveHandlers } from './stipulation-save/mock';
import { stipulationDeleteHandlers } from './stipulation-delete/mock';

import { counselKillSwitchDetailHandlers } from './killswitch-detail/mock';
import { counselKillSwitchSaveHandlers } from './killswitch-save/mock';

export const counselBackofficeHandlers = [
  ...statsMessagesHandlers,
  ...statsExcelHandlers,

  ...manualListHandlers,
  ...manualDetailHandlers,
  ...manualHistoryHandlers,
  ...manualSaveHandlers,
  ...manualUpdateHandlers,
  ...manualDeleteHandlers,

  ...stipulationListHandlers,
  ...stipulationDetailHandlers,
  ...stipulationSaveHandlers,
  ...stipulationDeleteHandlers,
  ...counselKillSwitchDetailHandlers,
  ...counselKillSwitchSaveHandlers,
];
