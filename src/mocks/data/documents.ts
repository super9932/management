import { v4 as uuid } from 'uuid';

const DOC_TYPES = ['POLICY_TERMS', 'SERVICE_MANUAL', 'PRODUCT_MANUAL', 'OPS_GUIDE'] as const;
const APPROVAL_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const;
const UPLOAD_STATUSES = ['UPLOADING', 'PROCESSING', 'COMPLETED', 'FAILED'] as const;
const PHASES = ['UPLOAD', 'CHUNK', 'EMBEDDING', 'INDEXING'] as const;
const OPERATION_STATUSES = ['대기', '운영', '미운영'] as const;

const PROD_CODE_PAIRS = [
  { code1: '1609-045~048', code2: '2247-A01~A09', prodKind: 'K07' },
  { code1: '1743-017~026', code2: '1744-003',     prodKind: 'L13' },
  { code1: '1818-027~050', code2: '1832-002',     prodKind: 'M21' },
  { code1: '1880-001~003', code2: '-',             prodKind: 'N04' },
  { code1: '1902-001~006', code2: '-',             prodKind: 'P09' },
  { code1: '1930-001~004', code2: '-',             prodKind: 'K07' },
  { code1: '2010-001~002', code2: '-',             prodKind: 'L13' },
  { code1: '2139-A01',     code2: '-',             prodKind: 'M21' },
  { code1: '2204-A01',     code2: '-',             prodKind: 'N04' },
  { code1: '2247-B01~B05', code2: '2248-001',      prodKind: 'P09' },
];

const PROD_NAMES = [
  '(무)대한변액CI보험',
  '(무)스마트CI통합보험',
  '한화생명 프라임통합종신보험(무)',
  'The착한 암보험 무배당',
  'CI 가입고객을 위한 보장보험(무)',
  '실속있어좋은 GI보험 무배당',
  '시그니처 암보험 무배당',
  'H건강보험(Basic) 무배당',
  'The 시그니처 암보험 무배당',
  '스마트변액유니버셜종신보험(무)',
];

const REGISTRANTS = ['김한화', '이문서', '박관리', '최등록', '정운영'];

function rnd<T>(arr: readonly T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function dateStr(daysAgo: number) {
  const d = new Date('2026-05-27');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}
function dateTimeStr(daysAgo: number, hh = '08', mm = '00') {
  return `${dateStr(daysAgo).slice(2).replace(/-/g, '.')} ${hh}:${mm}:00`;
}

/** No.29 — 문서 목록 100개 (UI 표시 필드 포함) */
export const documents = Array.from({ length: 100 }, (_, i) => {
  const pair = PROD_CODE_PAIRS[i % PROD_CODE_PAIRS.length];
  const prodName = PROD_NAMES[i % PROD_NAMES.length];
  const cat = i % 5 === 4 ? rnd(['MANUAL', 'GUIDE', 'OTHER'] as const) : 'POLICY';
  const approvalStatus = rnd(APPROVAL_STATUSES);
  const uploadStatus = i % 3 === 0 ? 'COMPLETED' : rnd(UPLOAD_STATUSES);
  const opStatus = rnd(OPERATION_STATUSES);
  const ver = `${String(Math.floor(i / 10) + 1).padStart(2, '0')}${String((i % 4) * 10).padStart(2, '0')}01`;
  const endVer = `${String(Math.floor(i / 10) + 1).padStart(2, '0')}${String(((i + 1) % 4) * 10).padStart(2, '0')}30`;
  const hasEndDate = Math.random() > 0.4;

  return {
    // API 공통 필드
    documentId: uuid(),
    category: cat,
    documentType: rnd(DOC_TYPES),
    title: `${prodName} 약관`,
    fileName: cat === 'POLICY'
      ? `${prodName}_${pair.code1}_약관_${ver}${hasEndDate ? `~${endVer}` : ''}.pdf`
      : `문서_${i + 1}.pdf`,
    productMasterId: cat === 'POLICY' ? 4000 + i : null,
    approvalStatus,
    uploadStatus,
    registeredBy: rnd(REGISTRANTS),
    approvedBy: approvalStatus === 'APPROVED' ? rnd(REGISTRANTS) : null,
    effectiveFrom: dateStr(180 - i),
    effectiveTo: hasEndDate ? dateStr(-(i * 2)) : null,
    createdAt: dateStr(i % 30) + ' 09:00:00',

    // UI 표시용 확장 필드
    code1: pair.code1,
    code2: pair.code2,
    salePeriodStart: `20${27 - (i % 5)}.${String((i % 12) + 1).padStart(2, '0')}.10 ~`,
    salePeriodEnd: hasEndDate ? `20${27 - (i % 5)}.${String(((i + 3) % 12) + 1).padStart(2, '0')}.31` : '-',
    reflectionDate: dateTimeStr(i % 365),
    endDate: hasEndDate ? dateTimeStr(-(i % 365), '17') : '-',
    operationStatus: opStatus,
  };
});

/** No.26 — 작업 상태 100개 */
export const jobStatuses = Array.from({ length: 100 }, (_, i) => ({
  documentId: documents[i]?.documentId ?? uuid(),
  title: `${PROD_NAMES[i % PROD_NAMES.length]} 약관`,
  status: rnd(UPLOAD_STATUSES),
  phase: rnd(PHASES),
  attemptNo: (i % 3) + 1,
  errorMessage: Math.random() > 0.85 ? '임베딩 파이프라인 연결 실패' : null,
  updatedAt: dateStr(i % 7) + ' 10:23:00',
}));

/** No.25 — 문서 등록 결과 (단건) */
export const uploadResult = {
  documentId: uuid(),
  category: 'POLICY',
  documentType: 'POLICY_TERMS',
  title: '(무)스마트변액유니버셜종신보험 약관 v1.2',
  fileName: '약관_K07_(무)스마트변액유니버셜종신보험_v1.2.pdf',
  parsedProdKind: 'K07',
  parsedProdName: '(무)스마트변액유니버셜종신보험',
  productMasterId: 4231,
  prodCode: 'P00231',
  effectiveFrom: '2024-04-01',
  approvalId: 7821,
  approvalStatus: 'PENDING',
  status: 'UPLOADING',
};

/** No.27 — 상품 Sync 결과 (단건) */
export const syncResult = {
  syncLogId: 1042,
  status: 'STARTED',
  triggerType: 'MANUAL',
};

/** No.31 — 결재 결과 (단건) */
export const approveResult = {
  approvalId: 7821,
  documentId: uuid(),
  approvalStatus: 'APPROVED',
  approvedAt: '2026-05-27 14:30:00',
  approvedBy: 'reviewer01',
};
