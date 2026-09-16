import { useState } from 'react';
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
import { DARK, DISABLED, DIVIDER, FIELD_SX, SECONDARY } from '../../_lib/tokens';
import { OPERATION_FILTER_OPTIONS, SEARCH_TYPE_OPTIONS } from '../constant';

export interface DocumentFilterProps {
  fromDate: string;
  onFromDateChange: (v: string) => void;
  toDate: string;
  onToDateChange: (v: string) => void;
  operationFilter: string;
  onOperationFilterChange: (v: string) => void;
  searchType: string;
  onSearchTypeChange: (v: string) => void;
  searchText: string;
  onSearchTextChange: (v: string) => void;
  onSearch: () => void;
  /** 검색기준 옵션 (기본: 보험약관 문서 기준) */
  searchTypeOptions?: readonly string[];
  /** 노출상태 옵션 (기본: 전체/운영중/오류/대기중) */
  operationFilterOptions?: readonly string[];
  /** 검색기준 셀렉트 노출 여부 (기본: true) */
  showSearchType?: boolean;
  /**
   * 조건을 한 줄에 모두 놓을지 (기본: false → 2행).
   * 판매기간이 붙는 보험약관은 한 줄에 안 들어가 2행을 쓰고, 매뉴얼 화면은 한 줄이다
   * (Figma 5850:152747 · 11424:86632).
   */
  singleRow?: boolean;
  /** 분류 셀렉트 노출 여부 — 관리주체 하위 분류를 가진 매뉴얼 화면에서만 쓴다 (기본: false) */
  showClassFilter?: boolean;
  /** 분류 옵션 — '전체' + 그 관리주체의 분류 표기 */
  classFilterOptions?: readonly string[];
  classFilter?: string;
  onClassFilterChange?: (v: string) => void;
  /** 판매기간 구간 노출 여부 — 판매일자를 가진 보험약관 문서에서만 쓴다 (기본: false) */
  showSalePeriod?: boolean;
  /** 판매시작일 하한 (showSalePeriod 일 때만 사용) */
  saleFromDate?: string;
  onSaleFromDateChange?: (v: string) => void;
  /** 판매종료일 상한 (showSalePeriod 일 때만 사용) */
  saleToDate?: string;
  onSaleToDateChange?: (v: string) => void;
}

const labelSx = { fontSize: 12, fontWeight: 700, color: SECONDARY } as const;

const selectSx = {
  fontSize: 14,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: DIVIDER },
  borderRadius: 2,
  height: 54,
} as const;

/** 날짜/셀렉트 필드 공통 폭 (Figma 11424:86632) */
const FIELD_WIDTH = 160;

interface DateFieldProps {
  /** 인풋 위에 붙는 라벨 — 구간의 시작일 쪽에만 준다 */
  label?: string;
  /** 값이 비었을 때 덮어 보여줄 안내 문구 */
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

/**
 * 날짜 인풋 한 칸.
 *
 * 네이티브 date 인풋은 placeholder 속성을 지원하지 않아 값이 없으면 브라우저 기본 문구
 * ('연도. 월. 일.')가 보인다. 값이 없고 포커스도 없는 동안만 인풋 글자를 투명하게 만들고
 * 그 자리에 안내 문구를 겹쳐 그린다 (달력 아이콘·클릭 동작은 그대로 살아 있다).
 */
function DateField({ label, placeholder, value, onChange }: DateFieldProps) {
  const [focused, setFocused] = useState(false);
  const showPlaceholder = value === '' && !focused;

  return (
    <Box sx={{ position: 'relative', width: FIELD_WIDTH }}>
      <TextField
        label={label}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        InputLabelProps={{ shrink: true }}
        sx={{
          ...FIELD_SX,
          width: '100%',
          // 날짜 세그먼트 묶음만 통째로 감춘다 (색 지정은 세그먼트별 색을 못 이긴다)
          ...(showPlaceholder && { '& input::-webkit-datetime-edit': { opacity: 0 } }),
        }}
      />
      {showPlaceholder && (
        <Typography
          sx={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            pointerEvents: 'none', fontSize: 14, color: DARK,
          }}
        >
          {placeholder}
        </Typography>
      )}
    </Box>
  );
}

interface DateRangeFieldProps {
  label: string;
  from: string;
  onFromChange: (v: string) => void;
  fromPlaceholder: string;
  to: string;
  onToChange: (v: string) => void;
  toPlaceholder: string;
}

/** 'A ~ B' 날짜 구간 한 쌍 — 라벨은 시작일 쪽에만 붙인다 */
function DateRangeField({
  label, from, onFromChange, fromPlaceholder, to, onToChange, toPlaceholder,
}: DateRangeFieldProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <DateField label={label} placeholder={fromPlaceholder} value={from} onChange={onFromChange} />
      <Typography sx={{ fontSize: 12, color: SECONDARY, flexShrink: 0 }}>~</Typography>
      <DateField placeholder={toPlaceholder} value={to} onChange={onToChange} />
    </Box>
  );
}

export default function DocumentFilter({
  fromDate, onFromDateChange,
  toDate, onToDateChange,
  operationFilter, onOperationFilterChange,
  searchType, onSearchTypeChange,
  searchText, onSearchTextChange,
  onSearch,
  searchTypeOptions = SEARCH_TYPE_OPTIONS,
  operationFilterOptions = OPERATION_FILTER_OPTIONS,
  showSearchType = true,
  singleRow = false,
  showClassFilter = false,
  classFilterOptions = [],
  classFilter = '',
  onClassFilterChange,
  showSalePeriod = false,
  saleFromDate = '',
  onSaleFromDateChange,
  saleToDate = '',
  onSaleToDateChange,
}: DocumentFilterProps) {
  const classField = showClassFilter && (
    <FormControl sx={{ width: FIELD_WIDTH, ...FIELD_SX }}>
      <InputLabel shrink sx={labelSx}>분류</InputLabel>
      <Select
        value={classFilter}
        label="분류"
        onChange={(e) => onClassFilterChange?.(e.target.value)}
        sx={selectSx}
      >
        {classFilterOptions.map((opt) => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const salePeriodField = showSalePeriod && (
    <DateRangeField
      label="판매기간"
      from={saleFromDate}
      onFromChange={(v) => onSaleFromDateChange?.(v)}
      fromPlaceholder="판매 시작일"
      to={saleToDate}
      onToChange={(v) => onSaleToDateChange?.(v)}
      toPlaceholder="판매 종료일"
    />
  );

  const registeredPeriodField = (
    <DateRangeField
      label="등록일자"
      from={fromDate}
      onFromChange={onFromDateChange}
      fromPlaceholder="등록 시작일"
      to={toDate}
      onToChange={onToDateChange}
      toPlaceholder="등록 종료일"
    />
  );

  const statusField = (
    <FormControl sx={{ width: FIELD_WIDTH, ...FIELD_SX }}>
      <InputLabel shrink sx={labelSx}>운영상태</InputLabel>
      <Select
        value={operationFilter}
        label="운영상태"
        onChange={(e) => onOperationFilterChange(e.target.value)}
        sx={selectSx}
      >
        {operationFilterOptions.map((opt) => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const searchTypeField = showSearchType && (
    <FormControl sx={{ width: FIELD_WIDTH, flexShrink: 0, ...FIELD_SX }}>
      <InputLabel shrink sx={labelSx}>검색기준</InputLabel>
      <Select
        value={searchType}
        label="검색기준"
        onChange={(e) => onSearchTypeChange(e.target.value)}
        sx={selectSx}
      >
        {searchTypeOptions.map((opt) => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const searchField = (
    <TextField
      sx={{ flex: 1, minWidth: 240, ...FIELD_SX }}
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
  );

  const searchButton = (
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
  );

  // 한 줄 배치 — 매뉴얼 화면 (Figma 5850:152747)
  if (singleRow) {
    return (
      <Box sx={{ px: 2.5, py: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        {classField}
        {salePeriodField}
        {registeredPeriodField}
        {statusField}
        {searchTypeField}
        {searchField}
        {searchButton}
      </Box>
    );
  }

  // 2행 배치 — 판매기간까지 붙는 보험약관 화면 (Figma 11424:86632)
  return (
    <Box sx={{ px: 2.5, py: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* 1행 — 분류·기간·상태 조건 */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        {classField}
        {salePeriodField}
        {registeredPeriodField}
        {statusField}
      </Box>

      {/* 2행 — 검색어 + 조회 */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {searchTypeField}
        {searchField}
        {searchButton}
      </Box>
    </Box>
  );
}
