import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';
import { promptCategoriesMock } from '../prompt-categories/mock';

import type { PromptSlotItem, PromptSlotsResponse } from './dto';

/** 카탈로그와 어긋나지 않도록 카테고리 목업에서 슬롯 29종을 펼쳐 만든다 */
const slots: PromptSlotItem[] = promptCategoriesMock.categories.flatMap((category) =>
  category.items.map(({ item }, index) => {
    // content/validation 한 자리만 비워 미등록 경로(503)를 재현한다
    const registered = !(category.code === 'content' && item === 'validation');

    return {
      category: category.code,
      categoryLabel: category.label,
      item,
      registered,
      useYn: registered ? 'Y' : null,
      promptId: registered ? 100 + index : null,
      name: registered ? `${category.label} 프롬프트(${item})` : null,
    } satisfies PromptSlotItem;
  })
);

export const promptSlotsMock: PromptSlotsResponse = {
  slots,
  totalCount: slots.length,
  registeredCount: slots.filter((slot) => slot.registered).length,
  missing: slots.filter((slot) => !slot.registered).map((slot) => `${slot.category}/${slot.item}`),
};

export const promptSlotsHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.promptSlots}`, () =>
    HttpResponse.json({ data: promptSlotsMock, message: 'OK' })
  ),
];
