const ROLE_CODES = ['SYSTEM_ADMIN', 'DOC_ADMIN', 'PROMPT_ADMIN', 'MONITOR_ADMIN', 'DOC_REVIEWER'] as const;
const NAMES = [
  '김한화', '이문서', '박관리', '최등록', '정운영', '강보안', '조프롬', '윤모니터',
  '장검수', '한시스템', '오관리자', '서문서', '신프롬프트', '임통계', '류검토',
  '남보안', '황등록', '전운영', '백관리', '고시스템',
];
const DEPT_CODES = ['A001', 'A002', 'B001', 'B002', 'C001'];

function rnd<T>(arr: readonly T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function dateStr(daysAgo: number) {
  const d = new Date('2026-05-27');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

// No.32 — 사용자 목록 (100개)
export const users = Array.from({ length: 100 }, (_, i) => ({
  userId: `FP${String(i + 1000).padStart(6, '0')}`,
  name: NAMES[i % NAMES.length],
  roles: [rnd(ROLE_CODES)] as string[],
  dept: DEPT_CODES[i % DEPT_CODES.length],
  lastLoginAt: dateStr(i % 30) + '',
  isActive: Math.random() > 0.1,
}));

// No.33 — 권한 5종 (고정)
export const roles = [
  {
    roleCode: 'SYSTEM_ADMIN',
    name: '시스템 관리자',
    permissions: ['ALL'],
    userCount: 3,
  },
  {
    roleCode: 'DOC_ADMIN',
    name: '문서 관리자',
    permissions: ['DOC_READ', 'DOC_WRITE', 'DOC_APPROVE_REQUEST'],
    userCount: 12,
  },
  {
    roleCode: 'PROMPT_ADMIN',
    name: '프롬프트 관리자',
    permissions: ['PROMPT_READ', 'PROMPT_WRITE'],
    userCount: 5,
  },
  {
    roleCode: 'MONITOR_ADMIN',
    name: '모니터링 관리자',
    permissions: ['STATS_READ', 'FEEDBACK_READ', 'TOKEN_READ'],
    userCount: 8,
  },
  {
    roleCode: 'DOC_REVIEWER',
    name: '문서 검수자',
    permissions: ['DOC_READ', 'DOC_APPROVE'],
    userCount: 15,
  },
];

// No.34 — 시스템 설정 (카테고리별)
export const settings = [
  {
    category: 'RETENTION',
    settings: [
      { key: 'CONVERSATION_RETENTION_DAYS', value: '365', valueType: 'INT', updatedAt: dateStr(10), updatedBy: 'admin01' },
      { key: 'PURGE_BATCH_SIZE', value: '1000', valueType: 'INT', updatedAt: dateStr(10), updatedBy: 'admin01' },
      { key: 'PURGE_ALERT_ENABLED', value: 'true', valueType: 'BOOL', updatedAt: dateStr(5), updatedBy: 'admin01' },
    ],
  },
  {
    category: 'AI',
    settings: [
      { key: 'LLM_TIMEOUT_MS', value: '30000', valueType: 'INT', updatedAt: dateStr(3), updatedBy: 'system' },
      { key: 'EMBEDDING_BATCH_SIZE', value: '128', valueType: 'INT', updatedAt: dateStr(3), updatedBy: 'system' },
      { key: 'MAX_TOKENS_PER_REQUEST', value: '4096', valueType: 'INT', updatedAt: dateStr(3), updatedBy: 'system' },
      { key: 'MONTHLY_BUDGET_USD', value: '2000', valueType: 'INT', updatedAt: dateStr(1), updatedBy: 'admin01' },
      { key: 'BUDGET_ALERT_THRESHOLD', value: '0.85', valueType: 'STRING', updatedAt: dateStr(1), updatedBy: 'admin01' },
    ],
  },
  {
    category: 'SECURITY',
    settings: [
      { key: 'JWT_EXPIRY_SECONDS', value: '3600', valueType: 'INT', updatedAt: dateStr(30), updatedBy: 'admin01' },
      { key: 'MAX_LOGIN_ATTEMPTS', value: '5', valueType: 'INT', updatedAt: dateStr(30), updatedBy: 'admin01' },
      { key: 'SESSION_IDLE_TIMEOUT_MIN', value: '30', valueType: 'INT', updatedAt: dateStr(30), updatedBy: 'admin01' },
    ],
  },
];

// No.35 — 설정 변경 결과 (단건 예시)
export const settingUpdateResult = {
  updated: [
    { key: 'CONVERSATION_RETENTION_DAYS', oldValue: '365', newValue: '180' },
  ],
};
