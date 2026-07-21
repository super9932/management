import { useState } from 'react';
import { Box, Typography, Card, Breadcrumbs, Button } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ServiceToggleRow from '../components/ServiceToggleRow';
import { DARK, DISABLED, PRIMARY_ORANGE, CARD_SHADOW } from '../../../../theme';
import { SERVICE_TOGGLES, INITIAL_TOGGLE_STATE } from '../constant';
import type { ServiceToggleState } from '../type';

export default function ServiceManagementView() {
  const [toggles, setToggles] = useState<ServiceToggleState>(INITIAL_TOGGLE_STATE);

  const handleToggle = (key: string, value: boolean) =>
    setToggles((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      {/* Breadcrumb + Title */}
      <Box sx={{ mb: 5, pt: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>AI 비서</Typography>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>고객 Plus AI 관리</Typography>
          <Typography sx={{ fontSize: 14, color: DISABLED }}>서비스 관리</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 700, color: DARK, fontSize: 24 }}>
          서비스 관리
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
        {/* 스위치 목록 */}
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {SERVICE_TOGGLES.map((item) => (
            <ServiceToggleRow
              key={item.key}
              label={item.label}
              helper={item.helper}
              checked={toggles[item.key]}
              onChange={(v) => handleToggle(item.key, v)}
            />
          ))}
        </Box>

        {/* 저장 버튼 */}
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
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
      </Card>
    </>
  );
}
