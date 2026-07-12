---
description: Figma 디자인 URL을 받아 Figma MCP로 디자인 데이터를 가져오고 React + MUI 컴포넌트로 구현한다. 구현 후 반드시 컴포넌트 단위로 파일 분리까지 완료한다.
---

# figma-to-mui

Figma 화면 URL을 입력받아 Figma Dev Mode MCP Server에서 디자인 데이터를 가져오고,
이 프로젝트(Vite + React + TypeScript + MUI v5)의 스타일 컨벤션에 맞게 페이지 컴포넌트를 생성한다.
**구현 후 반드시 컴포넌트 단위 파일 분리까지 완료한다 — 파일 분리 없이 완료 보고하지 않는다.**

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

## Step 4 — 컴포넌트 구현 + 파일 분리

### 폴더 구조 (필수)

페이지 단위 화면은 반드시 폴더로 분리한다:

```
src/pages/<PageName>/
  index.tsx          메인 페이지 (상태 관리 + 레이아웃 조립만)
  constants.ts       색상 상수 (PRIMARY_ORANGE, DARK, SECONDARY 등) + 공용 sx
  types.ts           인터페이스 + 목업 데이터
  <Name>Tabs.tsx     탭 영역
  <Name>Filter.tsx   필터/검색 영역
  <Name>Table.tsx    결과 바 + 테이블 (빈 상태 포함)
  <Name>Pagination.tsx 페이지네이션
  <Name>EmptyState.tsx 데이터 없음 상태 (테이블 내 colSpan 방식)
```

공통 컴포넌트는 `src/components/`에 위치한다:
- `Sidebar.tsx` — 이미 존재, `NavSection[]` props로 재사용
- `Header.tsx` — 페이지별 헤더가 동일하면 공통으로 추출

### 분리 기준

| 기준 | 분리 여부 |
|---|---|
| 탭 영역 | 항상 분리 |
| 필터/검색 영역 | 항상 분리 |
| 결과 바 + 테이블 | 항상 분리 (EmptyState 포함) |
| 페이지네이션 | 항상 분리 |
| 색상 상수 | 항상 `constants.ts`로 분리 |
| 타입 + 목업 데이터 | 항상 `types.ts`로 분리 |
| Sidebar / Header | 여러 페이지에서 공유 시 `src/components/`로 분리 |
| 다이얼로그/모달 | `src/components/`에 별도 파일로 분리 |

### index.tsx 역할

`index.tsx`는 상태(useState)와 레이아웃 조립만 담당한다. 렌더링 로직은 서브 컴포넌트에 위임한다:

```tsx
export default function PageName() {
  const [tabValue, setTabValue] = useState(0);
  // ... 기타 상태

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar open={sidebarOpen} onToggle={...} sections={NAV_SECTIONS} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header />
        <Box sx={{ flex: 1, overflow: 'auto', px: 5, pb: 11 }}>
          {/* Breadcrumb + Title */}
          <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
            <PageTabs value={tabValue} onChange={setTabValue} />
            <PageFilter ... />
            <PageTable rows={rows} total={TOTAL} pageSize={PAGE_SIZE} />
            <PagePagination page={page} onChange={setPage} />
          </Card>
        </Box>
      </Box>
      {/* FAB */}
    </Box>
  );
}
```

### 이 프로젝트의 코딩 컨벤션

```tsx
// 색상은 constants.ts에 선언
export const PRIMARY_ORANGE = '#fa6600';
export const DARK = '#272b2f';
export const SECONDARY = '#737c85';
export const DISABLED = '#8c959d';
export const DIVIDER = 'rgba(145,158,171,0.2)';
export const CARD_SHADOW = '0px 0px 2px 0px rgba(25,28,31,0.08), 0px 12px 24px -4px rgba(25,28,31,0.06)';
export const FIELD_SX = { /* 공용 TextField/Select sx */ } as const;

// MUI sx prop으로 스타일, 별도 styled() 사용 안 함
// 반복 컴포넌트는 함수로 분리
// 횡스크롤이 필요한 테이블: TableContainer에 overflowX:'auto', Table에 minWidth 지정
// Pagination은 Card 안에 위치
// 고정 액션 버튼: position:'fixed', bottom:32, right:32, zIndex:1200
// 빈 상태: rows.length === 0 이면 TableBody 안에 colSpan으로 EmptyState 렌더링
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

## Step 5 — 검증

```bash
# TypeScript 에러 확인
npx tsc --noEmit 2>&1 | head -30
```

에러가 있으면 수정 후 재검증한다. App.tsx의 기존 미사용 import 에러는 무시한다.

## 완료 보고

- 생성된 파일 목록 (폴더 트리 형태)
- 각 파일의 역할 한 줄 요약
- `App.tsx`에서 연결하는 방법
- Figma와 다르게 구현된 부분이 있으면 이유와 함께 명시
