import { Box, Switch, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { DARK, DISABLED, PRIMARY_ORANGE, SECONDARY } from '../../_lib/tokens';

interface Props {
  label: string;
  helper: string;
  checked: boolean;
  /** Kill-Switch 조회 중/실패 시 조작을 막는다 */
  disabled?: boolean;
  onChange: (v: boolean) => void;
}

export default function ServiceToggleRow({ label, helper, checked, disabled, onChange }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Box sx={{ height: 38, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: 14, color: DARK, width: 100 }}>{label}</Typography>
        <Switch
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
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
        <Typography sx={{ fontSize: 12, color: SECONDARY, lineHeight: 1.66, letterSpacing: '0.4px' }}>
          {helper}
        </Typography>
      </Box>
    </Box>
  );
}
