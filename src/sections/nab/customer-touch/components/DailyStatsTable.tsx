import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { DARK, DIVIDER, SECONDARY } from '../../_lib/tokens';
import type { PageSizeOption } from '../../_lib/PageSizeSelect';
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
}

/**
 * 일자 컬럼 폭 — 'yyyy-MM-dd' 가 한 줄로 들어가는 최소치.
 * 나머지 지표 컬럼은 폭을 지정하지 않아, table-layout:fixed 규칙에 따라 남는 폭을 똑같이 나눠 갖는다
 * (Figma 의 120 : 288·288… 비율을 고정 px 대신 유동 폭으로 재현한 것이다).
 */
const DATE_COLUMN_WIDTH = 120;

/** 지표 컬럼 하나가 라벨을 줄이지 않고 담는 최소 폭 — 이보다 좁아지면 가로 스크롤로 넘긴다 */
const METRIC_COLUMN_MIN_WIDTH = 130;

interface Props<T extends { date: string }> {
  rows: readonly T[];
  columns: readonly DailyStatsColumn<T>[];
  total: number;
  pageSize: number;
  onPageSizeChange: (value: PageSizeOption) => void;
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
  onPageSizeChange,
  onExcelDownload,
}: Props<T>) {
  // 카드 폭에 맞춰 늘어나되, 라벨이 뭉개질 만큼 좁아지면 그때만 가로 스크롤이 생긴다
  const minWidth = DATE_COLUMN_WIDTH + METRIC_COLUMN_MIN_WIDTH * (columns.length - 1);

  return (
    <>
      <StatisticsResultBar
        total={total}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        onExcelDownload={onExcelDownload}
      />

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ width: '100%', minWidth, tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'var(--nab-header-bg)' }}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align="center"
                  sx={col.key === 'date' ? { ...headCellSx, width: DATE_COLUMN_WIDTH } : headCellSx}
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
