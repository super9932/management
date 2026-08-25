import { Box, Button, Dialog, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DARK, DIVIDER, FIELD_SX, POPUP_BG, SECONDARY } from '../../_lib/tokens';
import type { DocumentRow } from '../type';

interface Props {
  open: boolean;
  row: DocumentRow | null;
  onClose: () => void;
}

/** 본문 카드 — 연회색 팝업 배경 위에 얹히는 흰 카드 */
const sectionSx = {
  bgcolor: 'var(--nab-surface)',
  borderRadius: 4,
  p: 2.5,
} as const;

/** 항목 라벨 — 카드 안 값 위에 붙는 회색 문구 */
const labelSx = { fontSize: 14, color: SECONDARY } as const;

/** 보종코드·문서명처럼 강조되는 값 */
const strongValueSx = { fontSize: 16, color: DARK } as const;

/** 등록 정보처럼 보조로 읽는 값 */
const valueSx = { fontSize: 14, color: DARK } as const;

/** 카드 안 열 — 마지막 열을 뺀 나머지 오른쪽에 점선 구분선을 둔다 */
const columnSx = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  borderRight: `1px dashed ${DIVIDER}`,
} as const;

const lastColumnSx = { ...columnSx, borderRight: 'none' } as const;

/** 약관 상세는 모든 입력칸이 읽기 전용이라 점선 테두리로 표시한다 */
const readOnlyFieldSx = {
  ...FIELD_SX,
  flex: 1,
  '& .MuiOutlinedInput-root': {
    ...FIELD_SX['& .MuiOutlinedInput-root'],
    '& fieldset': { borderStyle: 'dashed', borderColor: 'var(--nab-border)' },
    '&:hover fieldset': { borderStyle: 'dashed', borderColor: 'var(--nab-border)' },
  },
} as const;

/** 하단 액션 버튼 공통 — 높이 36 / radius 8 / 좌우 12 */
const actionButtonSx = {
  height: 36,
  minWidth: 64,
  px: 1.5,
  borderRadius: 2,
  fontSize: 14,
  fontWeight: 400,
} as const;

/** 목록 API가 CSV 파일명을 내려주지 않던 시절의 폴백 — 확장자만 바꿔 쓴다 */
const toCsvName = (pdfName: string): string => pdfName.replace(/\.pdf$/i, '.csv');

/**
 * 판매기간을 '시작 ~ 종료' 한 줄로 합친다.
 * 목록 데이터는 시작일에 물결(2008.04.01~)이 붙어 오기도 해서 붙여 쓰면 물결이 두 번 나온다.
 */
const formatSalePeriod = (start: string, end: string): string =>
  `${start.replace(/~\s*$/, '').trim()} ~ ${end.replace(/^\s*~/, '').trim()}`;

export default function InsuranceTermsDetailDialog({ open, row, onClose }: Props) {
  if (!row) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          width: 720,
          maxWidth: 720,
          // 헤더·본문이 같은 연회색 위에 놓이고, 하단 액션만 흰색으로 떨어진다.
          bgcolor: POPUP_BG,
          boxShadow: '-40px 40px 80px -8px rgba(0,0,0,0.24)',
        },
      }}
    >
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: 3, pr: 1.5, py: 3 }}>
        <Typography sx={{ flex: 1, fontSize: 18, fontWeight: 700, color: DARK }}>보험약관 문서 상세</Typography>
        <IconButton size="small" onClick={onClose} sx={{ width: 28, height: 28 }}>
          <CloseIcon sx={{ fontSize: 18, color: SECONDARY }} />
        </IconButton>
      </Box>

      {/* 본문 — 화면이 낮을 때만 스크롤한다 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          px: 3,
          pb: 3,
          maxHeight: 'min(640px, calc(100vh - 220px))',
          overflow: 'auto',
        }}
      >
        {/* 문서번호 / 운영상태 — 둘 다 조회 전용 */}
        <Box sx={{ ...sectionSx, display: 'flex', gap: 2 }}>
          <TextField
            label="문서번호"
            value={row.no.toLocaleString()}
            disabled
            InputLabelProps={{ shrink: true }}
            sx={readOnlyFieldSx}
          />
          <TextField
            label="운영상태"
            value={row.operationStatus}
            disabled
            InputLabelProps={{ shrink: true }}
            sx={readOnlyFieldSx}
          />
        </Box>

        {/* 보종코드 / 판매기간 */}
        <Box sx={sectionSx}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={columnSx}>
              <Typography sx={labelSx}>보종코드</Typography>
              <Typography sx={strongValueSx}>{row.productCodes}</Typography>
            </Box>
            <Box sx={lastColumnSx}>
              <Typography sx={labelSx}>판매기간</Typography>
              <Typography sx={strongValueSx}>
                {formatSalePeriod(row.salePeriodStart, row.salePeriodEnd)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* PDF / CSV 문서명 */}
        <Box sx={{ ...sectionSx, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={labelSx}>PDF 문서명</Typography>
            <Typography sx={strongValueSx}>{row.documentName}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={labelSx}>CSV 문서명</Typography>
            <Typography sx={strongValueSx}>{row.csvDocumentName ?? toCsvName(row.documentName)}</Typography>
          </Box>
        </Box>

        {/* 등록 정보 */}
        <Box sx={sectionSx}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={columnSx}>
              <Typography sx={labelSx}>등록자</Typography>
              <Typography sx={valueSx}>{row.registrantName}</Typography>
            </Box>
            <Box sx={columnSx}>
              <Typography sx={labelSx}>등록자 소속</Typography>
              <Typography sx={valueSx}>{row.registrantDept}</Typography>
            </Box>
            <Box sx={lastColumnSx}>
              <Typography sx={labelSx}>등록일자</Typography>
              <Typography sx={valueSx}>{row.registeredAt}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 하단 액션 — 약관 문서는 수정 없이 삭제·다운로드만 제공한다 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 3,
          bgcolor: 'var(--nab-surface)',
          borderTop: `1px solid ${DIVIDER}`,
        }}
      >
        <Button
          variant="text"
          sx={{
            ...actionButtonSx,
            color: 'var(--nab-label-red-fg)',
            bgcolor: 'var(--nab-label-red-bg)',
            '&:hover': { bgcolor: 'var(--nab-label-red-bg)' },
          }}
        >
          문서 삭제
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="outlined"
          sx={{
            ...actionButtonSx,
            color: DARK,
            borderColor: 'var(--nab-border-strong)',
            '&:hover': { borderColor: SECONDARY, bgcolor: 'transparent' },
          }}
        >
          문서 다운로드
        </Button>
      </Box>
    </Dialog>
  );
}
