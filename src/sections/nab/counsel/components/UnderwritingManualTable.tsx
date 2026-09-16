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
  TableSortLabel,
  Typography,
} from '@mui/material';
import { DARK, DIVIDER, PRIMARY_ORANGE, SECONDARY, SORT_LABEL_SX } from '../../_lib/tokens';
import PageSizeSelect from '../../_lib/PageSizeSelect';
import type { PageSizeOption } from '../../_lib/PageSizeSelect';
import type { ManualSortBy, SortDirection } from '../../../../api/nab/counsel-backoffice';
import type { UnderwritingManualRow } from '../type';
import { UNDERWRITING_MANAGING_DEPT } from '../constant';
import DocumentStatusChip from './DocumentStatusChip';
import DocumentEmptyState from './DocumentEmptyState';

/** sortBy 가 있는 컬럼만 정렬할 수 있다 (API 가 받는 정렬기준) */
interface Column {
  label: string;
  sortBy?: ManualSortBy;
  /** Figma Table/DOC/002 지정 폭(px). 없으면 남는 폭을 가져간다 */
  width?: number;
  minWidth?: number;
}

const COLUMNS: Column[] = [
  // 체크박스 셀(48) + 번호 = Figma 의 번호 셀 148
  { label: '번호', sortBy: 'nabCuslManlDcmtId', width: 100 },
  { label: '분류', width: 120, minWidth: 100 },
  { label: '문서명', sortBy: 'manlNm', minWidth: 520 },
  { label: '등록자', width: 150 },
  { label: '등록일자', sortBy: 'rgstDttm', width: 120 },
  // 반영/종료일자 정렬은 유효시작일시(valdStarDttm) 기준이다
  { label: '반영/종료일자', sortBy: 'valdStarDttm', width: 180 },
  { label: '운영상태', width: 84 },
];

/** 컬럼 폭 합 — 이보다 좁아지면 가로 스크롤로 넘긴다 (문서명 최소 520 을 지키기 위함) */
const TABLE_MIN_WIDTH = 48 + 100 + 120 + 520 + 150 + 120 + 180 + 84;
const COL_COUNT = COLUMNS.length + 1; // + 체크박스

interface Props {
  rows: UnderwritingManualRow[];
  total: number;
  pageSize: number;
  onPageSizeChange: (value: PageSizeOption) => void;
  selectedIds: ReadonlySet<number>;
  onToggle: (id: number) => void;
  onToggleAll: () => void;
  /** 현재 정렬기준 */
  sortBy: ManualSortBy;
  /** 현재 정렬방향 — 아래 화살표가 내림차순(DESC) */
  sortDir: SortDirection;
  onSortChange: (sortBy: ManualSortBy, sortDir: SortDirection) => void;
  onDocumentClick: (row: UnderwritingManualRow) => void;
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

export default function UnderwritingManualTable({
  rows, total, pageSize, onPageSizeChange, selectedIds, onToggle, onToggleAll, onDocumentClick,
  sortBy, sortDir, onSortChange,
}: Props) {
  // MUI 는 소문자 방향을 쓴다
  const sortDirection = sortDir === 'ASC' ? 'asc' : 'desc';

  /** 같은 컬럼을 다시 누르면 방향만 뒤집고, 다른 컬럼이면 내림차순부터 시작한다 */
  const handleSort = (next: ManualSortBy) => {
    onSortChange(next, next === sortBy && sortDir === 'DESC' ? 'ASC' : 'DESC');
  };

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
          <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
        </Box>
        <Typography sx={{ fontSize: 14, color: SECONDARY }}>
          관리 부서 : {UNDERWRITING_MANAGING_DEPT}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: DIVIDER }} />

      {/* 테이블 */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: TABLE_MIN_WIDTH }}>
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
                <TableCell
                  key={col.label}
                  align="center"
                  sx={{ ...headCellSx, width: col.width, minWidth: col.minWidth ?? col.width }}
                  sortDirection={col.sortBy === sortBy ? sortDirection : false}
                >
                  {col.sortBy ? (
                    <TableSortLabel
                      active={col.sortBy === sortBy}
                      direction={col.sortBy === sortBy ? sortDirection : 'desc'}
                      onClick={() => handleSort(col.sortBy!)}
                      sx={SORT_LABEL_SX}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COL_COUNT} sx={{ p: 2, pb: 0, border: 'none' }}>
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
                <TableCell align="center" sx={{ ...bodyCellSx, whiteSpace: 'nowrap' }}>{row.category}</TableCell>
                <TableCell sx={{ ...bodyCellSx, minWidth: 520 }}>
                  <Link
                    component="button"
                    type="button"
                    underline="always"
                    onClick={() => onDocumentClick(row)}
                    sx={{
                      // MUI 기본 밑줄색은 primary 40% 라 글자색(검정)과 맞춰 준다
                      textDecorationColor: 'currentColor',
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
