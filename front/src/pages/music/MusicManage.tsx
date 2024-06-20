import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import MusicTable from '../../components/MusicTable';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Music } from 'TYPES';

const rows_def: Music[] = [
  {
    id: 1,
    title: '로드 중',
    artist: '-',
    status: '-',
    genre: '-',
    view: 0,
    likes: 0,
    themes: []
  }
];

export default function MusicManage() {

  const [rows, setRows] = React.useState<Music[]>(rows_def);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalElements, setTotalElements] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(10);

  React.useEffect(() => {
    setRows(rows_def);
    fetchMusicList(currentPage, 12);
  }, [currentPage]);

  async function fetchMusicList(page: number, size: number) {
    const response = await fetch(`/api/music?page=${page-1}&size=${size}`);
  
    if (response.ok) {
      const data = await response.json();
      setRows(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } else {
      console.error('Failed to fetch music list');
    }
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '240px' }}>
        <Box
          component="main"
          sx={{
            padding: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="small" />}
              sx={{ pl: 0 }}
            >
              <Link
                underline="none"
                color="neutral"
                href="/admin-home"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              <Typography color="neutral" fontWeight={500} fontSize={12}>
                음악 관리
              </Typography>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                음악 관리
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography level="h2" component="h1">
              음악 관리
            </Typography>

            <MusicTable
              rows={rows}
              currentPage={currentPage}
              totalElements={totalElements}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
