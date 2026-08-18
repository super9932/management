import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { PromptItem, PromptListRequest } from './dto';

const TYPES = ['situation', 'message_style', 'validation', 'guideline'];
const CATEGORIES = ['일반', '콘텐츠', 'VIP', '생일'];
const CHANGERS = [
  { emnb: '20180412', name: '김한화' },
  { emnb: '20210305', name: '이설계' },
  { emnb: '20220901', name: '박운영' },
];

export const prompts: PromptItem[] = Array.from({ length: 24 }, (_, i) => {
  const changer = CHANGERS[i % CHANGERS.length];
  const day = String((i % 28) + 1).padStart(2, '0');

  return {
    id: 1_001 + i,
    type: TYPES[i % TYPES.length],
    category: CATEGORIES[i % CATEGORIES.length],
    name: `프롬프트 템플릿 #${i + 1}`,
    contentLength: 320 + i * 17,
    hash: `${(i + 1).toString(16).padStart(2, '0')}f3c9a1b2d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f`,
    registeredAt: `2026-06-${day} 09:12:44`,
    updatedAt: `2026-07-${day} 10:05:33`,
    lastChangerEmnb: changer.emnb,
    lastChanger: `${changer.name}(${changer.emnb})`,
    useYn: i % 5 === 0 ? 'N' : 'Y',
  };
});

export const promptListHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.promptList}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as PromptListRequest;
    let list = prompts;

    if (body.type) list = list.filter((p) => p.type === body.type);
    if (body.category) list = list.filter((p) => p.category === body.category);
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
