import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ThemeTable from '../../components/ThemeTable';

const rows_def = [
  {
    id: 1,
    theme: '로드 중',
  }
];

export default function ThemeManage() {

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [rows, setRows] = React.useState(rows_def);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalElements, setTotalElements] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(10);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    setRows(rows_def);
    fetchThemeList(currentPage, 12);
  }, [currentPage]);

  async function fetchThemeList(page: number, size: number) {
    const response = await fetch(`/api/music/theme?page=${page-1}&size=${size}&themeName=${query}`, { credentials: 'include' });
  
    if (response.ok) {
      const res = await response.json();

      const themeObjs = [];
      for (const [index, themeLabel] of res.content.entries()) {
        themeObjs.push({id: index+1, theme: themeLabel});
      }
      setRows(themeObjs);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } else {
      console.error('Failed to fetch theme list');
    }
  }

  function navigatePage(page : number) {
    setCurrentPage(page);
    navigate({
      pathname: location.pathname,
      search: "?page=" + page + "&query=" + query,
    });
  }

  function search() {
    navigatePage(1);
    fetchThemeList(1, 12);
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '240px', padding: 2 }}>
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
              <Typography color="primary" fontWeight={500} fontSize={12}>
                테마 관리
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography level="h2" component="h1">
              테마 관리
            </Typography>

            <ThemeTable
              rows={rows}
              currentPage={currentPage}
              navigatePage={navigatePage}
              totalElements={totalElements}
              totalPages={totalPages}
              query={query}
              setQuery={setQuery}
              search={search}
            />
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
