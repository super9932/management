import { Box, Tabs, Tab, Divider } from '@mui/material';
import { DARK, SECONDARY, DIVIDER } from '../../_lib/tokens';

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export default function PromptTabs({ value, onChange }: Props) {
  return (
    <>
      <Box sx={{ px: 2.5 }}>
        <Tabs
          value={value}
          onChange={(_, v) => onChange(v)}
          sx={{
            '& .MuiTab-root': { fontSize: 14, color: SECONDARY, minHeight: 48, fontWeight: 400 },
            '& .Mui-selected': { color: DARK, fontWeight: 600 },
            '& .MuiTabs-indicator': { backgroundColor: DARK, height: 2 },
            '& .MuiTabs-flexContainer': { gap: 4 },
          }}
        >
          <Tab label="프롬프트 공통 가이드" />
          <Tab label="AI 메시지 생성" />
        </Tabs>
      </Box>
      <Divider sx={{ borderColor: DIVIDER }} />
    </>
  );
}
