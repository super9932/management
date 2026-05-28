import { useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Switch,
  Divider,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DARK = '#272b2f';
const SECONDARY = '#737c85';
const OUTLINE = 'rgba(140,149,157,0.2)';

const TIME_OPTIONS = [
  '00:00:00', '01:00:00', '02:00:00', '03:00:00', '04:00:00', '05:00:00',
  '06:00:00', '07:00:00', '08:00:00', '09:00:00', '10:00:00', '11:00:00',
  '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00',
  '18:00:00', '19:00:00', '20:00:00', '21:00:00', '22:00:00', '23:00:00',
];

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '& fieldset': { borderColor: OUTLINE },
    '&:hover fieldset': { borderColor: 'rgba(140,149,157,0.5)' },
  },
  '& .MuiInputLabel-root': { fontSize: 12, fontWeight: 700, color: SECONDARY },
  '& .MuiInputBase-input': { fontSize: 14, color: DARK },
};

const iosSwitchSx = {
  width: 33,
  height: 20,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: '2px',
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(13px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#34c759',
        opacity: 1,
        border: 0,
      },
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.5,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 16,
    height: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    opacity: 1,
    transition: 'background-color 300ms',
  },
};

const attachBtnSx = {
  bgcolor: 'rgba(140,149,157,0.16)',
  color: DARK,
  borderRadius: 2,
  fontSize: 12,
  fontWeight: 400,
  px: 1,
  height: 30,
  minWidth: 64,
  flexShrink: 0,
  boxShadow: 'none',
  '&:hover': { bgcolor: 'rgba(140,149,157,0.28)', boxShadow: 'none' },
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DocumentRegistrationDialog({ open, onClose }: Props) {
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [allDay, setAllDay] = useState(false);
  const [noEndDate, setNoEndDate] = useState(false);
  const [reflectionDate, setReflectionDate] = useState('2026/01/01');
  const [reflectionTime, setReflectionTime] = useState('09:00:00');
  const [endDate, setEndDate] = useState('2027/01/01');
  const [endTime, setEndTime] = useState('17:00:00');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '-40px 40px 80px -8px rgba(0,0,0,0.24)',
          width: 560,
          maxWidth: '100%',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 3,
          py: 3,
          pr: 1.5,
          pb: 2,
        }}
      >
        <Typography sx={{ flex: 1, fontSize: 18, fontWeight: 700, color: '#212b36', lineHeight: '28px' }}>
          문서 등록
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ width: 28, height: 28 }}>
          <CloseIcon sx={{ fontSize: 18, color: DARK }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 0, pb: 3, overflow: 'visible' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* PDF 문서 */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
            />
            <TextField
              fullWidth
              label="PDF 문서"
              required
              placeholder="PDF 파일을 첨부해주세요"
              value={pdfFile?.name ?? ''}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              sx={{ ...fieldSx, '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], height: 48 } }}
            />
            <Button variant="text" sx={attachBtnSx} onClick={() => pdfInputRef.current?.click()}>파일첨부</Button>
          </Box>

          {/* CSV 문서 */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
            />
            <TextField
              fullWidth
              label="CSV 문서"
              required
              placeholder="CSV 파일을 첨부해주세요"
              value={csvFile?.name ?? ''}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              sx={{ ...fieldSx, '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], height: 48 } }}
            />
            <Button variant="text" sx={attachBtnSx} onClick={() => csvInputRef.current?.click()}>파일첨부</Button>
          </Box>

          {/* 스위치 */}
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.125, flex: 1 }}>
              <Switch
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                sx={iosSwitchSx}
              />
              <Typography sx={{ fontSize: 14, color: DARK }}>하루 종일</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.125, flex: 1 }}>
              <Switch
                checked={noEndDate}
                onChange={(e) => setNoEndDate(e.target.checked)}
                sx={iosSwitchSx}
              />
              <Typography sx={{ fontSize: 14, color: DARK }}>종료일 미지정</Typography>
            </Box>
          </Box>

          {/* 반영일 */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="반영일"
              value={reflectionDate}
              onChange={(e) => setReflectionDate(e.target.value)}
              disabled={allDay}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
            <FormControl fullWidth disabled={allDay} sx={fieldSx}>
              <Select
                value={reflectionTime}
                onChange={(e) => setReflectionTime(e.target.value)}
                sx={{ fontSize: 14, color: DARK, '& .MuiOutlinedInput-notchedOutline': { borderColor: OUTLINE }, borderRadius: 2 }}
              >
                {TIME_OPTIONS.map((t) => (
                  <MenuItem key={t} value={t} sx={{ fontSize: 14 }}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* 종료일 */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="종료일"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={noEndDate || allDay}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
            <FormControl fullWidth disabled={noEndDate || allDay} sx={fieldSx}>
              <Select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                sx={{ fontSize: 14, color: DARK, '& .MuiOutlinedInput-notchedOutline': { borderColor: OUTLINE }, borderRadius: 2 }}
              >
                {TIME_OPTIONS.map((t) => (
                  <MenuItem key={t} value={t} sx={{ fontSize: 14 }}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

        </Box>
      </DialogContent>

      <Divider sx={{ borderColor: 'rgba(145,158,171,0.2)' }} />

      <DialogActions sx={{ px: 3, py: 3, gap: 1.5 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: '#485059',
            color: 'white',
            borderRadius: 2,
            fontSize: 14,
            fontWeight: 400,
            px: 1.5,
            height: 36,
            minWidth: 64,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#3a4148', boxShadow: 'none' },
          }}
        >
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
}
