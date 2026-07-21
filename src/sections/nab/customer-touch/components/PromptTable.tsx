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
import { DARK, DIVIDER, PRIMARY_ORANGE, SECONDARY } from '../../../../theme';
import type { PromptRow } from '../type';
import PromptEmptyState from './PromptEmptyState';

const COLUMNS = ['NO', '콘텐츠 ID', '유형', '카테고리', '프롬프트명', '등록일', '수정일', '최종 수정자'];

interface Props {
  rows: PromptRow[];
  total: number;
  pageSize: string;
}

export default function PromptTable({ rows, total, pageSize }: Props) {
  return (
    <>
      {/* Results bar */}
      <Box sx={{ px: 2.5, pb: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
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
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f6f7' }}>
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
                key={row.no}
                sx={{ '&:hover': { bgcolor: 'rgba(245,246,247,0.8)', cursor: 'pointer' }, '& td': { borderBottom: `1px solid ${DIVIDER}` } }}
              >
                <TableCell align="center" sx={{ fontSize: 13, color: DARK, py: 1.5, px: 2 }}>{row.no}</TableCell>
                <TableCell align="center" sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2 }}>{row.contentsId}</TableCell>
                <TableCell align="center" sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2 }}>{row.type}</TableCell>
                <TableCell align="center" sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2 }}>{row.category}</TableCell>
                <TableCell align="center" sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2, maxWidth: 320 }}>
                  <Typography sx={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 320, mx: 'auto' }}>
                    {row.promptName}
                  </Typography>
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
