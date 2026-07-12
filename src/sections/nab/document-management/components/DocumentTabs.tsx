import { Box, Tabs, Tab, Divider } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { DARK, SECONDARY, DIVIDER } from '../../../../theme';

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export default function DocumentTabs({ value, onChange }: Props) {
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
            '& .MuiTabs-flexContainer': { gap: 5 },
          }}
        >
          <Tab label="Tab" icon={<DescriptionOutlinedIcon />} iconPosition="start" />
          <Tab label="Tab" icon={<DescriptionOutlinedIcon />} iconPosition="start" />
          <Tab label="Tab" icon={<DescriptionOutlinedIcon />} iconPosition="start" />
          <Tab label="Tab" icon={<DescriptionOutlinedIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      <Divider sx={{ borderColor: DIVIDER }} />
    </>
  );
}
