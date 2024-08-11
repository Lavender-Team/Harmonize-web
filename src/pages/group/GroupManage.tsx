import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import GroupTable from '../../components/GroupTable';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Group } from 'TYPES';

const rows_def: Group[] = [
  {
    id: 1,
    groupName: '로드 중',
    groupType: '-',
    groupTypeName: '-',
    groupSize: 0,
    agency: '-',
    profileImage: '-',
    members: []
  }
];


export default function GroupManage() {

  const [rows, setRows] = React.useState<Group[]>(rows_def);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalElements, setTotalElements] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(10);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    fetchGroupList(currentPage, 12);
  }, [currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
    fetchGroupList(1, 12);
  }, [query]);

  async function fetchGroupList(page: number, size: number) {
    const response = await fetch(`/api/group?page=${page-1}&size=${size}&groupName=${query}`);
  
    if (response.ok) {
      const data = await response.json();
      setRows(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } else {
      console.error('Failed to fetch group list');
    }
  }

  function deleteGroup(groupId: number) {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      fetch(`/api/group/${groupId}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          fetchGroupList(currentPage, 12);
        } else {
          console.error('Failed to delete group');
        }
      });
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
                그룹 관리
              </Typography>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                그룹 관리
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography level="h2" component="h1">
              그룹 관리
            </Typography>
            <GroupTable
              rows={rows}
              currentPage={currentPage}
              totalElements={totalElements}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              deleteGroup={deleteGroup}
              query={query}
              setQuery={setQuery}
            />
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
