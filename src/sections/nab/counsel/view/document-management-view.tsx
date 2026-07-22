import { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Card,
  Breadcrumbs,
} from '@mui/material';
import Button from '@mui/material/Button';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddIcon from '@mui/icons-material/Add';
import DocumentRegistrationDialog from '../components/DocumentRegistrationDialog';
import DocumentTabs from '../components/DocumentTabs';
import DocumentFilter from '../components/DocumentFilter';
import DocumentTable from '../components/DocumentTable';
import DocumentPagination from '../components/DocumentPagination';
import { PRIMARY_ORANGE, DARK, DISABLED, CARD_SHADOW } from '../../_lib/tokens';
import type { DocumentRow, OperationStatus } from '../type';
import { LIMIT, APPROVAL_STATUS_MAP } from '../constant';
import { getDocuments } from '../../../../api/backoffice/documents';

// API 응답 → DocumentRow 변환
function mapToRow(doc: Record<string, unknown>, index: number, total: number, page: number): DocumentRow {
  const approvalStatus = String(doc.approvalStatus ?? doc.uploadStatus ?? 'PENDING');
  return {
    id: total - (page - 1) * LIMIT - index,
    code1: String(doc.code1 ?? doc.productMasterId ?? '-'),
    code2: String(doc.code2 ?? '-'),
    salePeriodStart: String(doc.salePeriodStart ?? doc.effectiveFrom ?? '-'),
    salePeriodEnd: String(doc.salePeriodEnd ?? doc.effectiveTo ?? '-'),
    documentName: String(doc.fileName ?? doc.title ?? '-'),
    registrant: String(doc.registeredBy ?? '-'),
    registrationDate: String(doc.createdAt ?? '-').slice(0, 10),
    registrationStatus: APPROVAL_STATUS_MAP[approvalStatus] ?? '진행',
    reflectionDate: String(doc.reflectionDate ?? doc.effectiveFrom ?? '-'),
    endDate: String(doc.endDate ?? doc.effectiveTo ?? '-'),
    operationStatus: (doc.operationStatus as OperationStatus) ?? '대기',
  };
}

export default function DocumentManagementView() {
  const [tabValue, setTabValue] = useState(0);
  const [searchType, setSearchType] = useState('전체');
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');   // 조회 버튼 클릭 시점에 반영
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  // No.29 — 문서 조회 API
  const { data, isLoading } = useQuery(
    ['documents', page, searchQuery, searchType],
    () => getDocuments({
      page,
      limit: LIMIT,
      keyword: searchQuery || undefined,
    }),
    { keepPreviousData: true }
  );

  const items = (data as { items?: Record<string, unknown>[] } | undefined)?.items ?? [];
  const total = (data as { total?: number } | undefined)?.total ?? 0;
  const rows: DocumentRow[] = items.map((doc, i) => mapToRow(doc, i, total, page));

  const handleSearch = () => {
    setSearchQuery(searchText);
    setPage(1);
  };

  return (
    <>
      <Box sx={{ mb: 5, pt: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>AI 에이전트</Typography>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>상담 AI</Typography>
          <Typography sx={{ fontSize: 14, color: DISABLED }}>문서 관리</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 700, color: DARK, fontSize: 24 }}>
          문서 관리
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
        <DocumentTabs value={tabValue} onChange={setTabValue} />
        <DocumentFilter
          searchType={searchType}
          onSearchTypeChange={setSearchType}
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onSearch={handleSearch}
        />
        <DocumentTable rows={rows} total={total} loading={isLoading} />
      </Card>

      <DocumentPagination page={page} onChange={setPage} />

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setDialogOpen(true)}
        sx={{
          position: 'fixed', bottom: 32, right: 32,
          bgcolor: PRIMARY_ORANGE, color: 'white', borderRadius: 2,
          fontSize: 14, fontWeight: 500, px: 2.5, py: 1.25,
          boxShadow: '0px 8px 16px rgba(250,102,0,0.32)',
          '&:hover': { bgcolor: '#e05a00', boxShadow: '0px 8px 16px rgba(250,102,0,0.48)' },
          zIndex: 1200,
        }}
      >
        문서 등록
      </Button>

      <DocumentRegistrationDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
