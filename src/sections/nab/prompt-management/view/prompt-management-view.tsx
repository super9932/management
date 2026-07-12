import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Breadcrumbs,
  Button,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddIcon from '@mui/icons-material/Add';
import PromptTabs from '../components/PromptTabs';
import PromptFilter from '../components/PromptFilter';
import PromptTable from '../components/PromptTable';
import PromptPagination from '../components/PromptPagination';
import PromptRegister from '../components/PromptRegister';
import PromptGuide from '../components/PromptGuide';
import { DARK, SECONDARY_16, DISABLED, CARD_SHADOW } from '../../../../theme';
import { MOCK_ROWS } from '../constant';

export default function PromptManagementView() {
  const [tabValue, setTabValue] = useState(1);
  const [fromDate, setFromDate] = useState('2026.10.15');
  const [toDate, setToDate] = useState('2026.11.15');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  // 등록 폼 모드/상태
  const [mode, setMode] = useState<'list' | 'register'>('list');
  const [regType, setRegType] = useState('전체');
  const [regCategory, setRegCategory] = useState('전체');
  const [regPromptName, setRegPromptName] = useState('');
  const [regInstruction, setRegInstruction] = useState('');

  const TOTAL = 63;
  const PAGE_SIZE = '10';

  return (
    <>
      {/* Breadcrumb + Title */}
      <Box sx={{ mb: 5, pt: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>AI 비서</Typography>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>고객 Plus AI 관리</Typography>
          <Typography sx={{ fontSize: 14, color: DISABLED }}>프롬프트 관리</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 700, color: DARK, fontSize: 24 }}>
          {mode === 'register' ? '프롬프트 등록' : '프롬프트 관리'}
        </Typography>
      </Box>

      {mode === 'register' ? (
        <PromptRegister
          type={regType}
          onTypeChange={setRegType}
          category={regCategory}
          onCategoryChange={setRegCategory}
          promptName={regPromptName}
          onPromptNameChange={setRegPromptName}
          instruction={regInstruction}
          onInstructionChange={setRegInstruction}
          onList={() => setMode('list')}
          onCancel={() => setMode('list')}
          onSave={() => setMode('list')}
        />
      ) : (
        <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
          <PromptTabs value={tabValue} onChange={setTabValue} />
          {tabValue === 0 ? (
            <PromptGuide />
          ) : (
            <>
              <PromptFilter
                fromDate={fromDate}
                onFromDateChange={setFromDate}
                toDate={toDate}
                onToDateChange={setToDate}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                searchText={searchText}
                onSearchTextChange={setSearchText}
                onSearch={() => {}}
              />
              <PromptTable rows={MOCK_ROWS} total={TOTAL} pageSize={PAGE_SIZE} />
              <PromptPagination page={page} onChange={setPage} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2.5, py: 2.5 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setMode('register')}
                  sx={{
                    bgcolor: SECONDARY_16, color: DARK, borderRadius: 2,
                    fontSize: 14, fontWeight: 500, px: 2.5, py: 1.25,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: SECONDARY_16, boxShadow: 'none' },
                  }}
                >
                  등록
                </Button>
              </Box>
            </>
          )}
        </Card>
      )}
    </>
  );
}
