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
import type { StipulationSortBy, SortDirection } from '../../../../api/nab/counsel-backoffice';
import type { DocumentRow } from '../type';
import { MANAGING_DEPT } from '../constant';
import DocumentStatusChip from './DocumentStatusChip';
import DocumentEmptyState from './DocumentEmptyState';
import EllipsisText from './EllipsisText';

/** 보종코드 컬럼 폭 (Figma Table/DOC/001) — 코드가 여러 개여도 한 줄로 줄이고 나머지는 툴팁으로 보여준다 */
const PRODUCT_CODE_WIDTH = 180;
/** 목록 매핑(toDisplayDate)이 값 없음을 나타낼 때 쓰는 표기 */
const BLANK_DATE = '-';

/** 셀 좌우 여백(px 2 → 16px씩) */
const CELL_PADDING_X = 32;

/** 지정 폭 합(+ 체크박스·번호·운영상태 어림) — 이보다 좁아지면 가로 스크롤로 넘긴다 */
const TABLE_MIN_WIDTH = 48 + 100 + PRODUCT_CODE_WIDTH + 120 + 520 + 150 + 120 + 84;

/** sortBy 가 있는 컬럼만 정렬할 수 있다 (Figma 5673:177605 의 화살표 = API 가 받는 정렬기준) */
interface Column {
  label: string;
  sortBy?: StipulationSortBy;
  /** Figma Table/DOC/001 지정 폭. 없으면 내용에 맞춰 잡힌다 */
  width?: number | string;
  minWidth?: number;
}

const COLUMNS: Column[] = [
  // 번호·운영상태는 Figma 에서도 폭 지정 없이 내용에 맞춘다
  { label: '번호', sortBy: 'nabCuslIsrnStplDcmtId' },
  { label: '보종코드', width: PRODUCT_CODE_WIDTH },
  { label: '판매기간', sortBy: 'saleStarDate', width: 120 },
  // 남는 폭을 모두 가져간다 (Figma 의 flex-grow + min 520)
  { label: '문서명', sortBy: 'pdfDcmtFileNm', minWidth: 520, width: '100%' },
  { label: '등록자', width: 150 },
  { label: '등록일자', sortBy: 'rgstDttm', width: 120 },
  { label: '운영상태' },
];
const COL_COUNT = COLUMNS.length + 1; // + 체크박스

interface Props {
  rows: DocumentRow[];
  total: number;
  pageSize: number;
  onPageSizeChange: (value: PageSizeOption) => void;
  selectedIds: ReadonlySet<number>;
  onToggle: (id: number) => void;
  onToggleAll: () => void;
  onDocumentClick: (row: DocumentRow) => void;
  /** 현재 정렬기준 */
  sortBy: StipulationSortBy;
  /** 현재 정렬방향 — 아래 화살표가 내림차순(DESC) */
  sortDir: SortDirection;
  onSortChange: (sortBy: StipulationSortBy, sortDir: SortDirection) => void;
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


export default function DocumentTable({
  rows, total, pageSize, onPageSizeChange, selectedIds, onToggle, onToggleAll, onDocumentClick,
  sortBy, sortDir, onSortChange,
}: Props) {
  // MUI 는 소문자 방향을 쓴다
  const sortDirection = sortDir === 'ASC' ? 'asc' : 'desc';

  /** 같은 컬럼을 다시 누르면 방향만 뒤집고, 다른 컬럼이면 내림차순부터 시작한다 */
  const handleSort = (next: StipulationSortBy) => {
    if (next === sortBy) {
      onSortChange(next, sortDir === 'DESC' ? 'ASC' : 'DESC');
      return;
    }
    onSortChange(next, 'DESC');
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
          관리 부서 : {MANAGING_DEPT}
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
                <TableCell align="center" sx={{ ...bodyCellSx, width: PRODUCT_CODE_WIDTH, maxWidth: PRODUCT_CODE_WIDTH }}>
                  <EllipsisText
                    text={row.productCodes}
                    maxWidth={PRODUCT_CODE_WIDTH - CELL_PADDING_X}
                    align="center"
                  />
                </TableCell>
                {/* 판매기간 — 시작일에 물결을 붙이고, 종료일이 없으면 아랫줄을 아예 그리지 않는다 */}
                <TableCell align="center" sx={{ ...bodyCellSx, whiteSpace: 'nowrap' }}>
                  <Typography sx={{ fontSize: 14, color: DARK }}>
                    {row.salePeriodStart === BLANK_DATE ? BLANK_DATE : `${row.salePeriodStart} ~`}
                  </Typography>
                  {row.salePeriodEnd !== BLANK_DATE && (
                    <Typography sx={{ fontSize: 14, color: SECONDARY }}>{row.salePeriodEnd}</Typography>
                  )}
                </TableCell>
                {/* PDF 파일명 위, CSV 파일명 아래 — 판매기간·등록자와 같은 2줄 표기 */}
                <TableCell sx={{ ...bodyCellSx, width: '100%', minWidth: 520, maxWidth: 0 }}>
                  <Link
                    component="button"
                    type="button"
                    underline="always"
                    onClick={() => onDocumentClick(row)}
                    sx={{
                      fontSize: 14, color: DARK, textAlign: 'left', display: 'block',
                      // MUI 기본 밑줄색은 primary 40% 라 글자색(검정)과 맞춰 준다
                      textDecorationColor: 'currentColor',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%',
                    }}
                  >
                    {row.documentName}
                  </Link>
                  <Typography
                    sx={{
                      fontSize: 14, color: SECONDARY,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%',
                    }}
                  >
                    {row.csvDocumentName || '-'}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ ...bodyCellSx, whiteSpace: 'nowrap' }}>
                  <Typography sx={{ fontSize: 14, color: DARK }}>{row.registrantName}</Typography>
                  <Typography sx={{ fontSize: 14, color: SECONDARY }}>{row.registrantDept}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ ...bodyCellSx, whiteSpace: 'nowrap' }}>{row.registeredAt}</TableCell>
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
