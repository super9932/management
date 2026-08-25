import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import { promptCategoriesMock } from '../prompt-categories/mock';
import type { PromptItem, PromptListRequest } from './dto';

const CHANGERS = [
  { emnb: '2220030', name: '이정훈' },
  { emnb: '2240201', name: '김윤기' },
];

/** 카테고리 카탈로그의 (카테고리, 항목) 조합을 그대로 슬롯 하나씩 채운 목록 */
export const prompts: PromptItem[] = promptCategoriesMock.categories
  .flatMap((category) => category.items.map((item) => ({ category, item })))
  .map(({ category, item }, i) => {
    const changer = CHANGERS[i % CHANGERS.length];
    const day = String((i % 28) + 1).padStart(2, '0');

    return {
      id: i + 1,
      category: category.code,
      categoryLabel: category.label,
      item,
      name: `${category.label} — ${item}`,
      contentLength: 120 + i * 37,
      hash: `${(i + 1).toString(16).padStart(2, '0')}f3c9a1b2d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f`,
      registeredAt: `2026-08-${day} 13:12:0${i % 10}`,
      updatedAt: `2026-08-${day} 13:12:0${i % 10}`,
      lastChangerEmnb: changer.emnb,
      lastChanger: `${changer.name}(${changer.emnb})`,
      useYn: i % 7 === 0 ? 'N' : 'Y',
    };
  });

export const promptListHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.promptList}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as PromptListRequest;
    let list = prompts;

    if (body.category) list = list.filter((p) => p.category === body.category);
    if (body.item) list = list.filter((p) => p.item === body.item);
    if (body.useYn) list = list.filter((p) => p.useYn === body.useYn);
    if (body.keyword) {
      const keyword = body.keyword.trim().toLowerCase();
      const scope = body.searchScope ?? 'ALL';
      list = list.filter((p) => {
        const matchName = p.name.toLowerCase().includes(keyword);
        const matchModifier = p.lastChanger.toLowerCase().includes(keyword);
        if (scope === 'NAME') return matchName;
        if (scope === 'MODIFIER') return matchModifier;
        return matchName || matchModifier;
      });
    }

    const page = body.page ?? 1;
    const size = body.size ?? 20;
    const start = (page - 1) * size;

    return HttpResponse.json({
      data: {
        prompts: list.slice(start, start + size),
        totalCount: list.length,
        page,
        size,
      },
      message: 'OK',
    });
  }),
];
