import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Typography, Chip, IconButton, Stack } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import Sidebar from './Sidebar';
import type { NavSection } from './Sidebar';

const DARK = '#272b2f';
const SECONDARY = '#737c85';
const PRIMARY_ORANGE = '#fa6600';

// 모든 서비스가 공통으로 사용하는 사이드바 네비게이션.
// `active`는 현재 경로(useLocation)에 따라 동적으로 계산한다.
function buildNavSections(pathname: string): NavSection[] {
  const isActive = (path: string) => pathname === path;
  return [
    {
      header: 'AI 비서',
      items: [
        {
          label: '고객 Plus AI 관리',
          defaultExpanded: true,
          children: [
            { label: '서비스 관리', icon: <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />, active: isActive('/service-management'), disabled: false, path: '/service-management' },
            { label: '프롬프트 관리', icon: <ArticleOutlinedIcon sx={{ fontSize: 20 }} />, active: isActive('/prompt-management'), disabled: false, path: '/prompt-management' },
            { label: '서비스 통계', icon: <BarChartOutlinedIcon sx={{ fontSize: 20 }} />, active: isActive('/statistics'), disabled: false, path: '/statistics' },
          ],
        },
        {
          label: '상담 Plus AI',
          defaultExpanded: true,
          children: [
            { label: '통계 관리', icon: <BarChartOutlinedIcon sx={{ fontSize: 20 }} />, active: false, disabled: false },
            { label: '문서 관리', icon: <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />, active: isActive('/document-management'), disabled: false, path: '/document-management' },
            { label: '권한 관리', icon: <SecurityOutlinedIcon sx={{ fontSize: 20 }} />, active: false, disabled: false },
            { label: '질문항목 관리', icon: <ArticleOutlinedIcon sx={{ fontSize: 20 }} />, active: false, disabled: true },
            { label: '프롬프트 관리', icon: <ArticleOutlinedIcon sx={{ fontSize: 20 }} />, active: false, disabled: true },
            { label: '서비스 설정', icon: <SettingsIcon sx={{ fontSize: 20 }} />, active: false, disabled: true },
          ],
        },
        { label: '세일즈 Plus AI', children: [] },
      ],
    },
  ];
}

function Header() {
  return (
    <Box sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 5, bgcolor: 'white', flexShrink: 0 }}>
      <Stack direction="row" spacing={3} alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label="강남GA사업단 · IT운영팀" variant="outlined" size="small" sx={{ fontSize: 13, color: DARK, borderColor: 'rgba(140,149,157,0.48)', height: 32, borderRadius: 2 }} />
          <Typography sx={{ fontSize: 14, color: DARK }}>김한화님</Typography>
        </Stack>
        <Chip label="관리자 모드" size="small" sx={{ fontSize: 13, color: PRIMARY_ORANGE, bgcolor: 'rgba(250,102,0,0.08)', border: 'none', height: 32, borderRadius: 2, fontWeight: 600 }} />
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton size="small" sx={{ width: 28, height: 28 }}>
            <LogoutIcon sx={{ fontSize: 20, color: SECONDARY }} />
          </IconButton>
          <Typography sx={{ fontSize: 14, color: SECONDARY }}>Logout</Typography>
        </Stack>
        <IconButton size="medium" sx={{ width: 40, height: 40 }}>
          <SettingsIcon sx={{ fontSize: 24, color: DARK }} />
        </IconButton>
      </Stack>
    </Box>
  );
}

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { pathname } = useLocation();
  const sections = buildNavSections(pathname);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} sections={sections} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header />
        <Box sx={{ flex: 1, overflow: 'auto', px: 5, pb: 11 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
