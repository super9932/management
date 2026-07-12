const AI_SYNC_STATUSES = ['SUCCESS', 'PENDING', 'FAILED'] as const;
function rnd<T>(arr: readonly T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function dateStr(daysAgo: number) {
  const d = new Date('2026-05-27');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

const PROMPT_DEFINITIONS = [
  { typeCode: 'SYSTEM_PROMPT', name: '기본 시스템 프롬프트' },
  { typeCode: 'RAG_CONTEXT', name: 'RAG 컨텍스트 삽입 프롬프트' },
  { typeCode: 'REPHRASING', name: '질문 재표현(Rephrasing) 프롬프트' },
  { typeCode: 'ANSWER_FORMAT', name: '답변 포맷 지시 프롬프트' },
  { typeCode: 'DISCLAIMER', name: '면책 고지 프롬프트' },
  { typeCode: 'GREETING', name: '인사말 프롬프트' },
  { typeCode: 'FALLBACK', name: '미매칭 처리 프롬프트' },
  { typeCode: 'SUMMARY', name: '요약 프롬프트' },
  { typeCode: 'CLARIFY', name: '되묻기 프롬프트' },
  { typeCode: 'SAFETY_FILTER', name: '안전 필터 프롬프트' },
];

const SAMPLE_BODIES: Record<string, string> = {
  SYSTEM_PROMPT: `당신은 한화생명 상담 AI입니다. 고객의 보험 관련 질문에 정확하고 친절하게 답변하세요. 답변은 반드시 등록된 약관 문서에 근거해야 하며, 확인되지 않은 내용은 안내하지 마세요.`,
  RAG_CONTEXT: `다음은 질문과 관련된 약관 내용입니다:\n\n{context}\n\n위 내용을 참고하여 고객의 질문에 답변하세요.`,
  REPHRASING: `다음 질문을 명확하고 검색에 최적화된 형태로 재표현하세요:\n\n질문: {question}\n\n재표현된 질문:`,
  ANSWER_FORMAT: `답변 시 다음 형식을 따르세요:\n1. 핵심 답변 (2문장 이내)\n2. 상세 설명\n3. 참고 약관 페이지`,
  DISCLAIMER: `본 답변은 AI가 약관을 기반으로 제공하는 참고 정보입니다. 실제 보험금 지급은 약관 심사를 통해 결정됩니다.`,
  GREETING: `안녕하세요, 한화생명 상담 AI입니다. 보험 관련 궁금한 사항을 편하게 질문해 주세요.`,
  FALLBACK: `죄송합니다. 해당 질문에 대한 정확한 정보를 찾지 못했습니다. 고객센터(1588-0000)로 문의해 주세요.`,
  SUMMARY: `다음 대화 내용을 3줄 이내로 요약하세요:\n\n{conversation}`,
  CLARIFY: `질문 의도를 명확히 파악하기 위해 다음 중 어떤 내용이 궁금하신가요?`,
  SAFETY_FILTER: `다음 내용이 보험 상담과 무관하거나 부적절한 경우 "관련 없음"으로 분류하세요.`,
};

// No.41 — 프롬프트 유형 목록 (10종)
export const promptTypes = PROMPT_DEFINITIONS.map((def, i) => ({
  typeCode: def.typeCode,
  name: def.name,
  active: {
    templateId: 100 + i,
    version: Math.floor(Math.random() * 15) + 1,
    body: SAMPLE_BODIES[def.typeCode] ?? `${def.name} 본문입니다.`,
    aiSyncStatus: rnd(AI_SYNC_STATUSES),
    aiSyncedAt: dateStr(i),
  },
}));

// No.41 이력 — 버전별 100개 (조회용 pool)
export const promptHistory = Array.from({ length: 100 }, (_, i) => {
  const def = PROMPT_DEFINITIONS[i % PROMPT_DEFINITIONS.length];
  return {
    templateId: 200 + i,
    typeCode: def.typeCode,
    typeName: def.name,
    version: Math.floor(i / PROMPT_DEFINITIONS.length) + 1,
    body: SAMPLE_BODIES[def.typeCode] ?? `${def.name} v${Math.floor(i / 10) + 1} 본문.`,
    status: i < 10 ? 'ACTIVE' : 'RETIRED',
    changeNote: `${['성능 개선', '고객 피드백 반영', '약관 개정 대응', '안전 필터 강화', '컨텍스트 보강'][i % 5]}`,
    aiSyncStatus: rnd(AI_SYNC_STATUSES),
    aiSyncedAt: dateStr(i),
    createdAt: dateStr(i),
    createdBy: ['admin01', 'prompt_mgr', 'sys_admin'][i % 3],
  };
});

// No.42 — 등록/수정 결과 (단건)
export const promptUpsertResult = {
  templateId: 125,
  typeCode: 'SYSTEM_PROMPT',
  version: 13,
  status: 'ACTIVE',
  aiSyncStatus: 'PENDING',
};
