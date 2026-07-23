import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { DARK, DISABLED, DIVIDER, FIELD_SX, PRIMARY_ORANGE, SECONDARY } from '../../_lib/tokens';
import { DOCUMENT_ACCEPT, TIME_OPTIONS } from '../constant';

interface Props {
  open: boolean;
  /** 다이얼로그 제목 (예: '보험공통 문서 등록' | '보험심사 문서 등록') */
  title: string;
  onClose: () => void;
  /** 등록 확정 콜백 (미지정 시 등록 동작 없음 — 후속 작업에서 연결) */
  onSubmit?: (files: File[]) => void;
}

const selectFieldSx = {
  fontSize: 14,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: DIVIDER },
  borderRadius: 2,
  height: 54,
} as const;

const labelSx = { fontSize: 12, fontWeight: 700, color: SECONDARY } as const;

export default function DocumentRegisterDialog({ open, title, onClose, onSubmit }: Props) {
  const [effectiveDate, setEffectiveDate] = useState('2026/01/01');
  const [effectiveTime, setEffectiveTime] = useState('00:00');
  const [endDate, setEndDate] = useState('2026/01/01');
  const [endTime, setEndTime] = useState('24:00');
  const [noEndDate, setNoEndDate] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) {
      return;
    }
    setFiles((prev) => [...prev, ...Array.from(list)]);
  };

  const handleRemove = (target: File) => {
    setFiles((prev) => prev.filter((file) => file !== target));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    addFiles(event.dataTransfer.files);
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      return;
    }
    onSubmit?.(files);
  };

  const hasFiles = files.length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: {
        borderRadius: 4, width: 720, maxWidth: 720,
        height: 750, maxHeight: 'calc(100% - 64px)',
        display: 'flex', flexDirection: 'column',
      } }}
    >
      {/* 헤더 (Fixed) */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 3, flexShrink: 0 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: DARK }}>{title}</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon sx={{ fontSize: 20, color: SECONDARY }} />
        </IconButton>
      </Box>

      {/* 본문 (상단 필드 Fixed, 파일 영역 scrollable) */}
      <Box sx={{ px: 3, pb: 3, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 반영/종료 일시 */}
        <Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              label="반영일자"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ endAdornment: (
                <InputAdornment position="end">
                  <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: SECONDARY }} />
                </InputAdornment>
              ) }}
              sx={{ ...FIELD_SX, width: noEndDate ? 332 : undefined, flex: noEndDate ? 'none' : 1 }}
            />
            <FormControl sx={{ flex: 1, ...FIELD_SX }}>
              <InputLabel shrink sx={labelSx}>반영시간</InputLabel>
              <Select value={effectiveTime} label="반영시간" onChange={(e) => setEffectiveTime(e.target.value)} sx={selectFieldSx}>
                {TIME_OPTIONS.map((opt) => (<MenuItem key={opt} value={opt}>{opt}</MenuItem>))}
              </Select>
            </FormControl>
            {!noEndDate && (
              <>
                <Typography sx={{ fontSize: 12, color: SECONDARY, flexShrink: 0 }}>~</Typography>
                <TextField
                  label="종료일자"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ endAdornment: (
                    <InputAdornment position="end">
                      <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: SECONDARY }} />
                    </InputAdornment>
                  ) }}
                  sx={{ ...FIELD_SX, flex: 1 }}
                />
                <FormControl sx={{ flex: 1, ...FIELD_SX }}>
                  <InputLabel shrink sx={labelSx}>종료시간</InputLabel>
                  <Select value={endTime} label="종료시간" onChange={(e) => setEndTime(e.target.value)} sx={selectFieldSx}>
                    {TIME_OPTIONS.map((opt) => (<MenuItem key={opt} value={opt}>{opt}</MenuItem>))}
                  </Select>
                </FormControl>
              </>
            )}
          </Box>
          {/* helper */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pl: 1.5, pt: 1 }}>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: SECONDARY }} />
            <Typography sx={{ fontSize: 12, color: SECONDARY }}>
              문서 반영일자는 익일 00:00부터 선택할 수 있습니다.
            </Typography>
          </Box>
        </Box>

        {/* 종료일자 미지정 */}
        <FormControlLabel
          sx={{ m: 0 }}
          control={
            <Checkbox
              size="small"
              checked={noEndDate}
              onChange={(e) => setNoEndDate(e.target.checked)}
              sx={{ color: 'var(--nab-text-disabled)', '&.Mui-checked': { color: DARK } }}
            />
          }
          label={<Typography sx={{ fontSize: 14, color: DARK }}>종료일자 미지정</Typography>}
        />

        {/* 파일 첨부 테이블 (헤더 Fixed, 목록 scrollable) */}
        <Box
          sx={{
            border: `1px solid ${DIVIDER}`, borderRadius: 2, overflow: 'hidden',
            display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0,
          }}
        >
          <Box sx={{ bgcolor: 'var(--nab-header-bg)', py: 2, textAlign: 'center', flexShrink: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: SECONDARY }}>파일명</Typography>
          </Box>
          {hasFiles ? (
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
              {files.map((file) => (
                <Box
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, borderTop: `1px solid ${DIVIDER}` }}
                >
                  <Typography sx={{ flex: 1, fontSize: 14, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.name}
                  </Typography>
                  <IconButton size="small" onClick={() => handleRemove(file)}>
                    <CancelIcon sx={{ fontSize: 18, color: SECONDARY }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              sx={{
                flex: 1, m: 1.5, px: 5,
                border: `1px dashed ${dragOver ? PRIMARY_ORANGE : 'var(--nab-border)'}`,
                borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', cursor: 'pointer',
              }}
            >
              <Typography sx={{ fontSize: 14, color: DISABLED, lineHeight: 1.6 }}>
                첨부할 파일을 드래그하여 놓거나 클릭하여 첨부해 주세요.
                <br />
                지원 형식: PDF, CSV, DOCX
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* 하단 액션 (Fixed) */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, px: 3, py: 3, borderTop: `1px solid ${DIVIDER}`, flexShrink: 0 }}>
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={DOCUMENT_ACCEPT}
          onChange={(e) => addFiles(e.target.files)}
        />
        <Button
          variant="outlined"
          onClick={() => inputRef.current?.click()}
          sx={{
            height: 40, px: 2, borderRadius: 2, fontSize: 14, fontWeight: 400,
            color: DARK, borderColor: 'var(--nab-border-strong)',
            '&:hover': { borderColor: SECONDARY, bgcolor: 'transparent' },
          }}
        >
          파일 첨부
        </Button>
        <Button
          variant="contained"
          disabled={!hasFiles}
          onClick={handleSubmit}
          sx={{
            height: 40, px: 2, borderRadius: 2, fontSize: 14, fontWeight: 500,
            bgcolor: 'var(--nab-button)', color: 'white', boxShadow: 'none',
            '&:hover': { bgcolor: 'var(--nab-button-hover)', boxShadow: 'none' },
            '&.Mui-disabled': { bgcolor: 'rgba(140,149,157,0.2)', color: 'rgba(140,149,157,0.64)' },
          }}
        >
          문서 등록
        </Button>
      </Box>
    </Dialog>
  );
}
