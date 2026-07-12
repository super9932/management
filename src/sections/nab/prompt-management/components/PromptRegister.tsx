import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {
  BUTTON_DARK,
  CARD_SHADOW,
  DARK,
  DIVIDER,
  FIELD_SX,
  PRIMARY_ORANGE,
  SECONDARY,
} from '../../../../theme';

interface Props {
  contentsId?: string;
  type: string;
  onTypeChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  promptName: string;
  onPromptNameChange: (v: string) => void;
  instruction: string;
  onInstructionChange: (v: string) => void;
  onList: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const requiredLabel = (text: string) => (
  <>
    {text} <span style={{ color: PRIMARY_ORANGE }}>*</span>
  </>
);

const SELECT_SX = {
  fontSize: 14,
  height: 54,
  borderRadius: 2,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: DIVIDER },
} as const;

export default function PromptRegister({
  contentsId = '',
  type,
  onTypeChange,
  category,
  onCategoryChange,
  promptName,
  onPromptNameChange,
  instruction,
  onInstructionChange,
  onList,
  onCancel,
  onSave,
}: Props) {
  return (
    <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Input fields */}
        <Box sx={{ pt: 2.5, display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* 콘텐츠 ID (비활성) */}
          <TextField
            label="콘텐츠 ID"
            placeholder="0000"
            value={contentsId}
            disabled
            InputLabelProps={{ shrink: true }}
            sx={{
              width: 246,
              ...FIELD_SX,
              '& .MuiOutlinedInput-root fieldset': {
                borderStyle: 'dashed',
                borderColor: 'rgba(140,149,157,0.2)',
              },
            }}
          />

          {/* 유형 */}
          <FormControl sx={{ width: 246, ...FIELD_SX }}>
            <InputLabel shrink sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY }}>
              {requiredLabel('유형')}
            </InputLabel>
            <Select
              value={type}
              label="유형 *"
              displayEmpty
              onChange={(e) => onTypeChange(e.target.value)}
              sx={SELECT_SX}
            >
              <MenuItem value="전체">전체</MenuItem>
              <MenuItem value="유형1">유형1</MenuItem>
              <MenuItem value="유형2">유형2</MenuItem>
            </Select>
          </FormControl>

          {/* 카테고리 */}
          <FormControl sx={{ width: 246, ...FIELD_SX }}>
            <InputLabel shrink sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY }}>
              {requiredLabel('카테고리')}
            </InputLabel>
            <Select
              value={category}
              label="카테고리 *"
              displayEmpty
              onChange={(e) => onCategoryChange(e.target.value)}
              sx={SELECT_SX}
            >
              <MenuItem value="전체">전체</MenuItem>
              <MenuItem value="카테고리1">카테고리1</MenuItem>
              <MenuItem value="카테고리2">카테고리2</MenuItem>
            </Select>
          </FormControl>

          {/* 프롬프트명 */}
          <TextField
            label={requiredLabel('프롬프트명')}
            placeholder="프롬프트명을 작성해주세요"
            value={promptName}
            onChange={(e) => onPromptNameChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1, minWidth: 300, ...FIELD_SX }}
          />
        </Box>

        {/* 프롬프트 지침 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography sx={{ fontSize: 14, color: DARK }}>프롬프트 지침 (필수)</Typography>
          <TextField
            multiline
            rows={4}
            placeholder="프롬프트 지침은 최대한 구체적이고 자세하게 작성 해주세요"
            value={instruction}
            onChange={(e) => onInstructionChange(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: 14,
                alignItems: 'flex-start',
                p: 0,
                '& fieldset': { borderColor: DIVIDER },
                '&:hover fieldset': { borderColor: 'rgba(140,149,157,0.5)' },
              },
              '& .MuiInputBase-inputMultiline': { px: 2, py: 1.5, color: DARK, minHeight: 88 },
            }}
          />
        </Box>

        {/* 버튼 영역 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            onClick={onList}
            startIcon={<ChevronLeftIcon sx={{ fontSize: 24 }} />}
            sx={{
              height: 48, px: 2, minWidth: 64, borderRadius: 2, color: DARK,
              fontSize: 15, fontWeight: 400, bgcolor: 'transparent',
              '&:hover': { bgcolor: 'rgba(115,124,133,0.08)' },
            }}
          >
            목록
          </Button>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              onClick={onCancel}
              variant="contained"
              sx={{
                height: 48, px: 2, minWidth: 64, borderRadius: 2, bgcolor: BUTTON_DARK, color: 'white',
                fontSize: 15, fontWeight: 400, boxShadow: 'none',
                '&:hover': { bgcolor: '#3a4048', boxShadow: 'none' },
              }}
            >
              취소
            </Button>
            <Button
              onClick={onSave}
              variant="contained"
              sx={{
                height: 48, px: 2, minWidth: 64, borderRadius: 2, bgcolor: PRIMARY_ORANGE, color: 'white',
                fontSize: 15, fontWeight: 400, boxShadow: 'none',
                '&:hover': { bgcolor: '#e05a00', boxShadow: 'none' },
              }}
            >
              저장
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
