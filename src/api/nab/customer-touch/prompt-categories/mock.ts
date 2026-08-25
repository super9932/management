import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { PromptCategoriesResponse } from './dto';

export const promptCategoriesMock: PromptCategoriesResponse = {
  categories: [
    { code: 'general', label: '일반', scenario: true, items: ['common', 'guideline', 'validation'] },
    { code: 'content', label: '콘텐츠', scenario: true, items: ['common', 'guideline', 'validation'] },
    {
      code: 'situation',
      label: '고객상황',
      scenario: false,
      items: [
        '보험금미수령',
        '만기도래',
        '연금개시',
        '상속인미지정',
        '고객센터통화',
        '청구',
        '실효',
        '약대활용',
        '계약기념일',
        '생일',
        'VIP',
      ],
    },
    {
      code: 'relationship',
      label: '고객과의관계',
      scenario: false,
      items: ['계약고객', '수금이관고객', '친구', '선배', '후배', '지인추천고객'],
    },
    { code: 'tone', label: '메시지톤', scenario: false, items: ['공손한', '친근한', '정중한'] },
    {
      code: 'message_style',
      label: '문자유형',
      scenario: false,
      items: ['감성형', '정보전달형', '격식형'],
    },
  ],
};

export const promptCategoriesHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.promptCategories}`, () =>
    HttpResponse.json({ data: promptCategoriesMock, message: 'OK' })
  ),
];
