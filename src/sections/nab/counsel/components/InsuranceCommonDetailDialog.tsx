import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { DARK, DIVIDER, FIELD_SX, POPUP_BG, PRIMARY_ORANGE, SECONDARY } from '../../_lib/tokens';
import type { InsuranceCommonRow } from '../type';
import { MOCK_REVIEW_HISTORY, OPERATION_STATUS_OPTIONS, TIME_OPTIONS } from '../constant';

interface Props {
  open: boolean;
  row: InsuranceCommonRow | null;
  onClose: () => void;
}

const sectionSx = {
  bgcolor: 'var(--nab-surface)',
  borderRadius: 2,
  p: 2.5,
} as const;

const labelSx = { fontSize: 12, fontWeight: 700, color: SECONDARY, mb: 0.5 } as const;
const valueSx = { fontSize: 14, color: DARK } as const;

const selectFieldSx = {
  fontSize: 14,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: DIVIDER },
  borderRadius: 2,
  height: 54,
} as const;

function BasicInfoTab({ row }: { row: InsuranceCommonRow }) {
  const [operationStatus, setOperationStatus] = useState<string>(row.operationStatus);
  const [effectiveDate, setEffectiveDate] = useState('2026.01.01');
  const [effectiveTime, setEffectiveTime] = useState('00:00');
  const [endDate, setEndDate] = useState('2027.12.31');
  const [endTime, setEndTime] = useState('24:00');
  const [noEndDate, setNoEndDate] = useState(true);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* 운영 설정 */}
      <Box sx={{ ...sectionSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="문서번호"
            value={row.no.toLocaleString()}
            disabled
            InputLabelProps={{ shrink: true }}
            sx={{ ...FIELD_SX, flex: 1 }}
          />
          <FormControl sx={{ flex: 1, ...FIELD_SX }}>
            <InputLabel shrink sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY }}>운영상태</InputLabel>
            <Select
              value={operationStatus}
              label="운영상태"
              onChange={(e) => setOperationStatus(e.target.value)}
              sx={selectFieldSx}
            >
              {OPERATION_STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            label="반영일자"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ endAdornment: (
              <InputAdornment position="end">
                <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: SECONDARY }} />
              </InputAdornment>
            ) }}
            sx={{ ...FIELD_SX, flex: 1 }}
          />
          <FormControl sx={{ flex: 1, ...FIELD_SX }}>
            <InputLabel shrink sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY }}>반영일시</InputLabel>
            <Select value={effectiveTime} label="반영일시" onChange={(e) => setEffectiveTime(e.target.value)} sx={selectFieldSx}>
              {TIME_OPTIONS.map((opt) => (<MenuItem key={opt} value={opt}>{opt}</MenuItem>))}
            </Select>
          </FormControl>
          {!noEndDate && (
            <>
              <Typography sx={{ fontSize: 12, color: SECONDARY, flexShrink: 0 }}>~</Typography>
              <TextField
                label="종료일자"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{ endAdornment: (
                  <InputAdornment position="end">
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: SECONDARY }} />
                  </InputAdornment>
                ) }}
                sx={{ ...FIELD_SX, flex: 1 }}
              />
              <FormControl sx={{ flex: 1, ...FIELD_SX }}>
                <InputLabel shrink sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY }}>종료일시</InputLabel>
                <Select value={endTime} label="종료일시" onChange={(e) => setEndTime(e.target.value)} sx={selectFieldSx}>
                  {TIME_OPTIONS.map((opt) => (<MenuItem key={opt} value={opt}>{opt}</MenuItem>))}
                </Select>
              </FormControl>
            </>
          )}
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={noEndDate}
              onChange={(e) => setNoEndDate(e.target.checked)}
              sx={{ color: 'var(--nab-text-disabled)', '&.Mui-checked': { color: DARK } }}
            />
          }
          label={<Typography sx={{ fontSize: 14, color: DARK }}>종료일자 미지정</Typography>}
        />
      </Box>

      {/* 문서명 */}
      <Box sx={sectionSx}>
        <Typography sx={labelSx}>문서명</Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: DARK }}>{row.documentName}</Typography>
      </Box>

      {/* 등록 정보 */}
      <Box sx={{ ...sectionSx, display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={labelSx}>등록자</Typography>
          <Typography sx={valueSx}>{row.registrantName}</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={labelSx}>등록자 소속</Typography>
          <Typography sx={valueSx}>{row.registrantDept}</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={labelSx}>등록일자</Typography>
          <Typography sx={valueSx}>{row.registeredAt}</Typography>
        </Box>
      </Box>

      {/* 마지막 수정 정보 */}
      <Box sx={{ ...sectionSx, display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={labelSx}>마지막 수정자</Typography>
          <Typography sx={valueSx}>{row.registrantName}</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={labelSx}>마지막 수정자 소속</Typography>
          <Typography sx={valueSx}>{row.registrantDept}</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={labelSx}>마지막 수정일자</Typography>
          <Typography sx={valueSx}>{row.registeredAt}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function HistoryRow({ entry }: { entry: (typeof MOCK_REVIEW_HISTORY)[number] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Box sx={{ borderBottom: `1px solid ${DIVIDER}` }}>
      <Box
        onClick={() => setExpanded((v) => !v)}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5, cursor: 'pointer' }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: DARK }}>{entry.changedAt}</Typography>
        <Typography sx={{ fontSize: 14, color: SECONDARY, flex: 1 }}>{entry.editor}</Typography>
        {expanded
          ? <KeyboardArrowUpIcon sx={{ fontSize: 20, color: SECONDARY }} />
          : <KeyboardArrowDownIcon sx={{ fontSize: 20, color: SECONDARY }} />}
      </Box>
      {expanded && (
        <Box sx={{ pb: 1.5, pl: 0.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {entry.changes.map((change) => (
            <Typography key={change} sx={{ fontSize: 14, color: DARK }}>• {change}</Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function InsuranceCommonDetailDialog({ open, row, onClose }: Props) {
  const [tab, setTab] = useState(0);

  // 다른 행을 열 때마다 기본 정보 탭으로 초기화
  useEffect(() => {
    if (open) {
      setTab(0);
    }
  }, [open, row?.id]);

  if (!row) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, width: 720, maxWidth: 720 } }}
    >
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 3 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: DARK }}>보험공통 문서 상세</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon sx={{ fontSize: 20, color: SECONDARY }} />
        </IconButton>
      </Box>

      {/* 탭 */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          px: 3,
          borderBottom: `1px solid ${DIVIDER}`,
          '& .MuiTabs-indicator': { display: 'none' },
          '& .MuiTab-root': {
            fontSize: 14, fontWeight: 700, color: SECONDARY,
            minHeight: 48, mb: '-1px',
            borderRadius: '8px 8px 0 0',
            border: '1px solid transparent',
          },
          '& .Mui-selected': {
            color: `${PRIMARY_ORANGE} !important`,
            bgcolor: POPUP_BG,
            borderColor: DIVIDER,
            borderBottomColor: POPUP_BG,
            position: 'relative',
            zIndex: 1,
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '-2px',
              height: '3px',
              backgroundColor: POPUP_BG,
            },
          },
        }}
      >
        <Tab label="기본 정보" />
        <Tab label="수정 이력" />
      </Tabs>

      {/* 본문 */}
      <Box sx={{ px: 3, py: 2.5, maxHeight: 560, overflow: 'auto', bgcolor: POPUP_BG }}>
        {tab === 0
          ? <BasicInfoTab row={row} />
          : (
            <Box sx={sectionSx}>
              {MOCK_REVIEW_HISTORY.map((entry) => (
                <HistoryRow key={entry.id} entry={entry} />
              ))}
            </Box>
          )}
      </Box>

      {/* 하단 액션 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2.5, borderTop: `1px solid ${DIVIDER}` }}>
        <Button
          variant="outlined"
          sx={{
            height: 40, px: 2, borderRadius: 2, fontSize: 14, fontWeight: 500,
            color: 'var(--nab-label-red-fg)', borderColor: 'var(--nab-label-red-fg)',
            bgcolor: 'var(--nab-label-red-bg)',
            '&:hover': { borderColor: 'var(--nab-label-red-fg)', bgcolor: 'var(--nab-label-red-bg)' },
          }}
        >
          문서 삭제
        </Button>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            sx={{
              height: 40, px: 2, borderRadius: 2, fontSize: 14, fontWeight: 400,
              color: DARK, borderColor: 'var(--nab-border-strong)',
              '&:hover': { borderColor: SECONDARY, bgcolor: 'transparent' },
            }}
          >
            문서 다운로드
          </Button>
          <Button
            variant="contained"
            sx={{
              height: 40, px: 2, borderRadius: 2, fontSize: 14, fontWeight: 500,
              bgcolor: 'var(--nab-button)', color: 'white', boxShadow: 'none',
              '&:hover': { bgcolor: 'var(--nab-button-hover)', boxShadow: 'none' },
            }}
          >
            변경내용 저장
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
