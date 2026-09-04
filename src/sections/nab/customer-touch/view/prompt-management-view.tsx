import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { NabThemeScope } from '../../_lib/NabThemeScope';
import {
  Alert,
  Box,
  Typography,
  Card,
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddIcon from '@mui/icons-material/Add';
import PromptFilter from '../components/PromptFilter';
import PromptTable from '../components/PromptTable';
import PromptPagination from '../components/PromptPagination';
import PromptRegister from '../components/PromptRegister';
import { DARK, SECONDARY_16, DISABLED, CARD_SHADOW } from '../../_lib/tokens';
import {
  FILTER_ALL,
  PROMPT_SEARCH_SCOPE_CODE,
  promptItemLabel,
  todayDateString,
} from '../constant';
import {
  createPrompt,
  deletePrompt,
  getPrompt,
  getPromptCategories,
  getPromptList,
  updatePrompt,
} from '../../../../api/nab/customer-touch';
import type { PromptListRequest } from '../../../../api/nab/customer-touch';
import { apiErrorStatus, toApiErrorMessage } from '../../../../api/nab/_lib/error';
import type { PromptRow } from '../type';
import { useAuthContext } from 'src/auth/hooks';

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

  // 폼 모드/상태 — register(신규) 와 edit(수정) 가 같은 폼을 쓴다
  const [mode, setMode] = useState<'list' | 'register' | 'edit'>('list');
  /** 수정 중인 프롬프트ID (등록 모드면 null) */
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  // 등록은 실제 값을 골라야 하므로 '전체' 없이 미선택('')에서 시작한다.
  const [regType, setRegType] = useState('');
  const [regCategory, setRegCategory] = useState('');
  const [regPromptName, setRegPromptName] = useState('');
  const [regInstruction, setRegInstruction] = useState('');
  // 등록 결과 안내 — 성공은 스낵바, 실패는 등록 폼 위 배너로 보여준다
  const [savedMessage, setSavedMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const queryClient = useQueryClient();

  // 등록·수정·삭제 API 는 작업자 사번을 요청 본문 emnb 필드로 받는다
  const { user } = useAuthContext();
  const effectiveUser = user;
  const emnb = effectiveUser?.emnb ?? '';

  const { data: categories = [] } = useQuery(
    ['nab', 'customer-touch', 'prompt-categories'],
    fetchCategories,
    { staleTime: Infinity },
  );

  /**
   * 프롬프트 단건 조회 — 목록의 프롬프트명을 클릭하면 수정 폼을 이 값으로 채운다.
   * 목록에는 본문(content)이 없어 상세를 따로 읽어야 한다.
   */
  const { isFetching: isDetailLoading } = useQuery(
    ['nab', 'customer-touch', 'prompt-detail', editingId],
    async () => {
      const response = await getPrompt({ id: editingId! });

      if (response.error) {
        throw new Error(response.error.message ?? '프롬프트 조회에 실패했습니다.');
      }

      return response.data ?? null;
    },
    {
      enabled: editingId !== null,
      onSuccess: (detail) => {
        if (!detail) return;

        setRegType(detail.category);
        setRegCategory(detail.item);
        setRegPromptName(detail.name);
        setRegInstruction(detail.content);
      },
      onError: (detailError) => {
        setErrorMessage(toApiErrorMessage(detailError, '프롬프트 조회에 실패했습니다.'));
      },
    },
  );

  const { data, isError, error, refetch } = useQuery(
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

  /** 폼을 닫고 목록으로 — 입력값·수정 대상·에러를 모두 비운다 */
  const closeForm = () => {
    resetRegisterForm();
    setEditingId(null);
    setErrorMessage('');
    setMode('list');
  };

  const resetRegisterForm = () => {
    setRegType('');
    setRegCategory('');
    setRegPromptName('');
    setRegInstruction('');
  };

  /**
   * 프롬프트 등록 (POST /v1/post/customer/admin/touch/message/prompt).
   *
   * (유형, 카테고리) 조합이 곧 슬롯이라 이미 등록된 조합이면 서버가 409로 거절한다.
   * 등록자 사번은 바디로 보내지 않고 서버가 토큰에서 채운다.
   */
  const createMutation = useMutation(
    async () => {
      const response = await createPrompt(
        {
        name: regPromptName.trim(),
        category: regType,
        item: regCategory,
        content: regInstruction.trim(),
        },
        emnb,
      );

      if (response.error) {
        throw new Error(response.error.message ?? '프롬프트 등록에 실패했습니다.');
      }

      return response.data;
    },
    {
      onSuccess: () => {
        setSavedMessage('프롬프트가 등록되었습니다.');
        resetRegisterForm();
        setMode('list');
        // 새 프롬프트가 목록에 보이도록 다시 읽는다
        queryClient.invalidateQueries(['nab', 'customer-touch', 'prompt-list']);
      },
      // 실패하면 입력값을 살려둔 채 폼에 머문다
      onError: (mutationError) => {
        // 409 = 같은 (유형, 카테고리) 슬롯이 이미 있다. 서버 원문은 개발용이라 화면 용어로 바꾼다.
        setErrorMessage(
          apiErrorStatus(mutationError) === 409
            ? '이미 등록된 유형·카테고리 조합입니다. 다른 조합을 선택해주세요.'
            : toApiErrorMessage(mutationError, '프롬프트 등록에 실패했습니다.'),
        );
      },
    },
  );

  /** 프롬프트 수정 — 등록과 같은 형상에 id 가 붙는 전량 교체다 */
  const updateMutation = useMutation(
    async () => {
      const response = await updatePrompt(
        {
          id: editingId!,
          name: regPromptName.trim(),
          category: regType,
          item: regCategory,
          content: regInstruction.trim(),
        },
        emnb,
      );

      if (response.error) {
        throw new Error(response.error.message ?? '프롬프트 수정에 실패했습니다.');
      }
    },
    {
      onSuccess: () => {
        setSavedMessage('프롬프트가 수정되었습니다.');
        closeForm();
        queryClient.invalidateQueries(['nab', 'customer-touch', 'prompt-list']);
      },
      onError: (mutationError) => {
        setErrorMessage(
          apiErrorStatus(mutationError) === 409
            ? '이미 등록된 유형·카테고리 조합입니다. 다른 조합을 선택해주세요.'
            : toApiErrorMessage(mutationError, '프롬프트 수정에 실패했습니다.'),
        );
      },
    },
  );

  /** 프롬프트 삭제 */
  const deleteMutation = useMutation(
    async () => {
      const response = await deletePrompt({ id: editingId! }, emnb);

      if (response.error) {
        throw new Error(response.error.message ?? '프롬프트 삭제에 실패했습니다.');
      }
    },
    {
      onSuccess: () => {
        setSavedMessage('프롬프트가 삭제되었습니다.');
        closeForm();
        queryClient.invalidateQueries(['nab', 'customer-touch', 'prompt-list']);
      },
      onError: (mutationError) => {
        setErrorMessage(toApiErrorMessage(mutationError, '프롬프트 삭제에 실패했습니다.'));
      },
    },
  );

  const isFormBusy =
    isDetailLoading || createMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading;

  /** 목록의 프롬프트명 클릭 — 수정 폼으로 들어간다 */
  const handlePromptClick = (row: PromptRow) => {
    setErrorMessage('');
    resetRegisterForm();
    setEditingId(row.id);
    setMode('edit');
  };

  /** 저장 — 필수값을 먼저 확인하고 등록/수정 API 를 호출한다 */
  const handleRegisterSave = () => {
    if (!regType || !regCategory || !regPromptName.trim() || !regInstruction.trim()) {
      setErrorMessage('유형·카테고리·프롬프트명·프롬프트 지침을 모두 입력해주세요.');
      return;
    }

    // 사번이 없으면 서버가 거절하므로 요청 전에 막는다
    if (!emnb) {
      setErrorMessage('로그인 정보를 확인할 수 없어 등록할 수 없습니다.');
      return;
    }

    if (mode === 'edit') {
      updateMutation.mutate();
      return;
    }

    createMutation.mutate();
  };

  const handleRegisterCancel = () => {
    closeForm();
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
          {mode === 'register' ? '프롬프트 등록' : mode === 'edit' ? '프롬프트 수정' : '프롬프트 관리'}
        </Typography>
      </Box>

      {mode !== 'list' ? (
        <Box sx={{ position: 'relative' }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setErrorMessage('')}>
              {errorMessage}
            </Alert>
          )}

          <PromptRegister
            mode={mode === 'edit' ? 'edit' : 'register'}
            contentsId={editingId !== null ? String(editingId) : ''}
            busy={isFormBusy}
            categories={categories}
            type={regType}
            onTypeChange={handleRegTypeChange}
            category={regCategory}
            onCategoryChange={setRegCategory}
            promptName={regPromptName}
            onPromptNameChange={setRegPromptName}
            instruction={regInstruction}
            onInstructionChange={setRegInstruction}
            onList={handleRegisterCancel}
            onCancel={handleRegisterCancel}
            onDelete={() => setDeleteConfirmOpen(true)}
            onSave={handleRegisterSave}
          />
        </Box>
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
            <PromptTable
              rows={rows}
              total={totalCount}
              pageSize={String(PAGE_SIZE)}
              onPromptClick={handlePromptClick}
            />
            <PromptPagination page={page} totalPages={totalPages} onChange={setPage} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2.5, py: 2.5 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setErrorMessage('');
                setMode('register');
              }}
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

      {/* 삭제는 되돌릴 수 없어 확인을 받는다 */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, width: 480, maxWidth: 480 } }}
      >
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700, color: DARK, px: 3, pt: 3, pb: 0.5 }}>
          프롬프트를 삭제하시겠습니까?
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 1 }}>
          <Typography sx={{ fontSize: 16, color: DISABLED }}>
            삭제한 프롬프트는 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 3, gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{
              height: 36, px: 1.5, borderRadius: 1, fontSize: 14, fontWeight: 400,
              color: DARK, borderColor: 'var(--nab-border-strong)',
              '&:hover': { borderColor: DISABLED, bgcolor: 'transparent' },
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setDeleteConfirmOpen(false);
              deleteMutation.mutate();
            }}
            sx={{
              height: 36, px: 1.5, borderRadius: 1, fontSize: 14, fontWeight: 400,
              bgcolor: 'var(--nab-danger)', color: 'white', boxShadow: 'none',
              '&:hover': { bgcolor: 'var(--nab-danger-hover)', boxShadow: 'none' },
            }}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={savedMessage !== ''}
        autoHideDuration={3000}
        onClose={() => setSavedMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSavedMessage('')}>
          {savedMessage}
        </Alert>
      </Snackbar>
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
