import {
  Box,
  Button,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DISABLED, DIVIDER, SECONDARY } from '../../_lib/tokens';

export interface DocumentFilterProps {
  searchType: string;
  onSearchTypeChange: (v: string) => void;
  searchText: string;
  onSearchTextChange: (v: string) => void;
  onSearch: () => void;
}

export default function DocumentFilter({
  searchType,
  onSearchTypeChange,
  searchText,
  onSearchTextChange,
  onSearch,
}: DocumentFilterProps) {
  return (
    <>
      <Box sx={{ p: 2.5, display: 'flex', gap: 1, alignItems: 'center' }}>
        <FormControl sx={{ width: 200 }} size="medium">
          <InputLabel shrink sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY }}>
            검색어
          </InputLabel>
          <Select
            value={searchType}
            label="검색어"
            onChange={(e) => onSearchTypeChange(e.target.value)}
            sx={{
              fontSize: 14,
              borderRadius: 2,
              height: 54,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: DIVIDER },
            }}
          >
            <MenuItem value="전체">전체</MenuItem>
            <MenuItem value="문서명">문서명</MenuItem>
            <MenuItem value="등록자">등록자</MenuItem>
            <MenuItem value="상품코드">상품코드</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          placeholder="검색어를 입력해주세요"
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: DISABLED, opacity: 0.3 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: 14,
              height: 54,
              borderRadius: 2,
              '& fieldset': { borderColor: DIVIDER },
            },
            '& input::placeholder': { color: DISABLED, opacity: 1 },
          }}
        />

        <Button
          variant="contained"
          onClick={onSearch}
          sx={{
            height: 48,
            px: 2,
            borderRadius: 2,
            bgcolor: '#485059',
            color: 'white',
            fontSize: 15,
            fontWeight: 400,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#3a4048', boxShadow: 'none' },
          }}
        >
          조회
        </Button>
      </Box>
      <Divider sx={{ borderColor: DIVIDER }} />
    </>
  );
}
