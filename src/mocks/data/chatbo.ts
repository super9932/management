import { v4 as uuid } from 'uuid';

const SERVICE_TYPES = ['CUSTOMER_MGMT', 'NEW_CONTRACT', 'PROSPECT'] as const;
const TITLES = [
  '홍*동 (42세)', '김*수 (35세)', '이*영 (58세)', '박*현 (47세)', '최*진 (31세)',
  '정*은 (52세)', '강*민 (29세)', '조*희 (44세)', '윤*석 (61세)', '장*아 (38세)',
];
const FP_IDS = Array.from({ length: 20 }, (_, i) => `FP${String(i + 1000).padStart(6, '0')}`);

function rnd<T>(arr: readonly T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function dateStr(daysAgo: number) {
  const d = new Date('2026-05-27');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

// No.21 — 전체 대화 목록 (100개)
export const conversations = Array.from({ length: 100 }, (_, i) => ({
  conversationId: uuid(),
  fpId: rnd(FP_IDS),
  serviceType: rnd(SERVICE_TYPES),
  title: rnd(TITLES),
  lastMessageAt: dateStr(i),
}));

// No.22 — 세션별 메시지 (대화 1건당 15개)
export function buildMessages(conversationId: string) {
  const pairs = 7;
  const msgs = [];
  for (let i = 0; i < pairs; i++) {
    msgs.push({
      messageId: uuid(),
      seqNo: i * 2 + 1,
      role: 'USER',
      content: `질문 ${i + 1}: 고객님의 보장 내용에 대해 안내해 드릴까요?`,
      createdAt: dateStr(pairs - i),
    });
    msgs.push({
      messageId: uuid(),
      seqNo: i * 2 + 2,
      role: 'ASSISTANT',
      content: `답변 ${i + 1}: 네, 고객님의 보장 내용을 안내해 드리겠습니다. 본 답변은 약관을 근거로 제공됩니다.`,
      sources: [{
        documentId: uuid(),
        fileId: `terms-${2024 + i}`,
        sourceType: 'TERMS',
        section: rnd(['DISCLAIMER', 'SUMMARY', 'DETAIL', 'CAUTION']),
        page: Math.floor(Math.random() * 50) + 1,
      }],
      createdAt: dateStr(pairs - i),
    });
  }
  return { conversationId, messages: msgs };
}

// No.23 — 키워드 검색 결과 (100개)
const SNIPPETS = [
  '...암 진단 시 받을 수 있는 **보장**과 진단금...',
  '...실손 의료비 청구 절차에 대해 안내해 드립니다...',
  '...종신보험 해약환급금 계산 방법은...',
  '...변액보험 펀드 변경은 월 2회까지 가능합니다...',
  '...질병후유장해 지급 기준은 장해등급표에 따릅니다...',
];
export const searchResults = Array.from({ length: 100 }, (_, i) => ({
  messageId: uuid(),
  conversationId: uuid(),
  fpId: rnd(FP_IDS),
  snippet: rnd(SNIPPETS),
  createdAt: dateStr(i),
}));

// No.24 — Purge 결과 (단건)
export const purgeResult = {
  triggerType: 'MANUAL',
  dryRun: false,
  deletedConversations: 423,
  deletedMessages: 8541,
  deletedSources: 12302,
  deletedFeedback: 367,
  deletedToolCalls: 84,
  earliestDeleted: '2024-12-15',
  latestDeleted: '2025-05-25',
  executedAt: '2026-05-26 03:00:00',
  durationMs: 4521,
};
