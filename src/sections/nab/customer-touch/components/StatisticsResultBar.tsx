import { Box, Button, Divider, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { DARK, DIVIDER, PRIMARY_ORANGE, SECONDARY } from '../../_lib/tokens';

/** 통계 표 위의 결과 바 — 총 건수·페이지 크기·엑셀 다운로드. 탭별 표가 함께 쓴다. */

interface Props {
  total: number;
  pageSize: string;
  onExcelDownload: () => void;
}

export default function StatisticsResultBar({ total, pageSize, onExcelDownload }: Props) {
  return (
    <>
      <Box sx={{ px: 2.5, pb: 1.5, pt: 0.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 14, color: SECONDARY }}>
            총 <strong style={{ color: PRIMARY_ORANGE }}>{total.toLocaleString()}</strong> 건
          </Typography>
          <Box sx={{ pl: 2, display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
            <Typography sx={{ fontSize: 14, color: DARK }}>{pageSize}건</Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 16, color: DARK }} />
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={onExcelDownload}
          sx={{
            height: 36, px: 1.5, borderRadius: 2, fontSize: 14, fontWeight: 400,
            color: DARK, borderColor: 'var(--nab-border-strong)',
            '&:hover': { borderColor: SECONDARY, bgcolor: 'transparent' },
          }}
        >
          엑셀 다운로드
        </Button>
      </Box>
      <Divider sx={{ borderColor: DIVIDER }} />
    </>
  );
}
