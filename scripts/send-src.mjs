// scripts/send-src.mjs
//
// src 디렉토리를 zip으로 압축해 인자로 받은 메일주소로 발송한다 (nodemailer / SMTP).
// 사용법:  npm run send-src -- <수신-메일주소>
//          node --env-file-if-exists=.env.local scripts/send-src.mjs <수신-메일주소>
//
// SMTP 자격증명은 반드시 환경변수(.env.local)로 주입한다 — 코드/깃에 하드코딩 금지(S-01/E-03).
//   SMTP_HOST, SMTP_PORT(기본 587), SMTP_SECURE(true/false), SMTP_USER, SMTP_PASS, MAIL_FROM(선택)

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(message) {
  console.error(`[send-src] ${message}`);
  process.exit(1);
}

// 1) 인자 검증 — 수신 메일주소
const to = process.argv[2];
if (!to) {
  fail('수신 메일주소가 필요합니다.  사용법: npm run send-src -- <메일주소>');
}
if (!EMAIL_RE.test(to)) {
  fail(`유효하지 않은 메일주소 형식입니다: ${to}`);
}

// 2) SMTP 설정 검증 (시크릿은 환경변수로만)
const {
  SMTP_HOST,
  SMTP_PORT = '587',
  SMTP_SECURE = 'false',
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM,
} = process.env;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  fail('SMTP_HOST / SMTP_USER / SMTP_PASS 환경변수가 필요합니다. .env.local 을 확인하세요.');
}

// nodemailer는 선택 의존성 — 미설치 시 설치 안내
let nodemailer;
try {
  nodemailer = (await import('nodemailer')).default;
} catch {
  fail('nodemailer 가 필요합니다.  설치:  npm i -D nodemailer');
}

// 3) src 압축 (임시 디렉토리)
const workDir = mkdtempSync(join(tmpdir(), 'send-src-'));
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const fileName = `src-${stamp}.zip`;
const archivePath = join(workDir, fileName);

try {
  // zip 은 tar 의 -C 에 해당하는 옵션이 없어 cwd 를 프로젝트 루트로 두고 상대경로로 담는다.
  // -r 재귀, -q 조용히, -x 제외 패턴.
  execFileSync(
    'zip',
    [
      '-r',
      '-q',
      archivePath,
      'src/pages',
      'src/sections',
      'src/api',
      '-x',
      '*.DS_Store',
    ],
    { cwd: ROOT, stdio: 'inherit' },
  );
} catch (error) {
  rmSync(workDir, { recursive: true, force: true });

  // zip 미설치는 메시지만으로 원인을 알기 어려워 따로 안내한다
  if (error && error.code === 'ENOENT') {
    fail('zip 명령을 찾을 수 없습니다. (macOS 기본 포함 / Ubuntu: sudo apt install zip)');
  }

  fail(`압축 실패: ${error instanceof Error ? error.message : String(error)}`);
}

const sizeKb = (statSync(archivePath).size / 1024).toFixed(1);

// 4) 메일 발송
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === 'true',
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

try {
  const info = await transporter.sendMail({
    from: MAIL_FROM || SMTP_USER,
    to,
    subject: `[management] src 소스 아카이브 (${stamp})`,
    text: `management 프로젝트 src 디렉토리 압축본을 첨부합니다.\n- 파일: ${fileName}\n- 크기: ${sizeKb} KB`,
    attachments: [{ filename: fileName, content: readFileSync(archivePath) }],
  });
  console.log(`[send-src] 발송 완료 → ${to}  (${sizeKb} KB, messageId: ${info.messageId})`);
} catch (error) {
  fail(`메일 발송 실패: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
