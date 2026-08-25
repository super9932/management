import { useState } from 'react';
import { useQuery } from 'react-query';
import { NabThemeScope } from '../../_lib/NabThemeScope';
import {
  Alert,
  Box,
  Typography,
  Card,
  Breadcrumbs,
  Button,
  CircularProgress,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddIcon from '@mui/icons-material/Add';
import PromptFilter from '../components/PromptFilter';
import PromptTable from '../components/PromptTable';
import PromptPagination from '../components/PromptPagination';
import PromptRegister from '../components/PromptRegister';
import { DARK, SECONDARY_16, DISABLED, CARD_SHADOW, PRIMARY_ORANGE } from '../../_lib/tokens';
import {
  FILTER_ALL,
  PROMPT_SEARCH_SCOPE_CODE,
  promptItemLabel,
  todayDateString,
} from '../constant';
import { getPromptCategories, getPromptList } from '../../../../api/nab/customer-touch';
import type { PromptListRequest } from '../../../../api/nab/customer-touch';
import type { PromptRow } from '../type';

const PAGE_SIZE = 10;

/** 조회 버튼을 눌러야 실제 요청에 반영되는 값들 */
interface AppliedFilter {
  startDate: string;
  endDate: string;
  type: string;
  category: string;
  searchScope: string;
  keyword: string;
}

const toListRequest = (filter: AppliedFilter, page: number): PromptListRequest => ({
  startDate: filter.startDate,
  endDate: filter.endDate,
  // 화면의 유형·카테고리는 API의 category(1-depth)·item(2-depth) 그대로다.
  category: filter.type === FILTER_ALL ? undefined : filter.type,
  item: filter.category === FILTER_ALL ? undefined : filter.category,
  searchScope: PROMPT_SEARCH_SCOPE_CODE[filter.searchScope] ?? 'ALL',
  keyword: filter.keyword.trim() || undefined,
  page,
  size: PAGE_SIZE,
});

/** 셀렉트 소스 — 서버 카탈로그를 그대로 쓴다 */
const fetchCategories = async () => {
  const response = await getPromptCategories();

  if (response.error) {
    throw new Error(response.error.message ?? '카테고리 목록 조회에 실패했습니다.');
  }

  return response.data?.categories ?? [];
};

const fetchPromptRows = async (filter: AppliedFilter, page: number) => {
  const response = await getPromptList(toListRequest(filter, page));

  if (response.error) {
    throw new Error(response.error.message ?? '프롬프트 목록 조회에 실패했습니다.');
  }

  const data = response.data;
  const totalCount = data?.totalCount ?? 0;
  const offset = (page - 1) * PAGE_SIZE;

  const rows: PromptRow[] = (data?.prompts ?? []).map((item, index) => ({
    id: item.id,
    // 전체 건수 기준 내림차순 번호
    no: totalCount - offset - index,
    contentsId: String(item.id),
    type: item.categoryLabel,
    category: promptItemLabel(item.item),
    promptName: item.name,
    registeredAt: item.registeredAt,
    updatedAt: item.updatedAt,
    lastEditor: item.lastChanger || item.lastChangerEmnb,
  }));

  return { rows, totalCount };
};

function PromptManagementViewInner() {
  // 조회기간은 게시일 기준 — 시작·종료 모두 오늘로 시작한다.
  const [fromDate, setFromDate] = useState(todayDateString);
  const [toDate, setToDate] = useState(todayDateString);
  const [typeFilter, setTypeFilter] = useState(FILTER_ALL);
  const [categoryFilter, setCategoryFilter] = useState(FILTER_ALL);
  const [searchScope, setSearchScope] = useState(FILTER_ALL);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  // 입력 중인 필터와 실제 조회 조건을 분리한다 — 조회 버튼을 눌러야 요청이 나간다.
  const [appliedFilter, setAppliedFilter] = useState<AppliedFilter>(() => ({
    startDate: todayDateString(),
    endDate: todayDateString(),
    type: FILTER_ALL,
    category: FILTER_ALL,
    searchScope: FILTER_ALL,
    keyword: '',
  }));

  // 등록 폼 모드/상태
  const [mode, setMode] = useState<'list' | 'register'>('list');
  // 등록은 실제 값을 골라야 하므로 '전체' 없이 미선택('')에서 시작한다.
  const [regType, setRegType] = useState('');
  const [regCategory, setRegCategory] = useState('');
  const [regPromptName, setRegPromptName] = useState('');
  const [regInstruction, setRegInstruction] = useState('');

  const { data: categories = [] } = useQuery(
    ['nab', 'customer-touch', 'prompt-categories'],
    fetchCategories,
    { staleTime: Infinity },
  );

  const { data, isFetching, isError, error, refetch } = useQuery(
    ['nab', 'customer-touch', 'prompt-list', appliedFilter, page],
    () => fetchPromptRows(appliedFilter, page),
    { keepPreviousData: true },
  );

  const rows = data?.rows ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  /** 유형이 바뀌면 하위 카테고리 목록이 통째로 달라지므로 카테고리는 '전체'로 되돌린다. */
  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setCategoryFilter(FILTER_ALL);
  };

  /** 등록 폼도 동일 — 유형이 바뀌면 카테고리는 미선택으로 되돌린다. */
  const handleRegTypeChange = (value: string) => {
    setRegType(value);
    setRegCategory('');
  };

  /** 조회 — 현재 입력값을 조회 조건으로 확정하고 첫 페이지부터 다시 읽는다. */
  const handleSearch = () => {
    setPage(1);
    setAppliedFilter({
      startDate: fromDate,
      endDate: toDate,
      type: typeFilter,
      category: categoryFilter,
      searchScope,
      keyword: searchText,
    });
  };

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
          categories={categories}
          type={regType}
          onTypeChange={handleRegTypeChange}
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
          <PromptFilter
            categories={categories}
            fromDate={fromDate}
            onFromDateChange={setFromDate}
            toDate={toDate}
            onToDateChange={setToDate}
            typeFilter={typeFilter}
            onTypeChange={handleTypeChange}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            searchScope={searchScope}
            onSearchScopeChange={setSearchScope}
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onSearch={handleSearch}
          />

          {isError && (
            <Alert
              severity="error"
              sx={{ borderRadius: 0 }}
              action={
                <Button color="inherit" size="small" onClick={() => refetch()}>
                  재시도
                </Button>
              }
            >
              {(error as Error)?.message ?? '프롬프트 목록을 불러오지 못했습니다.'}
            </Alert>
          )}

          <Box sx={{ position: 'relative' }}>
            {isFetching && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.6)',
                  zIndex: 1,
                }}
              >
                <CircularProgress size={24} sx={{ color: PRIMARY_ORANGE }} />
              </Box>
            )}

            <PromptTable rows={rows} total={totalCount} pageSize={String(PAGE_SIZE)} />
            <PromptPagination page={page} totalPages={totalPages} onChange={setPage} />
          </Box>

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
        </Card>
      )}
    </>
  );
}

export default function PromptManagementView() {
  return (
    <NabThemeScope>
      <PromptManagementViewInner />
    </NabThemeScope>
  );
}
