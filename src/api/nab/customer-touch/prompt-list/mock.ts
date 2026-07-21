import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { PromptItem, PromptListRequest } from './dto';

const CATEGORIES = ['GREETING', 'CARE', 'INFO', 'EVENT'];
const TONES = ['FRIENDLY', 'FORMAL', 'CASUAL'];
const SITUATIONS = ['BIRTHDAY', 'CONTRACT_ANNIV', 'SEASONAL'];
const RELATIONSHIPS = ['NEW', 'LONGTERM', 'VIP'];
const INTERESTS = ['HEALTH', 'ASSET', 'TRAVEL', 'FAMILY'];

export const prompts: PromptItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: 1_001 + i,
  name: `프롬프트 템플릿 #${i + 1}`,
  categoryCode: CATEGORIES[i % CATEGORIES.length],
  toneCode: TONES[i % TONES.length],
  situationCode: SITUATIONS[i % SITUATIONS.length],
  relationshipCode: RELATIONSHIPS[i % RELATIONSHIPS.length],
  interestCode: INTERESTS[i % INTERESTS.length],
  updatedAt: `2026-07-${String((i % 28) + 1).padStart(2, '0')} 10:05:33`,
  useYn: i % 5 === 0 ? 'N' : 'Y',
}));

export const promptListHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.promptList}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as PromptListRequest;
    let list = prompts;
    if (body.categoryCode) list = list.filter((p) => p.categoryCode === body.categoryCode);
    if (body.useYn) list = list.filter((p) => p.useYn === body.useYn);
    return HttpResponse.json({ data: { prompts: list }, message: 'OK' });
  }),
];
