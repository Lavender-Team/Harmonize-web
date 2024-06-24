import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LabelIcon from '@mui/icons-material/Label';
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
import { Link, useNavigate } from 'react-router-dom';

import ColorSchemeToggle from './ColorSchemeToggle';
import { closeSidebar } from '../utils';
import Logo from './logo.png';

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: '0.2s ease',
          '& > *': {
            overflow: 'hidden',
          },
        }}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: 'fixed',
        left: 0,
        width: '240px',
        height: '100vh',
        overflowY: 'auto',
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '240px',
          },
        })}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <IconButton variant="soft" color="primary" size="sm">
          <img src={Logo} alt="Logo" style={{ width: '24px', height: '24px' }} />
        </IconButton>
        <Typography level="title-lg">하모나이즈</Typography>
        <ColorSchemeToggle sx={{ ml: 'auto' }} />
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton component={Link} to="/admin-home">
              <HomeRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">관리자 홈</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <LibraryMusicIcon />
                  <ListItemContent>
                    <Typography level="title-sm">음악 관리</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem sx={{ mt: 0.5 }}>
                  <ListItemButton component={Link} to="/add-music">
                    음악 등록
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton component={Link} to="/analyze-music">
                    음악 분석
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton component={Link} to="/music-manage">
                    음악 관리
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton component={Link} to="/add-music-bulk">
                    음악 일괄 업로드
                  </ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <RecordVoiceOverIcon />
                  <ListItemContent>
                    <Typography level="title-sm">가수 관리</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem sx={{ mt: 0.5 }}>
                  <ListItemButton component={Link} to="/add-singer">
                    가수 추가
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton component={Link} to="/singer-manage">
                    가수 관리
                  </ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>

          <ListItem>
            <ListItemButton component={Link} to="/theme-manage">
              <LabelIcon />
              <ListItemContent>
                <Typography level="title-sm">테마 관리</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton component={Link} to="/user-manage">
              <AccountCircleIcon />
              <ListItemContent>
                <Typography level="title-sm">회원 관리</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar variant="outlined" size="sm" />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">관리자</Typography>
          <Typography level="body-xs">admin</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral" onClick={onLogout}>
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}
