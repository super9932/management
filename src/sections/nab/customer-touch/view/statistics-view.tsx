import { useState } from 'react';
import { Box, Typography, Card, Breadcrumbs } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import StatisticsTabs from '../components/StatisticsTabs';
import StatisticsFilter from '../components/StatisticsFilter';
import StatisticsTable from '../components/StatisticsTable';
import StatisticsPagination from '../components/StatisticsPagination';
import { DARK, DISABLED, CARD_SHADOW } from '../../_lib/tokens';
import {
  MESSAGE_METRICS,
  CONTENT_SEARCH_METRICS,
  MOCK_MESSAGE_ROWS,
  MOCK_CONTENT_SEARCH_ROWS,
} from '../constant';

export default function StatisticsView() {
  const [tabValue, setTabValue] = useState(0);
  const [fromDate, setFromDate] = useState('2026.10.15');
  const [toDate, setToDate] = useState('2026.11.15');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [page, setPage] = useState(1);

  const TOTAL = 63;
  const PAGE_SIZE = '10';

  // 탭 1 = AI 콘텐츠 검색: 별도 지표 테이블, 나머지 탭은 기본(메시지) 테이블
  const isContentSearch = tabValue === 1;
  const metrics = isContentSearch ? CONTENT_SEARCH_METRICS : MESSAGE_METRICS;
  const rows = isContentSearch ? MOCK_CONTENT_SEARCH_ROWS : MOCK_MESSAGE_ROWS;

  return (
    <>
      {/* Breadcrumb + Title */}
      <Box sx={{ mb: 5, pt: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>AI 비서</Typography>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>고객 Plus AI 관리</Typography>
          <Typography sx={{ fontSize: 14, color: DISABLED }}>서비스 통계</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 700, color: DARK, fontSize: 24 }}>
          서비스 통계
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
        <StatisticsTabs value={tabValue} onChange={setTabValue} />
        <StatisticsFilter
          fromDate={fromDate}
          onFromDateChange={setFromDate}
          toDate={toDate}
          onToDateChange={setToDate}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          onSearch={() => {}}
        />
        <StatisticsTable rows={rows} total={TOTAL} pageSize={PAGE_SIZE} metrics={metrics} />
        <StatisticsPagination page={page} onChange={setPage} />
      </Card>
    </>
  );
}
