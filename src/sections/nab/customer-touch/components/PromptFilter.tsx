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

export interface PromptFilterProps {
  fromDate: string;
  onFromDateChange: (v: string) => void;
  toDate: string;
  onToDateChange: (v: string) => void;
  typeFilter: string;
  onTypeChange: (v: string) => void;
  categoryFilter: string;
  onCategoryChange: (v: string) => void;
  searchText: string;
  onSearchTextChange: (v: string) => void;
  onSearch: () => void;
}

const calendarAdornment = (
  <InputAdornment position="end">
    <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: SECONDARY }} />
  </InputAdornment>
);

export default function PromptFilter({
  fromDate, onFromDateChange,
  toDate, onToDateChange,
  typeFilter, onTypeChange,
  categoryFilter, onCategoryChange,
  searchText, onSearchTextChange,
  onSearch,
}: PromptFilterProps) {
  return (
    <>
      <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* 조회기간 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 426 }}>
          <TextField
            label="조회기간"
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

        {/* 유형 */}
        <FormControl sx={{ width: 200, ...FIELD_SX }}>
          <InputLabel shrink sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY }}>유형</InputLabel>
          <Select
            value={typeFilter}
            label="유형"
            onChange={(e) => onTypeChange(e.target.value)}
            sx={{ fontSize: 14, '& .MuiOutlinedInput-notchedOutline': { borderColor: DIVIDER }, borderRadius: 2, height: 54 }}
          >
            <MenuItem value="전체">전체</MenuItem>
            <MenuItem value="유형1">유형1</MenuItem>
            <MenuItem value="유형2">유형2</MenuItem>
          </Select>
        </FormControl>

        {/* 카테고리 */}
        <FormControl sx={{ width: 200, ...FIELD_SX }}>
          <InputLabel shrink sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY }}>카테고리</InputLabel>
          <Select
            value={categoryFilter}
            label="카테고리"
            onChange={(e) => onCategoryChange(e.target.value)}
            sx={{ fontSize: 14, '& .MuiOutlinedInput-notchedOutline': { borderColor: DIVIDER }, borderRadius: 2, height: 54 }}
          >
            <MenuItem value="전체">전체</MenuItem>
            <MenuItem value="카테고리1">카테고리1</MenuItem>
            <MenuItem value="카테고리2">카테고리2</MenuItem>
          </Select>
        </FormControl>

        {/* 검색어(셀렉트박스) */}
        <FormControl sx={{ width: 200, ...FIELD_SX }}>
          <InputLabel shrink sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY }}>검색어</InputLabel>
          <Select
            value={categoryFilter}
            label="검색어"
            onChange={(e) => onCategoryChange(e.target.value)}
            sx={{ fontSize: 14, '& .MuiOutlinedInput-notchedOutline': { borderColor: DIVIDER }, borderRadius: 2, height: 54 }}
          >
            <MenuItem value="전체">전체</MenuItem>
            <MenuItem value="카테고리1">카테고리1</MenuItem>
            <MenuItem value="카테고리2">카테고리2</MenuItem>
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
            height: 48, px: 2, borderRadius: 2, bgcolor: '#485059', color: 'white',
            fontSize: 15, fontWeight: 400, whiteSpace: 'nowrap', flexShrink: 0,
            boxShadow: 'none', '&:hover': { bgcolor: '#3a4048', boxShadow: 'none' },
          }}
        >
          조회
        </Button>
      </Box>
    </>
  );
}
