import { Box, Typography } from '@mui/material';
import { DARK } from '../../_lib/tokens';

const GUIDE_LINES = [
  'AI 메시지 생성에 적용되는 공통 프롬프트 규칙을 확인할 수 있습니다.',
  '서비스 목적, 금지 사항, 파라미터 정의, 메시지 생성 규칙 등 프롬프트 작성 가이드가 노출되는 영역입니다.',
  '공통 가이드는 빈번한 수정이 되지 않도록 작성 되어야 합니다.',
  '작성 내용이 많은 경우 내부 스크롤 됩니다.',
];

export default function PromptGuide() {
  return (
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ minHeight: 400, maxHeight: 718, overflowY: 'auto' }}>
        {GUIDE_LINES.map((line) => (
          <Typography key={line} sx={{ fontSize: 16, lineHeight: '24px', color: DARK }}>
            {line}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
