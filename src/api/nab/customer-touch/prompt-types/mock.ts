import { http, HttpResponse } from 'msw';

import { NAB_CUSTOMER_TOUCH_API } from '../../_lib/path';

import type { PromptTypesResponse } from './dto';

export const promptTypesMock: PromptTypesResponse = {
  types: [
    { code: 'common', namespaced: true },
    { code: 'validation', namespaced: true },
    { code: 'send_validation', namespaced: true },
    { code: 'guideline', namespaced: true },
    { code: 'situation', namespaced: false },
    { code: 'message_style', namespaced: false },
    { code: 'relationship', namespaced: false },
    { code: 'interest', namespaced: false },
  ],
  namespaceCategories: ['일반', '콘텐츠'],
};

export const promptTypesHandlers = [
  http.post(`/api${NAB_CUSTOMER_TOUCH_API.promptTypes}`, () =>
    HttpResponse.json({ data: promptTypesMock, message: 'OK' })
  ),
];
