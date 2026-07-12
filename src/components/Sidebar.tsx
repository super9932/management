import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const DARK = '#272b2f';
const SECONDARY = '#737c85';
const DISABLED = '#8c959d';
const DIVIDER = 'rgba(145,158,171,0.2)';
const SIDEBAR_BG = '#ffffff';
const PRIMARY_ORANGE = '#fa6600';

export interface NavChild {
  label: string;
  icon: ReactNode;
  active: boolean;
  disabled: boolean;
  path?: string;
}

export interface NavItem {
  label: string;
  defaultExpanded?: boolean;
  children?: NavChild[];
}

export interface NavSection {
  header: string;
  items: NavItem[];
}

interface Props {
  open: boolean;
  onToggle: () => void;
  sections: NavSection[];
}

export default function Sidebar({ open, onToggle, sections }: Props) {
  const navigate = useNavigate();
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      sections.flatMap((s) => s.items.map((item) => [item.label, item.defaultExpanded ?? false]))
    )
  );

  const toggle = (label: string) =>
    setExpandedMap((prev) => ({ ...prev, [label]: !prev[label] }));

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
        <Box sx={{ width: 40, height: 40, bgcolor: DARK, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 14 }}>H</Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, px: 2, overflow: 'auto' }}>
        {sections.map((section) => (
          <Box key={section.header}>
            <Box sx={{ px: 1.5, pt: 2, pb: 1 }}>
              <Typography sx={{ fontSize: 11, color: DISABLED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {section.header}
              </Typography>
            </Box>
            {section.items.map((item) => {
              const expanded = expandedMap[item.label] ?? false;
              return (
                <Box key={item.label}>
                  <ListItemButton
                    onClick={() => toggle(item.label)}
                    sx={{
                      borderRadius: 1, px: 1.5, py: 0.75, mb: 0.25, minHeight: 44,
                      bgcolor: expanded ? 'rgba(140,149,157,0.08)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(140,149,157,0.08)' },
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: 14, color: expanded ? PRIMARY_ORANGE : SECONDARY, fontWeight: expanded ? 600 : 400, noWrap: true }}
                    />
                    {expanded
                      ? <KeyboardArrowDownIcon sx={{ fontSize: 16, color: SECONDARY }} />
                      : <KeyboardArrowRightIcon sx={{ fontSize: 16, color: SECONDARY }} />
                    }
                  </ListItemButton>
                  {item.children && item.children.length > 0 && (
                    <Collapse in={expanded}>
                      <List disablePadding>
                        {item.children.map((child) => (
                          <ListItemButton
                            key={child.label}
                            disabled={child.disabled}
                            onClick={() => child.path && navigate(child.path)}
                            sx={{
                              borderRadius: 1, px: 1.5, py: 0.5, mb: 0.25, minHeight: 36,
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
                              primaryTypographyProps={{ fontSize: 14, color: child.active ? DARK : SECONDARY, fontWeight: child.active ? 600 : 400 }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </Box>
              );
            })}
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
          position: 'absolute', top: 24, right: -28, width: 28, height: 58,
          bgcolor: SIDEBAR_BG, border: `1px solid ${DIVIDER}`, borderLeft: 'none',
          borderRadius: '0 8px 8px 0', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer',
          boxShadow: '0px 16px 32px -4px rgba(25,28,31,0.08)', zIndex: 1,
        }}
      >
        <ChevronLeftIcon sx={{ fontSize: 20, color: SECONDARY }} />
      </Box>
    </Box>
  );
}
