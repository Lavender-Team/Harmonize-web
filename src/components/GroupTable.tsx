/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

import { Group } from 'TYPES';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function RowMenu({ groupId, deleteGroup }: { groupId: number, deleteGroup: (groupId: number) => void }) {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem component={RouterLink} to={"/group-manage/edit/"+groupId}>그룹 정보 편집</MenuItem>
        <Divider />
        <MenuItem color="danger" onClick={() => { deleteGroup(groupId) }}>그룹 삭제</MenuItem>
      </Menu>
    </Dropdown>
  );
}

function getPageStringList(currentPage: number, totalPages: number) {
  const pageList = [currentPage];
  let left = currentPage - 1;
  let right = currentPage + 1;

  while (pageList.length < 5 && (left > 0 || right <= totalPages)) {
    if (left > 0) {
      pageList.unshift(left);
      left -= 1;
    }
    if (pageList.length < 5 && right <= totalPages) {
      pageList.push(right);
      right += 1;
    }
  }

  return pageList;
}

export default function GroupTable({ rows, currentPage, totalElements, totalPages, navigatePage, deleteGroup, query, setQuery, search }: {
  rows: Group[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
  navigatePage: (page: number) => void;
  deleteGroup: (singerId: number) => void;
  query: string;
  setQuery: (query: string) => void;
  search: () => void;
}) {
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const renderFilters = () => (
    <React.Fragment>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: 'flex', sm: 'none' },
          my: 1,
          gap: 1,
        }}
      >
        <Input
          size="sm"
          placeholder="Search"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: '-4px',
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          justifyContent: 'flex-end',
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >
        <FormControl sx={{ width: 380 }} size="sm">
          <Input value={query} onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key == 'Enter') { search() } }}
            size="sm" placeholder="그룹 검색" startDecorator={<SearchIcon />} />
        </FormControl>
        {renderFilters()}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== rows.length
                  }
                  checked={selected.length === rows.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? rows.map((row) => row.id.toString()) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === rows.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 60, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    },
                  }}
                >
                  ID
                </Link>
              </th>
              <th style={{ width: 200, padding: '12px 6px' }}>이름</th>
              <th style={{ width: 80, padding: '12px 6px' }}>솔로/그룹</th>
              <th style={{ width: 80, padding: '12px 6px' }}>인원</th>
              <th style={{ width: 140, padding: '12px 6px' }}>소속사</th>
              <th style={{ width: 280, padding: '12px 6px' }}>멤버</th>
              <th style={{ width: 100, padding: '12px 6px' }}>편집</th>
            </tr>
          </thead>
          <tbody>
            {[...rows].sort(getComparator(order, 'id')).map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: 'center', width: 120 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(row.id.toString())}
                    color={selected.includes(row.id.toString()) ? 'primary' : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.id.toString())
                          : ids.filter((itemId) => itemId !== row.id.toString()),
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                    sx={{ verticalAlign: 'text-bottom' }}
                  />
                </td>
                <td>
                  <Typography level="body-xs">{row.id}</Typography>
                </td>
                <td>
                  <Link component={RouterLink} to={"/group-manage/edit/"+row.id}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar size="sm" src={row.profileImage}></Avatar>
                      <div>
                        <Typography level="title-sm">{row.groupName}</Typography>
                      </div>
                    </Box>
                  </Link>
                </td>
                <td>
                  <Typography level="body-sm">{row.groupTypeName}</Typography>
                </td>
                <td>
                  <Typography level="body-sm">{row.groupSize}</Typography>
                </td>
                <td>
                  <Typography level="body-sm">{row.agency}</Typography>
                </td>
                <td>
                  <Typography level="body-sm">{row.members.map(m => m.artistName).join(', ')}</Typography>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <RowMenu groupId={row.id} deleteGroup={deleteGroup} />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
          display: {
            xs: 'none',
            md: 'flex',
          },
        }}
      >
        <Box sx={{ flex: 1, position: 'relative' }}>
          <Typography level="body-sm" sx={{ position: 'absolute' }}>
            전체 {totalElements}개, {currentPage}/{totalPages} 페이지
          </Typography>
        </Box>

        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
          onClick={() => { if (1 <= currentPage - 1) navigatePage(currentPage - 1); }}
        >
          이전
        </Button>
        <Box sx={{ width: 4 }} />
        {getPageStringList(currentPage, totalPages).map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={page === currentPage ? 'solid' : 'outlined'}
            color="neutral"
            onClick={() => { navigatePage(page); }}
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ width: 4 }} />
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
          onClick={() => { if (currentPage + 1 <= totalPages) navigatePage(currentPage + 1); }}
        >
          다음
        </Button>
        <Box sx={{ flex: 1 }} />
      </Box>
    </React.Fragment>
  );
}
