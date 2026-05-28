---
description: Figma 디자인 URL을 받아 Figma MCP로 디자인 데이터를 가져오고 React + MUI 컴포넌트로 구현한다
---

# figma-to-mui

Figma 화면 URL을 입력받아 Figma Dev Mode MCP Server에서 디자인 데이터를 가져오고,
이 프로젝트(Vite + React + TypeScript + MUI v5)의 스타일 컨벤션에 맞게 페이지 컴포넌트를 생성한다.

## Input

`/figma-to-mui <figma-url> [output-component-name]`

- `figma-url` (필수): Figma 디자인 URL (`https://www.figma.com/design/...?node-id=...` 형식)
- `output-component-name` (선택): 생성할 컴포넌트 파일명. 없으면 Figma 파일명에서 추론한다.

## Prerequisites

Figma Dev Mode MCP Server가 로컬에서 실행 중이어야 한다.

```bash
# MCP 서버가 살아 있는지 확인
curl -s http://127.0.0.1:3845/mcp -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1"}}}' \
  | head -5
```

응답이 없거나 에러면 사용자에게 Figma 데스크탑 앱에서 Dev Mode MCP Server를 활성화하도록 안내한다.

## Step 1 — MCP 세션 초기화

```bash
# 1-a. initialize
INIT=$(curl -si http://127.0.0.1:3845/mcp \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"claude-code","version":"1"}}}')

# 1-b. 세션 ID 추출 (응답 헤더 mcp-session-id)
SESSION_ID=$(echo "$INIT" | grep -i 'mcp-session-id' | awk '{print $2}' | tr -d '\r')

echo "Session: $SESSION_ID"
```

## Step 2 — 디자인 컨텍스트 가져오기

```bash
FIGMA_URL="<입력받은 URL>"

RESULT=$(curl -s http://127.0.0.1:3845/mcp \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-session-id: $SESSION_ID" \
  -d "{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"tools/call\",\"params\":{\"name\":\"get_design_context\",\"arguments\":{\"url\":\"$FIGMA_URL\",\"disableCodeConnect\":false}}}")
```

응답이 Code Connect 프롬프트 스크립트(첫 줄이 `#!/usr/bin/env node` 등)인 경우, 실제 디자인 데이터가 아닌 것이다.
그 경우 `"disableCodeConnect": true` 로 재호출한다.

응답이 크면(보통 50KB 이상) Python으로 텍스트만 추출한다:

```bash
echo "$RESULT" | python3 -c "
import sys, re
data = sys.stdin.read()
# SSE 포맷이면 data: 라인만 추출
lines = [l[6:] for l in data.split('\n') if l.startswith('data: ')]
text = '\n'.join(lines) if lines else data
# JSON 내부 text 필드 값 덤프
matches = re.findall(r'\"text\":\"((?:[^\"\\\\]|\\\\.)*)\"', text)
for m in matches[:5]:
    print(m[:2000])
" 2>/dev/null | head -300
```

## Step 3 — 디자인 분석

응답에서 다음을 파악한다:

- **레이아웃 구조**: 사이드바 / 헤더 / 메인 콘텐츠 영역 구분
- **색상 토큰**: primary, background, text, divider 등 hex 값
- **타이포그래피**: fontSize, fontWeight, color 조합
- **컴포넌트**: Card, Table, Button, Chip, Tab, Pagination, Form 등
- **간격**: padding, gap, border-radius 수치 (Figma 단위 → MUI sx px/숫자 변환: 4px = 0.5, 8px = 1)
- **상태**: hover, active, disabled, selected 스타일

## Step 4 — 컴포넌트 구현

### 파일 위치

`src/pages/<ComponentName>.tsx`

### 이 프로젝트의 코딩 컨벤션

```tsx
// 색상은 파일 상단 const로 선언
const PRIMARY_ORANGE = '#fa6600';
const DARK = '#272b2f';
const SECONDARY = '#737c85';
const DIVIDER = 'rgba(145,158,171,0.2)';
const PAGE_BG = '#f5f6f7';
const CARD_SHADOW = '0px 0px 2px 0px rgba(25,28,31,0.08), 0px 12px 24px -4px rgba(25,28,31,0.06)';

// MUI sx prop으로 스타일, 별도 styled() 사용 안 함
// 반복 컴포넌트는 함수로 분리 (예: statusChip)
// 상태는 useState, 목업 데이터는 파일 상단 const 배열
// 횡스크롤이 필요한 테이블: TableContainer에 overflowX:'auto', Table에 minWidth 지정
// 고정 액션 버튼: position:'fixed', bottom:32, right:32, zIndex:1200
```

### MUI import 패턴

```tsx
import {
  Box, Typography, Card, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tabs, Tab, Chip,
  IconButton, Divider, TextField, Select, MenuItem,
  FormControl, InputAdornment, ...
} from '@mui/material';
import SomeIcon from '@mui/icons-material/SomeName';
```

### App.tsx 연결 (필요 시)

생성 후 사용자에게 `src/App.tsx`에서 import하는 방법을 안내한다.

## Step 5 — 검증

```bash
# TypeScript 에러 확인
npx tsc --noEmit 2>&1 | head -30

# 개발 서버 기동 확인 (이미 실행 중이면 생략)
# npm run dev
```

에러가 있으면 수정 후 재검증한다.

## 완료 보고

- 생성된 파일 경로
- 주요 컴포넌트 목록
- `App.tsx`에서 연결하는 방법 (현재 연결 여부 포함)
- Figma와 다르게 구현된 부분이 있으면 이유와 함께 명시
