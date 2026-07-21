import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { CategoryListRequest } from './dto';
import type { CategoryModel } from '../types';

/** category-get / category-useyn mock이 이 배열을 공유한다 (토글 시 여기 값이 바뀐다). */
export const categories: CategoryModel[] = [
  { cgryCode: 'GREETING', cgryNm: '인사·안부', cntn: '생일·기념일 등 안부 메시지', sortOrdr: 1, useYn: 'Y' },
  { cgryCode: 'CARE', cgryNm: '고객 케어', cntn: '계약 관리 및 사후 케어', sortOrdr: 2, useYn: 'Y' },
  { cgryCode: 'INFO', cgryNm: '정보 제공', cntn: '보험·재테크 정보 콘텐츠', sortOrdr: 3, useYn: 'Y' },
  { cgryCode: 'EVENT', cgryNm: '이벤트', cntn: '프로모션 및 이벤트 안내', sortOrdr: 4, useYn: 'N' },
  { cgryCode: 'SEASON', cgryNm: '시즌', cntn: '명절·계절 인사', sortOrdr: 5, useYn: 'Y' },
];

export const categoryListHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.categoryList}`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as CategoryListRequest;
    const list = body.useYn ? categories.filter((c) => c.useYn === body.useYn) : categories;
    return HttpResponse.json({
      data: { categories: [...list].sort((a, b) => a.sortOrdr - b.sortOrdr) },
      message: 'OK',
    });
  }),
];
