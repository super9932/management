import { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  TextField,
  Button,
  Breadcrumbs,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  Divider,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import DocumentRegistrationDialog from '../components/DocumentRegistrationDialog';

const PRIMARY_ORANGE = '#fa6600';
const DARK = '#272b2f';
const SECONDARY = '#737c85';
const DISABLED = '#8c959d';
const DIVIDER = 'rgba(145,158,171,0.2)';
const SIDEBAR_BG = '#ffffff';
const CARD_SHADOW = '0px 0px 2px 0px rgba(25,28,31,0.08), 0px 12px 24px -4px rgba(25,28,31,0.06)';

type RegistrationStatus = '진행' | '실패' | '완료';
type OperationStatus = '대기' | '운영' | '미운영';

interface DocumentRow {
  id: number;
  code1: string;
  code2: string;
  salePeriodStart: string;
  salePeriodEnd: string;
  documentName: string;
  registrant: string;
  registrationDate: string;
  registrationStatus: RegistrationStatus;
  reflectionDate: string;
  endDate: string;
  operationStatus: OperationStatus;
}

const rows: DocumentRow[] = [
  { id: 999, code1: '1609-045~048', code2: '2247-A01~A09', salePeriodStart: '2027.01.10 ~', salePeriodEnd: '2027.03.31', documentName: '(무)대한변액CI보험_1609-045~048_약관_20080401~20080630.pdf', registrant: '김한화', registrationDate: '2026.05.01', registrationStatus: '진행', reflectionDate: '26.01.01 08:00:00', endDate: '27.01.01 17:00:00', operationStatus: '대기' },
  { id: 998, code1: '1743-017~026', code2: '1744-003', salePeriodStart: '2027.01.10 ~', salePeriodEnd: '2027.03.31', documentName: '(무)스마트CI통합보험_1743-017~026, 1744-003_약관_20130401~20130915.pdf', registrant: '김한화', registrationDate: '2026.05.01', registrationStatus: '실패', reflectionDate: '26.01.01 08:00:00', endDate: '27.01.01 17:00:00', operationStatus: '대기' },
  { id: 997, code1: '1818-027~050', code2: '1832-002', salePeriodStart: '2027.01.10 ~', salePeriodEnd: '2027.03.31', documentName: '한화생명 프라임통합종신보험(무)[저해지환급형]_1818-027~050, 1832-002_약관_20170101~20170331.pdf', registrant: '김한화', registrationDate: '2026.05.01', registrationStatus: '완료', reflectionDate: '27.01.01 08:00:00', endDate: '27.01.01 17:00:00', operationStatus: '대기' },
  { id: 996, code1: '1880-001~003', code2: '-', salePeriodStart: '2018.08.08 ~', salePeriodEnd: '-', documentName: '한화생명 The착한 암보험 무배당_1880-001~003_약관_20180808~ .pdf', registrant: '김한화', registrationDate: '2026.05.01', registrationStatus: '완료', reflectionDate: '26.01.01 08:00:00', endDate: '27.01.01 17:00:00', operationStatus: '운영' },
  { id: 995, code1: '1880-001~003', code2: '-', salePeriodStart: '2019.01.01 ~', salePeriodEnd: '-', documentName: '한화생명 The착한 암보험 무배당_1880-001~003_약관_20190101~ .pdf', registrant: '김한화', registrationDate: '2026.05.01', registrationStatus: '완료', reflectionDate: '26.01.01 08:00:00', endDate: '-', operationStatus: '운영' },
  { id: 994, code1: '1902-001~006', code2: '-', salePeriodStart: '2019.10.01~', salePeriodEnd: '-', documentName: '한화생명 CI 가입고객을 위한 보장보험(무)_1902-001~006_약관_20191001~ .pdf', registrant: '김한화', registrationDate: '2026.05.01', registrationStatus: '완료', reflectionDate: '26.01.01 08:00:00', endDate: '27.01.01 17:00:00', operationStatus: '운영' },
  { id: 993, code1: '1930-001~004', code2: '-', salePeriodStart: '2020.04.01 ~', salePeriodEnd: '-', documentName: '한화생명 실속있어좋은 GI보험 무배당_1930-001~004_약관_20200401~ .pdf', registrant: '김한화', registrationDate: '2026.05.01', registrationStatus: '완료', reflectionDate: '26.01.01 08:00:00', endDate: '27.01.01 17:00:00', operationStatus: '미운영' },
  { id: 992, code1: '2010-001~002', code2: '-', salePeriodStart: '2022.06.01~', salePeriodEnd: '-', documentName: '한화생명 시그니처 암보험 무배당 _2010-001~002_약관_20220601~ .pdf', registrant: '김한화', registrationDate: '2026.05.01', registrationStatus: '완료', reflectionDate: '26.05.01 08:00:00', endDate: '26.03.31 17:00:00', operationStatus: '미운영' },
  { id: 991, code1: '2139-A01', code2: '-', salePeriodStart: '2025.01.01~', salePeriodEnd: '-', documentName: '한화생명 H건강보험(Basic) 무배당_2139-A01_약관_20250101~ _2.pdf', registrant: '김한화', registrationDate: '2026.05.01', registrationStatus: '완료', reflectionDate: '26.05.01 08:00:00', endDate: '-', operationStatus: '운영' },
  { id: 990, code1: '2204-A01', code2: '-', salePeriodStart: '2024.11.01~', salePeriodEnd: '-', documentName: '한화생명 The 시그니처 암보험 무배당_2204-A01_약관_20241101~ .pdf', registrant: '김한화', registrationDate: '2026.05.01', registrationStatus: '완료', reflectionDate: '26.05.01 08:00:00', endDate: '-', operationStatus: '운영' },
];

function registrationStatusChip(status: RegistrationStatus) {
  const config = {
    진행: { color: '#1e5ad2', bg: 'rgba(30,90,210,0.08)' },
    실패: { color: '#a71313', bg: 'rgba(167,19,19,0.08)' },
    완료: { color: '#34745d', bg: 'rgba(52,116,93,0.08)' },
  };
  const { color, bg } = config[status];
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1, py: 0.25, borderRadius: '6px', bgcolor: bg }}>
      <Typography sx={{ fontSize: 12, color, fontWeight: 600 }}>{status}</Typography>
    </Box>
  );
}

function operationStatusChip(status: OperationStatus) {
  const config = {
    대기: { color: SECONDARY, bg: 'rgba(140,149,157,0.08)' },
    운영: { color: '#34745d', bg: 'rgba(52,116,93,0.08)' },
    미운영: { color: '#c0750c', bg: 'rgba(192,117,12,0.08)' },
  };
  const { color, bg } = config[status];
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1, py: 0.25, borderRadius: '6px', bgcolor: bg }}>
      <Typography sx={{ fontSize: 12, color, fontWeight: 600 }}>{status}</Typography>
    </Box>
  );
}

function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const [consultExpanded, setConsultExpanded] = useState(true);

  const navSections = [
    {
      header: 'AI 비서',
      items: [
        {
          label: '고객 Plus AI',
          type: 'collapsible' as const,
          expanded: false,
          onToggle: () => {},
          children: [],
        },
        {
          label: '상담 Plus AI',
          type: 'collapsible' as const,
          expanded: consultExpanded,
          onToggle: () => setConsultExpanded((v) => !v),
          children: [
            { label: '통계 관리', icon: <BarChartOutlinedIcon sx={{ fontSize: 20 }} />, active: false, disabled: false },
            { label: '문서 관리', icon: <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />, active: true, disabled: false },
            { label: '권한 관리', icon: <SecurityOutlinedIcon sx={{ fontSize: 20 }} />, active: false, disabled: false },
            { label: '질문항목 관리', icon: <ArticleOutlinedIcon sx={{ fontSize: 20 }} />, active: false, disabled: true },
            { label: '프롬프트 관리', icon: <ArticleOutlinedIcon sx={{ fontSize: 20 }} />, active: false, disabled: true },
            { label: '서비스 설정', icon: <SettingsIcon sx={{ fontSize: 20 }} />, active: false, disabled: true },
          ],
        },
        {
          label: '세일즈 Plus AI',
          type: 'collapsible' as const,
          expanded: false,
          onToggle: () => {},
          children: [],
        },
      ],
    },
  ];

  return (
    <Box
      sx={{
        width: open ? 280 : 0,
        minWidth: open ? 280 : 0,
        bgcolor: SIDEBAR_BG,
        borderRight: `1px dashed ${DIVIDER}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'width 0.2s, min-width 0.2s',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2, pt: 3, pb: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            bgcolor: DARK,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 14 }}>H</Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, px: 2, overflow: 'auto' }}>
        {navSections.map((section) => (
          <Box key={section.header}>
            <Box sx={{ px: 1.5, pt: 2, pb: 1 }}>
              <Typography sx={{ fontSize: 11, color: DISABLED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {section.header}
              </Typography>
            </Box>
            {section.items.map((item) => (
              <Box key={item.label}>
                <ListItemButton
                  onClick={item.type === 'collapsible' ? item.onToggle : undefined}
                  sx={{
                    borderRadius: 1,
                    px: 1.5,
                    py: 0.75,
                    mb: 0.25,
                    minHeight: 44,
                    bgcolor: item.expanded ? 'rgba(140,149,157,0.08)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(140,149,157,0.08)' },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      color: item.expanded ? PRIMARY_ORANGE : SECONDARY,
                      fontWeight: item.expanded ? 600 : 400,
                      noWrap: true,
                    }}
                  />
                  {item.type === 'collapsible' && (
                    item.expanded
                      ? <KeyboardArrowDownIcon sx={{ fontSize: 16, color: SECONDARY }} />
                      : <KeyboardArrowRightIcon sx={{ fontSize: 16, color: SECONDARY }} />
                  )}
                </ListItemButton>
                {'children' in item && item.children.length > 0 && (
                  <Collapse in={item.expanded}>
                    <List disablePadding>
                      {item.children.map((child) => (
                        <ListItemButton
                          key={child.label}
                          disabled={child.disabled}
                          sx={{
                            borderRadius: 1,
                            px: 1.5,
                            py: 0.5,
                            mb: 0.25,
                            minHeight: 36,
                            bgcolor: child.active ? 'rgba(250,102,0,0.08)' : 'transparent',
                            '&:hover': { bgcolor: 'rgba(140,149,157,0.08)' },
                            '&.Mui-disabled': { opacity: 0.48 },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Box sx={{ color: child.active ? PRIMARY_ORANGE : SECONDARY }}>{child.icon}</Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={child.label}
                            primaryTypographyProps={{
                              fontSize: 14,
                              color: child.active ? DARK : SECONDARY,
                              fontWeight: child.active ? 600 : 400,
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box sx={{ px: 2, pt: 5, pb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
        <Box sx={{ bgcolor: DARK, borderRadius: 1, px: 1.5, py: 0.5, mb: 0.5 }}>
          <Typography sx={{ fontSize: 11, color: 'white', fontWeight: 700 }}>HANWHA</Typography>
        </Box>
        <Typography sx={{ fontSize: 14, color: DISABLED, textAlign: 'center' }}>한화생명 마이크로 웹 서비스</Typography>
      </Box>

      {/* Toggle button */}
      <Box
        onClick={onToggle}
        sx={{
          position: 'absolute',
          top: 24,
          right: -28,
          width: 28,
          height: 58,
          bgcolor: SIDEBAR_BG,
          border: `1px solid ${DIVIDER}`,
          borderLeft: 'none',
          borderRadius: '0 8px 8px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0px 16px 32px -4px rgba(25,28,31,0.08)',
          zIndex: 1,
        }}
      >
        <ChevronLeftIcon sx={{ fontSize: 20, color: SECONDARY }} />
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <Box
      sx={{
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: 5,
        bgcolor: 'white',
        flexShrink: 0,
      }}
    >
      <Stack direction="row" spacing={3} alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label="본사 ・ 보험AI팀"
            variant="outlined"
            size="small"
            sx={{ fontSize: 13, color: DARK, borderColor: 'rgba(140,149,157,0.48)', height: 32, borderRadius: 2 }}
          />
          <Typography sx={{ fontSize: 14, color: DARK }}>김한화님</Typography>
        </Stack>
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

export default function DocumentManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [searchType, setSearchType] = useState('전체');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const TOTAL = 999;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header />

        <Box sx={{ flex: 1, overflow: 'auto', px: 5, pb: 11 }}>
          {/* Breadcrumb + Title */}
          <Box sx={{ mb: 5, pt: 3 }}>
            <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 1 }}>
              <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>AI 에이전트</Typography>
              <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>상담 AI</Typography>
              <Typography sx={{ fontSize: 14, color: DISABLED }}>문서 관리</Typography>
            </Breadcrumbs>
            <Typography variant="h4" sx={{ fontWeight: 700, color: DARK, fontSize: 24 }}>
              문서 관리
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Tabs */}
            <Box sx={{ position: 'relative', px: 2.5 }}>
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                sx={{
                  '& .MuiTab-root': { fontSize: 14, color: SECONDARY, minHeight: 48, fontWeight: 400 },
                  '& .Mui-selected': { color: DARK, fontWeight: 600 },
                  '& .MuiTabs-indicator': { backgroundColor: DARK, height: 2 },
                  '& .MuiTabs-flexContainer': { gap: 5 },
                }}
              >
                <Tab label="Tab" icon={<DescriptionOutlinedIcon />} iconPosition="start" />
                <Tab label="Tab" icon={<DescriptionOutlinedIcon />} iconPosition="start" />
                <Tab label="Tab" icon={<DescriptionOutlinedIcon />} iconPosition="start" />
                <Tab label="Tab" icon={<DescriptionOutlinedIcon />} iconPosition="start" />
              </Tabs>
              <Divider sx={{ bgcolor: 'rgba(140,149,157,0.08)', height: 2, mt: '-2px' }} />
            </Box>

            {/* Filter Card */}
            <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
              <Box sx={{ p: 2.5, display: 'flex', gap: 1, alignItems: 'center' }}>
                <FormControl sx={{ width: 200 }} size="medium">
                  <InputLabel shrink sx={{ fontSize: 12, fontWeight: 700, color: SECONDARY }}>
                    검색어
                  </InputLabel>
                  <Select
                    value={searchType}
                    label="검색어"
                    onChange={(e) => setSearchType(e.target.value)}
                    sx={{
                      fontSize: 14,
                      borderRadius: 2,
                      height: 54,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: DIVIDER },
                    }}
                  >
                    <MenuItem value="전체">전체</MenuItem>
                    <MenuItem value="문서명">문서명</MenuItem>
                    <MenuItem value="등록자">등록자</MenuItem>
                    <MenuItem value="상품코드">상품코드</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  placeholder="검색어를 입력해주세요"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: DISABLED, opacity: 0.3 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: 14,
                      height: 54,
                      borderRadius: 2,
                      '& fieldset': { borderColor: DIVIDER },
                    },
                    '& input::placeholder': { color: DISABLED, opacity: 1 },
                  }}
                />

                <Button
                  variant="contained"
                  sx={{
                    height: 48,
                    px: 2,
                    borderRadius: 2,
                    bgcolor: '#485059',
                    color: 'white',
                    fontSize: 15,
                    fontWeight: 400,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#3a4048', boxShadow: 'none' },
                  }}
                >
                  조회
                </Button>
              </Box>
            </Card>

            {/* Table Card */}
            <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
              {/* Table Header */}
              <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 14, color: SECONDARY }}>
                  총 <strong style={{ color: DARK }}>{TOTAL.toLocaleString()}</strong>건
                </Typography>
              </Box>
              <Divider sx={{ borderColor: DIVIDER }} />

              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 900 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f6f7' }}>
                      {['번호', '상품/보종코드', '판매기간', '문서명', '등록자', '등록일', '등록상태', '반영/종료일', '운영상태'].map(
                        (col) => (
                          <TableCell
                            key={col}
                            sx={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: SECONDARY,
                              py: 1.5,
                              px: 2,
                              borderBottom: `1px solid ${DIVIDER}`,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {col}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          '&:hover': { bgcolor: 'rgba(245,246,247,0.8)' },
                          '& td': { borderBottom: `1px solid ${DIVIDER}` },
                        }}
                      >
                        <TableCell sx={{ fontSize: 13, color: DARK, py: 1.5, px: 2, fontWeight: 600 }}>
                          {row.id}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2 }}>
                          <Typography sx={{ fontSize: 12 }}>{row.code1}</Typography>
                          {row.code2 !== '-' && (
                            <Typography sx={{ fontSize: 12, color: SECONDARY }}>{row.code2}</Typography>
                          )}
                          {row.code2 === '-' && (
                            <Typography sx={{ fontSize: 12, color: SECONDARY }}>-</Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2, whiteSpace: 'nowrap' }}>
                          <Typography sx={{ fontSize: 12 }}>{row.salePeriodStart}</Typography>
                          <Typography sx={{ fontSize: 12 }}>{row.salePeriodEnd}</Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.5, px: 2, maxWidth: 280 }}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: DARK,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: 280,
                            }}
                            title={row.documentName}
                          >
                            {row.documentName}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2, whiteSpace: 'nowrap' }}>
                          {row.registrant}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2, whiteSpace: 'nowrap' }}>
                          {row.registrationDate}
                        </TableCell>
                        <TableCell sx={{ py: 1.5, px: 2 }}>
                          {registrationStatusChip(row.registrationStatus)}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: DARK, py: 1.5, px: 2, whiteSpace: 'nowrap' }}>
                          <Typography sx={{ fontSize: 12 }}>{row.reflectionDate}</Typography>
                          <Typography sx={{ fontSize: 12, color: SECONDARY }}>{row.endDate}</Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.5, px: 2 }}>
                          {operationStatusChip(row.operationStatus)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5, gap: 0.5, alignItems: 'center' }}>
              <IconButton size="small" sx={{ width: 40, height: 40, opacity: 0.48 }}>
                <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <IconButton size="small" sx={{ width: 40, height: 40, opacity: 0.48 }}>
                <ArrowBackIosIcon sx={{ fontSize: 16 }} />
              </IconButton>
              {[1, 2, 3, 4, 5].map((p) => (
                <Box
                  key={p}
                  onClick={() => setPage(p)}
                  sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    bgcolor: page === p ? DARK : 'transparent',
                    '&:hover': { bgcolor: page === p ? DARK : 'rgba(140,149,157,0.08)' },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: page === p ? 14 : 16,
                      color: page === p ? 'white' : DARK,
                      fontWeight: page === p ? 600 : 400,
                    }}
                  >
                    {p}
                  </Typography>
                </Box>
              ))}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Typography sx={{ fontSize: 14, color: DARK }}>…</Typography>
              </Box>
              <IconButton size="small" sx={{ width: 40, height: 40 }}>
                <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton size="small" sx={{ width: 40, height: 40 }}>
                <KeyboardDoubleArrowRightIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 문서 등록 FAB - 하단 오른쪽 고정 */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setDialogOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          bgcolor: PRIMARY_ORANGE,
          color: 'white',
          borderRadius: 2,
          fontSize: 14,
          fontWeight: 500,
          px: 2.5,
          py: 1.25,
          boxShadow: '0px 8px 16px rgba(250,102,0,0.32)',
          '&:hover': { bgcolor: '#e05a00', boxShadow: '0px 8px 16px rgba(250,102,0,0.48)' },
          zIndex: 1200,
        }}
      >
        문서 등록
      </Button>

      <DocumentRegistrationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Box>
  );
}
