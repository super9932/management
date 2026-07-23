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
import { BUTTON_DARK, DIVIDER, FIELD_SX, SECONDARY } from '../../_lib/tokens';

export interface StatisticsFilterProps {
  fromDate: string;
  onFromDateChange: (v: string) => void;
  toDate: string;
  onToDateChange: (v: string) => void;
  typeFilter: string;
  onTypeChange: (v: string) => void;
  onSearch: () => void;
}

const calendarAdornment = (
  <InputAdornment position="end">
    <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: SECONDARY }} />
  </InputAdornment>
);

export default function StatisticsFilter({
  fromDate, onFromDateChange,
  toDate, onToDateChange,
  typeFilter, onTypeChange,
  onSearch,
}: StatisticsFilterProps) {
  return (
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

      <Box sx={{ flex: 1 }} />

      {/* 조회 */}
      <Button
        variant="contained"
        onClick={onSearch}
        sx={{
          height: 48, px: 2, borderRadius: 2, bgcolor: BUTTON_DARK, color: 'white',
          fontSize: 15, fontWeight: 400, whiteSpace: 'nowrap', flexShrink: 0,
          boxShadow: 'none', '&:hover': { bgcolor: 'var(--nab-button-hover)', boxShadow: 'none' },
        }}
      >
        조회
      </Button>
    </Box>
  );
}
