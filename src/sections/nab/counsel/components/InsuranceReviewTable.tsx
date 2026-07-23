import {
  Box,
  Checkbox,
  Divider,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { DARK, DIVIDER, PRIMARY_ORANGE, SECONDARY } from '../../_lib/tokens';
import type { InsuranceReviewRow } from '../type';
import { REVIEW_MANAGING_DEPT } from '../constant';
import DocumentStatusChip from './DocumentStatusChip';
import DocumentEmptyState from './DocumentEmptyState';

const COLUMNS = ['번호', '문서명', '등록자', '등록일자', '반영/종료일자', '운영상태'];
const COL_COUNT = COLUMNS.length + 1; // + 체크박스

interface Props {
  rows: InsuranceReviewRow[];
  total: number;
  pageSize: number;
  selectedIds: ReadonlySet<number>;
  onToggle: (id: number) => void;
  onToggleAll: () => void;
  onDocumentClick: (row: InsuranceReviewRow) => void;
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
} as const;

export default function InsuranceReviewTable({
  rows, total, pageSize, selectedIds, onToggle, onToggleAll, onDocumentClick,
}: Props) {
  const allChecked = rows.length > 0 && rows.every((row) => selectedIds.has(row.id));
  const someChecked = rows.some((row) => selectedIds.has(row.id));

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
        <Typography sx={{ fontSize: 14, color: SECONDARY }}>
          관리 부서 : {REVIEW_MANAGING_DEPT}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: DIVIDER }} />

      {/* 테이블 */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1080 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'var(--nab-header-bg)' }}>
              <TableCell padding="checkbox" sx={{ borderBottom: `1px solid ${DIVIDER}`, pl: 1 }}>
                <Checkbox
                  size="small"
                  checked={allChecked}
                  indeterminate={!allChecked && someChecked}
                  onChange={onToggleAll}
                  sx={{ color: 'var(--nab-text-disabled)', '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: PRIMARY_ORANGE } }}
                />
              </TableCell>
              {COLUMNS.map((col) => (
                <TableCell key={col} align="center" sx={headCellSx}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COL_COUNT} sx={{ p: 2, border: 'none' }}>
                  <DocumentEmptyState />
                </TableCell>
              </TableRow>
            ) : rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:hover': { bgcolor: 'var(--nab-row-hover)' }, '& td': { borderBottom: `1px solid ${DIVIDER}` } }}
              >
                <TableCell padding="checkbox" sx={{ pl: 1 }}>
                  <Checkbox
                    size="small"
                    checked={selectedIds.has(row.id)}
                    onChange={() => onToggle(row.id)}
                    sx={{ color: 'var(--nab-text-disabled)', '&.Mui-checked': { color: PRIMARY_ORANGE } }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ ...bodyCellSx, whiteSpace: 'nowrap' }}>{row.no.toLocaleString()}</TableCell>
                <TableCell sx={{ ...bodyCellSx, minWidth: 520 }}>
                  <Link
                    component="button"
                    type="button"
                    underline="always"
                    onClick={() => onDocumentClick(row)}
                    sx={{
                      fontSize: 14, color: DARK, textAlign: 'left', display: 'block',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%',
                    }}
                  >
                    {row.documentName}
                  </Link>
                </TableCell>
                <TableCell align="center" sx={{ ...bodyCellSx, whiteSpace: 'nowrap' }}>
                  <Typography sx={{ fontSize: 14, color: DARK }}>{row.registrantName}</Typography>
                  <Typography sx={{ fontSize: 14, color: SECONDARY }}>{row.registrantDept}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ ...bodyCellSx, whiteSpace: 'nowrap' }}>{row.registeredAt}</TableCell>
                <TableCell align="center" sx={{ ...bodyCellSx, whiteSpace: 'nowrap' }}>
                  <Typography sx={{ fontSize: 14, color: DARK }}>{row.effectiveStart}</Typography>
                  <Typography sx={{ fontSize: 14, color: SECONDARY }}>{row.effectiveEnd}</Typography>
                </TableCell>
                <TableCell align="center" sx={bodyCellSx}>
                  <DocumentStatusChip status={row.operationStatus} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
