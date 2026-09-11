import {
  Box,
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
import { DARK, DIVIDER, PRIMARY_ORANGE, SECONDARY } from '../../_lib/tokens';
import PageSizeSelect from '../../_lib/PageSizeSelect';
import type { PageSizeOption } from '../../_lib/PageSizeSelect';
import type { PromptRow } from '../type';
import PromptEmptyState from './PromptEmptyState';

const COLUMNS = ['NO', '콘텐츠 ID', '유형', '카테고리', '프롬프트명', '등록일', '수정일', '최종 수정자'];

interface Props {
  rows: PromptRow[];
  total: number;
  pageSize: number;
  onPageSizeChange: (value: PageSizeOption) => void;
  /** 프롬프트명 클릭 — 수정 화면으로 이동한다 */
  onPromptClick: (row: PromptRow) => void;
}

export default function PromptTable({
  rows, total, pageSize, onPageSizeChange, onPromptClick,
}: Props) {
  return (
    <>
      {/* Results bar */}
      <Box sx={{ px: 2.5, pb: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 14, color: SECONDARY }}>
            총 <strong style={{ color: PRIMARY_ORANGE }}>{total.toLocaleString()}</strong> 건
          </Typography>
          <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
        </Box>
      </Box>
      <Divider sx={{ borderColor: DIVIDER }} />

      {/* Table */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'var(--nab-header-bg)' }}>
              {COLUMNS.map((col) => (
                <TableCell
                  key={col}
                  align="center"
                  sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY, py: 1.5, px: 2, borderBottom: `1px solid ${DIVIDER}`, whiteSpace: 'nowrap' }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} sx={{ p: 2, border: 'none' }}>
                  <PromptEmptyState />
                </TableCell>
              </TableRow>
            ) : rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:hover': { bgcolor: 'var(--nab-row-hover)', cursor: 'pointer' }, '& td': { borderBottom: `1px solid ${DIVIDER}` } }}
              >
                <TableCell align="center" sx={{ fontSize: 13, color: DARK, py: 1.5, px: 2 }}>{row.no}</TableCell>
                <TableCell align="center" sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2 }}>{row.contentsId}</TableCell>
                <TableCell align="center" sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2 }}>{row.type}</TableCell>
                <TableCell align="center" sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2 }}>{row.category}</TableCell>
                <TableCell align="center" sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2, maxWidth: 320 }}>
                  <Link
                    component="button"
                    type="button"
                    underline="none"
                    onClick={() => onPromptClick(row)}
                    sx={{
                      fontSize: 12, color: DARK, maxWidth: 320,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      display: 'block', mx: 'auto', textAlign: 'center', cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {row.promptName}
                  </Link>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2, whiteSpace: 'nowrap' }}>{row.registeredAt}</TableCell>
                <TableCell align="center" sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2, whiteSpace: 'nowrap' }}>{row.updatedAt}</TableCell>
                <TableCell align="center" sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2 }}>{row.lastEditor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
