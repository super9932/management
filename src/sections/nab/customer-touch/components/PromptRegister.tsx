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
  DISABLED,
  DIVIDER,
  FIELD_SX,
  PRIMARY_ORANGE,
  SECONDARY,
} from '../../_lib/tokens';
import { promptItemLabel } from '../constant';
import type { PromptCategoryItem } from '../../../../api/nab/customer-touch';

interface Props {
  /** 'register' = 등록(취소 버튼) / 'edit' = 수정(삭제 버튼) */
  mode?: 'register' | 'edit';
  contentsId?: string;
  /** 조회·저장 중에는 입력과 버튼을 잠근다 */
  busy?: boolean;
  /** 서버 카탈로그(prompt/categories) — 유형·카테고리 셀렉트 소스 */
  categories: PromptCategoryItem[];
  /** 유형 = API category 코드. 미선택은 빈 문자열 ('전체'는 조회 전용이라 등록에는 없다) */
  type: string;
  /** 유형이 바뀌면 카테고리는 미선택으로 되돌린다 */
  onTypeChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  promptName: string;
  onPromptNameChange: (v: string) => void;
  instruction: string;
  onInstructionChange: (v: string) => void;
  onList: () => void;
  /** 등록 모드의 '취소' */
  onCancel: () => void;
  /** 수정 모드의 '삭제' */
  onDelete?: () => void;
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

/** 미선택 상태를 회색 안내 문구로 보여준다 */
const placeholder = (text: string) => <Typography sx={{ fontSize: 14, color: DISABLED }}>{text}</Typography>;

export default function PromptRegister({
  mode = 'register',
  contentsId = '',
  busy = false,
  categories,
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
  onDelete,
  onSave,
}: Props) {
  const isEdit = mode === 'edit';
  const selected = categories.find((category) => category.code === type);
  // 항목은 { item: '...' } 객체로 내려오므로 코드만 뽑아 쓴다
  const items = (selected?.items ?? []).map((entry) => entry.item);

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
                borderColor: 'var(--nab-border)',
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
              renderValue={(value) =>
                value
                  ? (categories.find((category) => category.code === value)?.label ?? String(value))
                  : placeholder('유형을 선택해주세요')
              }
              onChange={(e) => onTypeChange(e.target.value)}
              sx={SELECT_SX}
            >
              {categories.map((category) => (
                <MenuItem key={category.code} value={category.code}>{category.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 카테고리 — 선택된 유형의 2depth 목록으로 연동된다 */}
          <FormControl sx={{ width: 246, ...FIELD_SX }} disabled={type === ''}>
            <InputLabel shrink sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY }}>
              {requiredLabel('카테고리')}
            </InputLabel>
            <Select
              value={category}
              label="카테고리 *"
              displayEmpty
              renderValue={(value) =>
                value
                  ? promptItemLabel(String(value))
                  : placeholder(type === '' ? '유형을 먼저 선택해주세요' : '카테고리를 선택해주세요')
              }
              onChange={(e) => onCategoryChange(e.target.value)}
              sx={SELECT_SX}
            >
              {items.map((item) => (
                <MenuItem key={item} value={item}>{promptItemLabel(item)}</MenuItem>
              ))}
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
                '&:hover fieldset': { borderColor: 'var(--nab-border-hover)' },
              },
              '& .MuiInputBase-inputMultiline': { px: 2, py: 1.5, color: DARK, minHeight: 88 },
            }}
          />
        </Box>

        {/* 버튼 영역 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            onClick={onList}
            disabled={busy}
            startIcon={<ChevronLeftIcon sx={{ fontSize: 24 }} />}
            sx={{
              height: 48, px: 2, minWidth: 64, borderRadius: 2, color: DARK,
              fontSize: 15, fontWeight: 400, bgcolor: 'transparent',
              '&:hover': { bgcolor: 'var(--nab-hover-secondary)' },
            }}
          >
            목록
          </Button>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              onClick={isEdit ? onDelete : onCancel}
              disabled={busy}
              variant="contained"
              sx={{
                height: 48, px: 2, minWidth: 64, borderRadius: 2, bgcolor: BUTTON_DARK, color: 'white',
                fontSize: 15, fontWeight: 400, boxShadow: 'none',
                '&:hover': { bgcolor: 'var(--nab-button-hover)', boxShadow: 'none' },
              }}
            >
              {isEdit ? '삭제' : '취소'}
            </Button>
            <Button
              onClick={onSave}
              disabled={busy}
              variant="contained"
              sx={{
                height: 48, px: 2, minWidth: 64, borderRadius: 2, bgcolor: PRIMARY_ORANGE, color: 'white',
                fontSize: 15, fontWeight: 400, boxShadow: 'none',
                '&:hover': { bgcolor: 'var(--nab-primary-hover)', boxShadow: 'none' },
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
