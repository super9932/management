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
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { DISABLED, DIVIDER, FIELD_SX, SECONDARY } from '../../_lib/tokens';
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
  /** 검색기준 셀렉트 노출 여부 (기본: true) */
  showSearchType?: boolean;
}

const calendarAdornment = (
  <InputAdornment position="end">
    <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: SECONDARY }} />
  </InputAdornment>
);

const selectSx = {
  fontSize: 14,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: DIVIDER },
  borderRadius: 2,
  height: 54,
} as const;

export default function DocumentFilter({
  fromDate, onFromDateChange,
  toDate, onToDateChange,
  operationFilter, onOperationFilterChange,
  searchType, onSearchTypeChange,
  searchText, onSearchTextChange,
  onSearch,
  searchTypeOptions = SEARCH_TYPE_OPTIONS,
  showSearchType = true,
}: DocumentFilterProps) {
  return (
    <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* 등록일자 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 426 }}>
        <TextField
          label="등록일자"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          InputProps={{ endAdornment: calendarAdornment }}
          sx={{ ...FIELD_SX, flex: 1 }}
        />
        <Typography sx={{ fontSize: 12, color: SECONDARY, flexShrink: 0 }}>~</Typography>
        <TextField
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          InputProps={{ endAdornment: calendarAdornment }}
          sx={{ ...FIELD_SX, flex: 1 }}
        />
      </Box>

      {/* 운영상태 */}
      <FormControl sx={{ width: 200, ...FIELD_SX }}>
        <InputLabel shrink sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY }}>운영상태</InputLabel>
        <Select
          value={operationFilter}
          label="운영상태"
          onChange={(e) => onOperationFilterChange(e.target.value)}
          sx={selectSx}
        >
          {OPERATION_FILTER_OPTIONS.map((opt) => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 검색기준 */}
      {showSearchType && (
        <FormControl sx={{ width: 200, ...FIELD_SX }}>
          <InputLabel shrink sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY }}>검색기준</InputLabel>
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
      )}

      {/* 검색어 */}
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
