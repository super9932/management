import type { PromptRow } from '../type';

export const MOCK_ROWS: PromptRow[] = Array.from({ length: 10 }, (_, i) => ({
  no: 63 - i,
  contentsId: '0000',
  type: '유형',
  category: '카테고리',
  promptName: '작성한 프롬프트명 노출',
  registeredAt: '2026-09-25',
  updatedAt: '2026-10-15',
  lastEditor: '2190063',
}));
