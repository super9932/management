import { Box, Switch, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { DARK, DISABLED, PRIMARY_ORANGE, SECONDARY } from '../../_lib/tokens';

/** 시스템 설정 항목 한 줄 — 라벨 + 스위치 + 안내문 (DAS_시스템설정_001 1-A) */

interface Props {
  label: string;
  helper: string;
  checked: boolean;
  /** 조회 중이거나 실패했을 때 조작을 막는다 */
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

export default function SystemSettingToggleRow({
  label,
  helper,
  checked,
  disabled = false,
  onChange,
}: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Box sx={{ height: 38, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: 14, lineHeight: '22px', color: DARK, width: 141 }}>
          {label}
        </Typography>
        <Switch
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: PRIMARY_ORANGE,
              opacity: 1,
            },
          }}
        />
      </Box>
      <Box sx={{ pt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <InfoIcon sx={{ fontSize: 16, color: DISABLED }} />
        <Typography sx={{ fontSize: 12, lineHeight: '18px', color: SECONDARY }}>{helper}</Typography>
      </Box>
    </Box>
  );
}
