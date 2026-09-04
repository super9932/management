import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { PromptCategoriesResponse } from './dto';

export const promptCategoriesMock: PromptCategoriesResponse = {
  categories: [
    { code: 'general', label: '일반', scenario: true, items: [{ item: 'common' }, { item: 'guideline' }, { item: 'validation' }] },
    { code: 'content', label: '콘텐츠', scenario: true, items: [{ item: 'common' }, { item: 'guideline' }, { item: 'validation' }] },
    {
      code: 'situation',
      label: '고객상황',
      scenario: false,
      items: [{ item: '보험금미수령' }, { item: '만기도래' }, { item: '연금개시' }, { item: '상속인미지정' }, { item: '고객센터통화' }, { item: '청구' }, { item: '실효' }, { item: '약대활용' }, { item: '계약기념일' }, { item: '생일' }, { item: 'VIP' }],
    },
    {
      code: 'relationship',
      label: '고객과의관계',
      scenario: false,
      items: [{ item: '계약고객' }, { item: '수금이관고객' }, { item: '친구' }, { item: '선배' }, { item: '후배' }, { item: '지인추천고객' }],
    },
    { code: 'tone', label: '메시지톤', scenario: false, items: [{ item: '공손한' }, { item: '친근한' }, { item: '정중한' }] },
    {
      code: 'message_style',
      label: '문자유형',
      scenario: false,
      items: [{ item: '감성형' }, { item: '정보전달형' }, { item: '격식형' }],
    },
  ],
};

export const promptCategoriesHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.promptCategories}`, () =>
    HttpResponse.json({ data: promptCategoriesMock, message: 'OK' })
  ),
];
