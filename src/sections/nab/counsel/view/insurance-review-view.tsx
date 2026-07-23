import { useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { NabThemeScope } from '../../_lib/NabThemeScope';
import { CARD_SHADOW, DARK, DISABLED, SECONDARY } from '../../_lib/tokens';
import DocumentFilter from '../components/DocumentFilter';
import InsuranceReviewTable from '../components/InsuranceReviewTable';
import InsuranceReviewDetailDialog from '../components/InsuranceReviewDetailDialog';
import DocumentRegisterDialog from '../components/DocumentRegisterDialog';
import DocumentPagination from '../components/DocumentPagination';
import { MOCK_REVIEW_ROWS, MOCK_TOTAL, PAGE_SIZE, REVIEW_SEARCH_TYPE_OPTIONS } from '../constant';
import type { InsuranceReviewRow } from '../type';

function InsuranceReviewViewInner() {
  const [fromDate, setFromDate] = useState('2026.01.01');
  const [toDate, setToDate] = useState('2026.12.31');
  const [operationFilter, setOperationFilter] = useState('전체');
  const [searchType, setSearchType] = useState('전체');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [detailRow, setDetailRow] = useState<InsuranceReviewRow | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);

  const rows = MOCK_REVIEW_ROWS;

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleAll = () => {
    setSelectedIds((prev) => {
      const allChecked = rows.length > 0 && rows.every((row) => prev.has(row.id));
      return allChecked ? new Set() : new Set(rows.map((row) => row.id));
    });
  };

  const hasSelection = selectedIds.size > 0;

  return (
    <>
      {/* Breadcrumb + Title */}
      <Box sx={{ mb: 5, pt: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>FP 비서</Typography>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>상담 Plus AI</Typography>
          <Typography sx={{ fontSize: 14, color: DISABLED }}>보험심사 문서</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 700, color: DARK, fontSize: 24 }}>
          보험심사 문서
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
        <DocumentFilter
          fromDate={fromDate}
          onFromDateChange={setFromDate}
          toDate={toDate}
          onToDateChange={setToDate}
          operationFilter={operationFilter}
          onOperationFilterChange={setOperationFilter}
          searchType={searchType}
          onSearchTypeChange={setSearchType}
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onSearch={() => setPage(1)}
          searchTypeOptions={REVIEW_SEARCH_TYPE_OPTIONS}
        />
        <InsuranceReviewTable
          rows={rows}
          total={MOCK_TOTAL}
          pageSize={PAGE_SIZE}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          onToggleAll={handleToggleAll}
          onDocumentClick={setDetailRow}
        />

        {/* 페이지네이션(중앙) + 액션(우측) */}
        <Box sx={{ position: 'relative' }}>
          <DocumentPagination page={page} onChange={setPage} />
          <Box
            sx={{
              position: 'absolute', right: 20, top: 0, bottom: 0,
              display: 'flex', alignItems: 'center', gap: 1,
            }}
          >
            <Button
              variant="outlined"
              disabled={!hasSelection}
              sx={{
                height: 40, px: 2, borderRadius: 2, fontSize: 14, fontWeight: 400,
                color: DARK, borderColor: 'var(--nab-border-strong)',
                '&:hover': { borderColor: SECONDARY, bgcolor: 'transparent' },
                '&.Mui-disabled': { color: DISABLED, borderColor: 'var(--nab-border)' },
              }}
            >
              선택 삭제
            </Button>
            <Button
              variant="contained"
              onClick={() => setRegisterOpen(true)}
              sx={{
                height: 40, px: 2, borderRadius: 2, fontSize: 15, fontWeight: 400,
                bgcolor: 'rgba(140,149,157,0.16)', color: DARK, boxShadow: 'none',
                '&:hover': { bgcolor: 'rgba(140,149,157,0.28)', boxShadow: 'none' },
              }}
            >
              문서 등록
            </Button>
          </Box>
        </Box>
      </Card>

      <InsuranceReviewDetailDialog
        open={detailRow !== null}
        row={detailRow}
        onClose={() => setDetailRow(null)}
      />

      <DocumentRegisterDialog
        open={registerOpen}
        title="보험심사 문서 등록"
        onClose={() => setRegisterOpen(false)}
      />
    </>
  );
}

export default function InsuranceReviewView() {
  return (
    <NabThemeScope>
      <InsuranceReviewViewInner />
    </NabThemeScope>
  );
}
