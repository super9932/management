import { useState } from 'react';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { DARK, PRIMARY_ORANGE } from './tokens';

/**
 * 결과 바의 페이지 크기 선택 ('10건 ▾').
 *
 * 목록 API 들이 공통으로 10/30/50/70/100 만 받는다(그 밖의 값은 서버가 100 으로 자른다).
 * 값이 바뀌면 보이는 구간이 통째로 달라지므로, 쓰는 쪽에서 페이지를 1 로 되돌린다.
 */
export const PAGE_SIZE_OPTIONS = [10, 30, 50, 70, 100] as const;

export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

interface Props {
  value: number;
  onChange: (value: PageSizeOption) => void;
}

export default function PageSizeSelect({ value, onChange }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleSelect = (option: PageSizeOption) => {
    setAnchorEl(null);
    if (option !== value) {
      onChange(option);
    }
  };

  return (
    <>
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ pl: 2, display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
      >
        <Typography sx={{ fontSize: 14, color: DARK }}>{value}건</Typography>
        <KeyboardArrowDownIcon sx={{ fontSize: 16, color: DARK }} />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {PAGE_SIZE_OPTIONS.map((option) => (
          <MenuItem
            key={option}
            selected={option === value}
            onClick={() => handleSelect(option)}
            sx={{
              fontSize: 14,
              color: option === value ? PRIMARY_ORANGE : DARK,
              minWidth: 96,
            }}
          >
            {option}건
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
