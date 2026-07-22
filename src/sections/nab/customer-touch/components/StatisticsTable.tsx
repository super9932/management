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
import { STAT_GROUPS } from '../constant';
import type { StatRow } from '../type';
import StatisticsEmptyState from './StatisticsEmptyState';

interface Props {
  rows: StatRow[];
  total: number;
  pageSize: string;
  /** 그룹별 지표 목록 (탭에 따라 달라짐) */
  metrics: readonly string[];
}

const headCellSx = {
  fontSize: 14,
  fontWeight: 700,
  color: SECONDARY,
  py: 1.5,
  px: 2,
  borderBottom: `1px solid ${DIVIDER}`,
  whiteSpace: 'nowrap',
} as const;

export default function StatisticsTable({ rows, total, pageSize, metrics }: Props) {
  const colCount = 1 + STAT_GROUPS.length * metrics.length;
  // 일자(120) + 그룹별 (지표수 × 140)
  const minWidth = 120 + STAT_GROUPS.length * metrics.length * 140;

  return (
    <>
      {/* Results bar */}
      <Box sx={{ px: 2.5, pb: 1.5, pt: 0.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 14, color: SECONDARY }}>
            총 <strong style={{ color: PRIMARY_ORANGE }}>{total.toLocaleString()}</strong> 건
          </Typography>
          <Box sx={{ pl: 2, display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
            <Typography sx={{ fontSize: 14, color: DARK }}>{pageSize}건</Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 16, color: DARK }} />
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
          sx={{
            height: 36, px: 1.5, borderRadius: 2, fontSize: 14, fontWeight: 400,
            color: DARK, borderColor: 'rgba(140,149,157,0.48)',
            '&:hover': { borderColor: SECONDARY, bgcolor: 'transparent' },
          }}
        >
          엑셀 다운로드
        </Button>
      </Box>
      <Divider sx={{ borderColor: DIVIDER }} />

      {/* Table */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth }}>
          <TableHead>
            {/* 그룹 헤더 */}
            <TableRow sx={{ bgcolor: '#f5f6f7' }}>
              <TableCell
                align="center"
                rowSpan={2}
                sx={{ ...headCellSx, borderRight: `1px solid ${DIVIDER}` }}
              >
                일자
              </TableCell>
              {STAT_GROUPS.map((group) => (
                <TableCell
                  key={group}
                  align="center"
                  colSpan={metrics.length}
                  sx={{ ...headCellSx, borderRight: `1px solid ${DIVIDER}` }}
                >
                  {group}
                </TableCell>
              ))}
            </TableRow>
            {/* 지표 헤더 */}
            <TableRow sx={{ bgcolor: '#f5f6f7' }}>
              {STAT_GROUPS.map((group) =>
                metrics.map((metric, mi) => (
                  <TableCell
                    key={`${group}-${metric}`}
                    align="center"
                    sx={{
                      ...headCellSx,
                      fontSize: 12,
                      borderRight: mi === metrics.length - 1 ? `1px solid ${DIVIDER}` : undefined,
                    }}
                  >
                    {metric}
                  </TableCell>
                ))
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colCount} sx={{ p: 2, border: 'none' }}>
                  <StatisticsEmptyState />
                </TableCell>
              </TableRow>
            ) : rows.map((row) => (
              <TableRow
                key={row.date}
                sx={{ '&:hover': { bgcolor: 'rgba(245,246,247,0.8)' }, '& td': { borderBottom: `1px solid ${DIVIDER}` } }}
              >
                <TableCell align="center" sx={{ fontSize: 13, color: DARK, py: 1.5, px: 2, whiteSpace: 'nowrap', borderRight: `1px solid ${DIVIDER}` }}>
                  {row.date}
                </TableCell>
                {row.cells.map((cell, ci) => (
                  <TableCell
                    key={ci}
                    align="center"
                    sx={{
                      fontSize: 13, color: DARK, py: 1.5, px: 2, whiteSpace: 'nowrap',
                      borderRight: (ci + 1) % metrics.length === 0 ? `1px solid ${DIVIDER}` : undefined,
                    }}
                  >
                    {cell}
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
