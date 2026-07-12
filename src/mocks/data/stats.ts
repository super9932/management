import { v4 as uuid } from 'uuid';

const CATEGORIES = ['보유고객', '신계약', '가망고객'];
const RATINGS = ['POSITIVE', 'NEGATIVE'] as const;
const COMMENTS = [
  '답변이 정확하고 빠릅니다.',
  '원하는 정보를 쉽게 찾을 수 있었어요.',
  '약관 내용이 잘 요약되어 있네요.',
  '응답 속도가 조금 느렸습니다.',
  '일부 내용이 실제 약관과 달랐어요.',
  '매우 유용합니다!',
  '보장 내용 설명이 명확했어요.',
];

function rnd<T>(arr: readonly T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function dateStrFromOffset(offset: number) {
  const d = new Date('2026-05-27');
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

// No.36 — 사용자 통계 (100일치 byDate)
export const userStats = {
  dau: 842,
  mau: 12340,
  avgSessionMinutes: 18.4,
  byDate: Array.from({ length: 100 }, (_, i) => ({
    date: dateStrFromOffset(99 - i),
    dau: Math.floor(600 + Math.random() * 400),
    sessions: Math.floor(1200 + Math.random() * 800),
  })),
};

// No.37 — 질의 통계
export const queryStats = {
  totalQueries: 42312,
  byCategory: CATEGORIES.map((cat) => ({
    category: cat,
    count: Math.floor(10000 + Math.random() * 15000),
    rephrasingRate: parseFloat((0.05 + Math.random() * 0.15).toFixed(2)),
  })),
  avgResponseTimeMs: 2840,
  p95ResponseTimeMs: 4520,
};

// No.38 — 피드백 집계 + 최근 7일 5건
export const feedbackStats = {
  positive: 3120,
  negative: 218,
  ratio: 0.93,
  recent: Array.from({ length: 5 }, (_, i) => ({
    feedbackId: 200 - i,
    messageId: uuid(),
    rating: i < 4 ? 'POSITIVE' : 'NEGATIVE',
    comment: rnd(COMMENTS),
    createdAt: dateStrFromOffset(i) + ' 14:30:00',
  })),
};

// No.39 — 피드백 상세 100개 (낱건 조회용 pool)
export const feedbackDetails = Array.from({ length: 100 }, (_, i) => ({
  feedbackId: i + 1,
  messageId: uuid(),
  conversationId: uuid(),
  userId: `FP${String(i + 1000).padStart(6, '0')}`,
  rating: rnd(RATINGS),
  comment: rnd(COMMENTS),
  messageContent: `답변 내용: 고객님의 ${rnd(['암', '실손', '종신', '변액'])} 보험 보장 내역을 안내해 드립니다. 관련 약관 ${Math.floor(Math.random() * 50) + 1}페이지를 참고하세요.`,
  userQuery: `${rnd(['암 진단', '실손 청구', '해약환급금', '보험료 납입'])} 관련 문의드립니다.`,
}));

// No.40 — 토큰 사용량
export const tokenStats = {
  monthlyTotalTokens: 482310000,
  monthlyCostUsd: 1284.5,
  dailyAvgTokens: 16077000,
  dailyAvgCostUsd: 42.81,
  budget: {
    monthlyLimitUsd: 2000,
    remainingUsd: 715.5,
    alertThreshold: 0.85,
  },
  byDate: Array.from({ length: 100 }, (_, i) => ({
    date: dateStrFromOffset(99 - i),
    inputTokens: Math.floor(8000000 + Math.random() * 4000000),
    outputTokens: Math.floor(2000000 + Math.random() * 1000000),
    costUsd: parseFloat((30 + Math.random() * 30).toFixed(2)),
  })),
};
