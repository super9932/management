/* =============================================================================
 * ⚠️ [로컬 개발 전용] 사번 로그인 화면 — 배포 환경 반입 금지
 *
 * 배포 환경(개발 서버 포함)에서는 로그인을 상위 템플릿이 담당한다.
 * 이 화면은 개발자 로컬 머신에서 토큰을 직접 발급받기 위한 것으로,
 * App.tsx 가 개발 빌드 + 로컬 호스트일 때만 라우트를 등록한다.
 * 배경은 src/dev/nab-dev-login.ts 상단 주석 참고.
 * =============================================================================
 */
import { useState } from 'react';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { nabDevLogin } from './nab-dev-login';
import { setNabTokens } from './nab-token';

/** 로그인 성공 후 이동할 기본 화면 */
const REDIRECT_TO = '/prompt-management';

/** 사번으로 NAB 토큰을 발급받는 개발용 로그인 화면 */
export default function DevLogin() {
  const navigate = useNavigate();

  const [emnb, setEmnb] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      setNabTokens(await nabDevLogin(emnb));
      navigate(REDIRECT_TO, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '로그인에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
      <Paper sx={{ width: '100%', maxWidth: 400, p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h6">사번 로그인</Typography>
              <Typography variant="body2" color="text.secondary">
                개발 확인용입니다. 사번으로 NAB 토큰을 발급받습니다.
              </Typography>
            </Box>

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <TextField
              label="사번"
              value={emnb}
              onChange={(event) => setEmnb(event.target.value)}
              placeholder="예: 2220030"
              autoFocus
              fullWidth
            />

            <Button type="submit" variant="contained" size="large" disabled={!emnb.trim() || isSubmitting} fullWidth>
              {isSubmitting ? '발급 중...' : '로그인'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
