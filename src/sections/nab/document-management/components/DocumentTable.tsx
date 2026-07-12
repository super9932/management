import {
  Box,
  Divider,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { DARK, DIVIDER, SECONDARY } from '../../../../theme';
import type { DocumentRow, RegistrationStatus, OperationStatus } from '../type';

function registrationStatusChip(status: RegistrationStatus) {
  const config = {
    진행: { color: '#1e5ad2', bg: 'rgba(30,90,210,0.08)' },
    실패: { color: '#a71313', bg: 'rgba(167,19,19,0.08)' },
    완료: { color: '#34745d', bg: 'rgba(52,116,93,0.08)' },
  };
  const { color, bg } = config[status];
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1, py: 0.25, borderRadius: '6px', bgcolor: bg }}>
      <Typography sx={{ fontSize: 12, color, fontWeight: 600 }}>{status}</Typography>
    </Box>
  );
}

function operationStatusChip(status: OperationStatus) {
  const config = {
    대기: { color: SECONDARY, bg: 'rgba(140,149,157,0.08)' },
    운영: { color: '#34745d', bg: 'rgba(52,116,93,0.08)' },
    미운영: { color: '#c0750c', bg: 'rgba(192,117,12,0.08)' },
  };
  const { color, bg } = config[status];
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1, py: 0.25, borderRadius: '6px', bgcolor: bg }}>
      <Typography sx={{ fontSize: 12, color, fontWeight: 600 }}>{status}</Typography>
    </Box>
  );
}

const COLUMNS = ['번호', '상품/보종코드', '판매기간', '문서명', '등록자', '등록일', '등록상태', '반영/종료일', '운영상태'];

interface Props {
  rows: DocumentRow[];
  total: number;
  loading?: boolean;
}

export default function DocumentTable({ rows, total, loading = false }: Props) {
  return (
    <>
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 14, color: SECONDARY }}>
          총 <strong style={{ color: DARK }}>{total.toLocaleString()}</strong>건
        </Typography>
      </Box>
      <Divider sx={{ borderColor: DIVIDER }} />
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f6f7' }}>
              {COLUMNS.map((col) => (
                <TableCell
                  key={col}
                  sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY, py: 1.5, px: 2, borderBottom: `1px solid ${DIVIDER}`, whiteSpace: 'nowrap' }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i} sx={{ '& td': { borderBottom: `1px solid ${DIVIDER}` } }}>
                    {COLUMNS.map((col) => (
                      <TableCell key={col} sx={{ py: 1.5, px: 2 }}>
                        <Skeleton variant="text" sx={{ fontSize: 12 }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:hover': { bgcolor: 'rgba(245,246,247,0.8)' }, '& td': { borderBottom: `1px solid ${DIVIDER}` } }}
              >
                <TableCell sx={{ fontSize: 13, color: DARK, py: 1.5, px: 2, fontWeight: 600 }}>{row.id}</TableCell>
                <TableCell sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2 }}>
                  <Typography sx={{ fontSize: 12 }}>{row.code1}</Typography>
                  <Typography sx={{ fontSize: 12, color: SECONDARY }}>{row.code2}</Typography>
                </TableCell>
                <TableCell sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2, whiteSpace: 'nowrap' }}>
                  <Typography sx={{ fontSize: 12 }}>{row.salePeriodStart}</Typography>
                  <Typography sx={{ fontSize: 12 }}>{row.salePeriodEnd}</Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5, px: 2, maxWidth: 280 }}>
                  <Typography
                    sx={{ fontSize: 12, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280 }}
                    title={row.documentName}
                  >
                    {row.documentName}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2, whiteSpace: 'nowrap' }}>{row.registrant}</TableCell>
                <TableCell sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2, whiteSpace: 'nowrap' }}>{row.registrationDate}</TableCell>
                <TableCell sx={{ py: 1.5, px: 2 }}>{registrationStatusChip(row.registrationStatus)}</TableCell>
                <TableCell sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2, whiteSpace: 'nowrap' }}>
                  <Typography sx={{ fontSize: 12 }}>{row.reflectionDate}</Typography>
                  <Typography sx={{ fontSize: 12, color: SECONDARY }}>{row.endDate}</Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5, px: 2 }}>{operationStatusChip(row.operationStatus)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
