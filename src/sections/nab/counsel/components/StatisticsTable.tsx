import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { DARK, DIVIDER, PRIMARY_ORANGE, SECONDARY } from '../../_lib/tokens';
import type { StatisticsRow } from '../type';
import DocumentEmptyState from './DocumentEmptyState';
import EllipsisText from './EllipsisText';

interface Column {
  key: keyof StatisticsRow;
  label: string;
  width: number;
  align?: 'left' | 'center';
}

const COLUMNS: Column[] = [
  // 일시는 'YYYY.MM.DD HH:MM' 이 항상 다 보여야 해서 말줄임이 걸리지 않을 폭을 준다
  { key: 'datetime', label: '일시', width: 148, align: 'center' },
  { key: 'userId', label: '사용자(ID)', width: 110, align: 'center' },
  { key: 'division', label: '사업본부', width: 108 },
  { key: 'region', label: '권역', width: 100 },
  { key: 'district', label: '지역단', width: 108 },
  { key: 'branch', label: '지점', width: 108 },
  { key: 'roomId', label: '룸ID', width: 80, align: 'center' },
  { key: 'screen', label: '화면', width: 100, align: 'center' },
  { key: 'code', label: '코드', width: 80, align: 'center' },
  { key: 'question', label: '질문', width: 280 },
  { key: 'answer', label: '답변', width: 280 },
  { key: 'model', label: '생성 모델', width: 120, align: 'center' },
  { key: 'elapsedSec', label: '소요시간(초)', width: 110, align: 'center' },
  { key: 'cost', label: '비용(달러)', width: 110, align: 'center' },
  { key: 'feedback', label: '피드백', width: 90, align: 'center' },
  { key: 'feedbackReason', label: '피드백 사유', width: 120, align: 'center' },
];

const TABLE_MIN_WIDTH = COLUMNS.reduce((sum, col) => sum + col.width, 0);

/** 셀 좌우 여백(px 2 → 16px씩) — 컬럼 폭에서 빼야 내용 영역 폭이 나온다 */
const CELL_PADDING_X = 32;

interface Props {
  rows: StatisticsRow[];
  total: number;
  pageSize: number;
  onExcelDownload: () => void;
}

const headCellSx = {
  fontSize: 14,
  fontWeight: 700,
  color: SECONDARY,
  py: 2,
  px: 2,
  borderBottom: `1px solid ${DIVIDER}`,
  whiteSpace: 'nowrap',
} as const;

const bodyCellSx = {
  fontSize: 14,
  color: DARK,
  py: 2,
  px: 2,
  whiteSpace: 'nowrap',
} as const;

export default function StatisticsTable({ rows, total, pageSize, onExcelDownload }: Props) {
  return (
    <>
      {/* 결과 바 */}
      <Box sx={{ px: 2.5, pb: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 14, color: SECONDARY }}>
            총{' '}
            <Box component="strong" sx={{ color: PRIMARY_ORANGE, fontWeight: 700 }}>
              {total.toLocaleString()}
            </Box>{' '}
            건
          </Typography>
          <Box sx={{ pl: 2, display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
            <Typography sx={{ fontSize: 14, color: DARK }}>{pageSize}건</Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 16, color: DARK }} />
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={onExcelDownload}
          sx={{
            height: 36, px: 2, borderRadius: 2, fontSize: 14, fontWeight: 400,
            color: DARK, borderColor: 'var(--nab-border-strong)',
            '&:hover': { borderColor: SECONDARY, bgcolor: 'transparent' },
          }}
        >
          엑셀 다운로드
        </Button>
      </Box>
      <Divider sx={{ borderColor: DIVIDER }} />

      {/* 테이블 (가로 스크롤) */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: TABLE_MIN_WIDTH }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'var(--nab-header-bg)' }}>
              {COLUMNS.map((col) => (
                <TableCell key={col.key} align="center" sx={{ ...headCellSx, width: col.width, minWidth: col.width }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} sx={{ p: 2, pb: 0, border: 'none' }}>
                  <DocumentEmptyState />
                </TableCell>
              </TableRow>
            ) : rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:hover': { bgcolor: 'var(--nab-row-hover)' }, '& td': { borderBottom: `1px solid ${DIVIDER}` } }}
              >
                {COLUMNS.map((col) => (
                  <TableCell
                    key={col.key}
                    align={col.align === 'center' ? 'center' : 'left'}
                    sx={{ ...bodyCellSx, width: col.width, maxWidth: col.width }}
                  >
                    <EllipsisText
                      text={String(row[col.key])}
                      maxWidth={col.width - CELL_PADDING_X}
                      align={col.align === 'center' ? 'center' : 'left'}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
