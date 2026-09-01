import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { DARK, DIVIDER, SECONDARY } from '../../_lib/tokens';
import StatisticsEmptyState from './StatisticsEmptyState';
import StatisticsResultBar from './StatisticsResultBar';

/**
 * 일자별 통계 표 (Figma 4932:31810 · 6240:117006).
 *
 * 채널 그룹(전체·한금서·GA·라이프랩) 매트릭스를 쓰던 이전 양식이 없어지고
 * 두 탭 모두 '일자 + 지표'의 단일 헤더 표가 됐다. 지표만 다르므로 컬럼을 주입해 쓴다.
 */

/** 표 컬럼 — key 는 행 객체의 필드명이다 */
export interface DailyStatsColumn<T> {
  key: Extract<keyof T, string>;
  label: string;
  /** Figma 지정 폭(px) */
  width: number;
}

interface Props<T extends { date: string }> {
  rows: readonly T[];
  columns: readonly DailyStatsColumn<T>[];
  total: number;
  pageSize: string;
  onExcelDownload: () => void;
}

const headCellSx = {
  height: 56,
  fontSize: 14,
  fontWeight: 700,
  color: SECONDARY,
  py: 1,
  px: 2,
  borderBottom: `1px solid ${DIVIDER}`,
  whiteSpace: 'nowrap',
} as const;

const bodyCellSx = {
  fontSize: 14,
  lineHeight: '22px',
  color: DARK,
  py: 2,
  px: 2,
  whiteSpace: 'nowrap',
} as const;

export default function DailyStatsTable<T extends { date: string }>({
  rows,
  columns,
  total,
  pageSize,
  onExcelDownload,
}: Props<T>) {
  const minWidth = columns.reduce((sum, col) => sum + col.width, 0);

  return (
    <>
      <StatisticsResultBar total={total} pageSize={pageSize} onExcelDownload={onExcelDownload} />

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'var(--nab-header-bg)' }}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align="center"
                  sx={{ ...headCellSx, width: col.width, minWidth: col.width }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ p: 2, border: 'none' }}>
                  <StatisticsEmptyState />
                </TableCell>
              </TableRow>
            ) : rows.map((row) => (
              <TableRow
                key={row.date}
                sx={{
                  '&:hover': { bgcolor: 'var(--nab-row-hover)' },
                  '& td': { borderBottom: `1px solid ${DIVIDER}` },
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} align="center" sx={bodyCellSx}>
                    {String(row[col.key])}
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
