import { useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { NabThemeScope } from '../../_lib/NabThemeScope';
import { CARD_SHADOW, DARK, DISABLED, FIELD_SX, SECONDARY } from '../../_lib/tokens';
import StatisticsTable from '../components/StatisticsTable';
import DocumentPagination from '../components/DocumentPagination';
import { MOCK_STATISTICS_ROWS, PAGE_SIZE, STATISTICS_TOTAL } from '../constant';

const calendarAdornment = (
  <InputAdornment position="end">
    <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: SECONDARY }} />
  </InputAdornment>
);

function CounselStatisticsViewInner() {
  const [fromDate, setFromDate] = useState('2026.10.01');
  const [toDate, setToDate] = useState('2026.11.10');
  const [page, setPage] = useState(1);

  const rows = MOCK_STATISTICS_ROWS;

  const handleExcelDownload = () => {
    // TODO: 엑셀 다운로드 API 연동 (후속 작업)
  };

  return (
    <>
      {/* Breadcrumb + Title */}
      <Box sx={{ mb: 5, pt: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>FP 비서</Typography>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>상담 Plus AI</Typography>
          <Typography sx={{ fontSize: 14, color: DISABLED }}>통계 관리</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 700, color: DARK, fontSize: 24 }}>
          통계 관리
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
        {/* 필터 (조회일자) */}
        <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 426 }}>
            <TextField
              label="조회일자"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ endAdornment: calendarAdornment }}
              sx={{ ...FIELD_SX, flex: 1 }}
            />
            <Typography sx={{ fontSize: 12, color: SECONDARY, flexShrink: 0 }}>~</Typography>
            <TextField
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ endAdornment: calendarAdornment }}
              sx={{ ...FIELD_SX, flex: 1 }}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => setPage(1)}
            sx={{
              height: 48, px: 2, borderRadius: 2, bgcolor: 'var(--nab-button)', color: 'white',
              fontSize: 15, fontWeight: 400, whiteSpace: 'nowrap', flexShrink: 0,
              boxShadow: 'none', '&:hover': { bgcolor: 'var(--nab-button-hover)', boxShadow: 'none' },
            }}
          >
            조회
          </Button>
        </Box>

        <StatisticsTable
          rows={rows}
          total={STATISTICS_TOTAL}
          pageSize={PAGE_SIZE}
          onExcelDownload={handleExcelDownload}
        />

        <DocumentPagination page={page} onChange={setPage} />
      </Card>
    </>
  );
}

export default function CounselStatisticsView() {
  return (
    <NabThemeScope>
      <CounselStatisticsViewInner />
    </NabThemeScope>
  );
}
