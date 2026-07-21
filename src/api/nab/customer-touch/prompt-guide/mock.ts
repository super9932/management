import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { PromptGuideResponse } from './dto';

export const promptGuideMock: PromptGuideResponse = {
  guide: [
    '1. 고객의 이름과 호칭을 자연스럽게 포함하세요.',
    '2. 보험 상품의 구체적인 수익률·보장금액을 단정적으로 표현하지 마세요.',
    '3. 어조(tone)·상황(situation)·관계(relationship)·관심사(interest) 코드 조합은 중복될 수 없습니다.',
    '4. 추가 가이드에는 금칙어와 필수 포함 문구를 명시하세요.',
  ].join('\n'),
};

export const promptGuideHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.promptGuide}`, () =>
    HttpResponse.json({ data: promptGuideMock, message: 'OK' })
  ),
];
