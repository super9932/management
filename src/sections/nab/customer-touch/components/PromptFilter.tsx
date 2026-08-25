import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DISABLED, DIVIDER, FIELD_SX, SECONDARY } from '../../_lib/tokens';
import { FILTER_ALL, PROMPT_SEARCH_SCOPE_OPTIONS, promptItemLabel, todayDateString } from '../constant';
import type { PromptCategoryItem } from '../../../../api/nab/customer-touch';

export interface PromptFilterProps {
  /** 서버 카탈로그(prompt/categories) — 유형·카테고리 셀렉트 소스 */
  categories: PromptCategoryItem[];
  /** 게시일 시작(yyyy-MM-dd) */
  fromDate: string;
  onFromDateChange: (v: string) => void;
  /** 게시일 종료(yyyy-MM-dd) */
  toDate: string;
  onToDateChange: (v: string) => void;
  /** 유형 = API category 코드 ('전체'는 필터 안 함) */
  typeFilter: string;
  /** 유형이 바뀌면 카테고리는 '전체'로 되돌린다 */
  onTypeChange: (v: string) => void;
  /** 카테고리 = API item ('전체'는 필터 안 함) */
  categoryFilter: string;
  onCategoryChange: (v: string) => void;
  searchScope: string;
  onSearchScopeChange: (v: string) => void;
  searchText: string;
  onSearchTextChange: (v: string) => void;
  onSearch: () => void;
}

const SELECT_SX = {
  fontSize: 14,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: DIVIDER },
  borderRadius: 2,
  height: 54,
};

const LABEL_SX = { fontSize: 12, fontWeight: 700, color: SECONDARY };

export default function PromptFilter({
  categories,
  fromDate, onFromDateChange,
  toDate, onToDateChange,
  typeFilter, onTypeChange,
  categoryFilter, onCategoryChange,
  searchScope, onSearchScopeChange,
  searchText, onSearchTextChange,
  onSearch,
}: PromptFilterProps) {
  const selected = categories.find((category) => category.code === typeFilter);
  // 유형이 '전체'면 하위 항목을 특정할 수 없어 카테고리는 '전체'뿐이다.
  const items = selected?.items ?? [];
  // 게시일 기준이라 오늘 이후는 고를 수 없다.
  const today = todayDateString();

  return (
    <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* 조회기간 — 게시일 기준, 기본값은 오늘 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 426 }}>
        <TextField
          label="조회기간"
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: toDate < today ? toDate : today }}
          sx={{ ...FIELD_SX, flex: 1 }}
        />
        <Typography sx={{ fontSize: 12, color: SECONDARY, flexShrink: 0 }}>~</Typography>
        <TextField
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: fromDate, max: today }}
          sx={{ ...FIELD_SX, flex: 1 }}
        />
      </Box>

      {/* 유형 */}
      <FormControl sx={{ width: 200, ...FIELD_SX }}>
        <InputLabel shrink sx={LABEL_SX}>유형</InputLabel>
        <Select
          value={typeFilter}
          label="유형"
          onChange={(e) => onTypeChange(e.target.value)}
          sx={SELECT_SX}
        >
          <MenuItem value={FILTER_ALL}>{FILTER_ALL}</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.code} value={category.code}>{category.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 카테고리 — 선택된 유형의 2depth 목록으로 연동된다 */}
      <FormControl sx={{ width: 200, ...FIELD_SX }} disabled={items.length === 0}>
        <InputLabel shrink sx={LABEL_SX}>카테고리</InputLabel>
        <Select
          value={categoryFilter}
          label="카테고리"
          onChange={(e) => onCategoryChange(e.target.value)}
          sx={SELECT_SX}
        >
          <MenuItem value={FILTER_ALL}>{FILTER_ALL}</MenuItem>
          {items.map((item) => (
            <MenuItem key={item} value={item}>{promptItemLabel(item)}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 검색어 범위 */}
      <FormControl sx={{ width: 200, ...FIELD_SX }}>
        <InputLabel shrink sx={LABEL_SX}>검색어</InputLabel>
        <Select
          value={searchScope}
          label="검색어"
          onChange={(e) => onSearchScopeChange(e.target.value)}
          sx={SELECT_SX}
        >
          {PROMPT_SEARCH_SCOPE_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 검색어(인풋박스) */}
      <TextField
        sx={{ flex: 1, minWidth: 200, ...FIELD_SX }}
        placeholder="검색어를 입력해주세요"
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 20, color: DISABLED, opacity: 0.3 }} />
            </InputAdornment>
          ),
        }}
      />

      {/* 조회 */}
      <Button
        variant="contained"
        onClick={onSearch}
        sx={{
          height: 48, px: 2, borderRadius: 2, bgcolor: 'var(--nab-button)', color: 'white',
          fontSize: 15, fontWeight: 400, whiteSpace: 'nowrap', flexShrink: 0,
          boxShadow: 'none', '&:hover': { bgcolor: 'var(--nab-button-hover)', boxShadow: 'none' },
        }}
      >
        조회
      </Button>
    </Box>
  );
}
