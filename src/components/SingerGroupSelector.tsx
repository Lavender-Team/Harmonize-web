import React from 'react';
import Avatar from '@mui/joy/Avatar';
import Input from '@mui/joy/Input';
import Button from "@mui/joy/Button";
import IconButton from '@mui/joy/IconButton';
import Typography from "@mui/joy/Typography";
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Box from '@mui/joy/Box';

import SearchIcon from '@mui/icons-material/Search';
import Add from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';

import { Singer } from 'TYPES';
import { func } from 'joi';

export default function SingerGroupSelector({ multiple, members, setMembers }:
  {
    multiple: boolean,
    members: Singer[],
    setMembers: React.Dispatch<React.SetStateAction<Singer[]>>
  }) {

  const [query, setQuery] = React.useState<string>('');
  const [searchResult, setSearchResult] = React.useState<Singer[]>([]);

  React.useEffect(() => {
    fetchSingerList(query);
  }, [query]);

  async function fetchSingerList(artistName: string) {
    const response = await fetch('/api/artist?artistName=' + artistName, { credentials: 'include' });
    
    if (response.ok) {
      const data = await response.json();
      setSearchResult(data.content);
    } else {
      console.error('Failed to fetch singer list');
    }
  }

  function addMember(singer: Singer) {
    if (multiple) {
      for (const member of members) {
        if (member.id === singer.id) {
          return;
        }
      }
      setMembers([...members, singer]);
    } else {
      setMembers([singer]);
    }
  }

  function removeMember(singer: Singer) {
    setMembers(members.filter((member) => member.id !== singer.id));
  }

  return (
    <Box sx={{ mt: '24px', display: 'flex' }}>
      <Box sx={{ width: '440px', backgroundColor: '#f0f4f8', p: '12px', borderRadius: '12px' }}>
        <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="sm"
            placeholder="가수 이름 검색"
            startDecorator={<SearchIcon />}
            sx={{ flexGrow: 1, mb: '12px' }}
        />
        <List sx={{ '--ListItemDecorator-size': '56px', height: '300px', overflowY: 'auto', pr: '4px' }}>
          {searchResult.map((singer) => (
            <ListItem sx={{ borderRadius: '8px', mb: '8px', backgroundColor: '#fbfcfe' }}>
              <ListItemDecorator>
                <Avatar src={singer.profileImage} />
              </ListItemDecorator>
              <ListItemContent>
                <Typography level="title-sm">{singer.artistName}</Typography>
                <Typography level="body-xs" noWrap>{singer.agency}</Typography>
              </ListItemContent>
              <IconButton variant="plain" color="primary" onClick={() => { addMember(singer) }}>{multiple ? <Add /> : <CheckIcon />}</IconButton>
          </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ width: '540px', ml: '20px', backgroundColor: '#f0f4f8', p: '12px', borderRadius: '12px' }}>
        <Typography level="title-sm" sx={{ mt: '6px', mb: '24px', ml: '12px' }}>선택된 그룹 멤버</Typography>
        <List sx={{ '--ListItemDecorator-size': '56px', height: '300px', overflowY: 'auto', pr: '4px' }}>
          {members.map((singer) => (
            <ListItem sx={{ borderRadius: '8px', mb: '8px', backgroundColor: '#fbfcfe' }}>
              <ListItemDecorator>
                <Avatar src={singer.profileImage} />
              </ListItemDecorator>
              <ListItemContent>
                <Typography level="title-sm">{singer.artistName}</Typography>
                <Typography level="body-xs" noWrap>{singer.agency}</Typography>
              </ListItemContent>
              <IconButton variant="plain" color="primary" onClick={() => { removeMember(singer) }}><RemoveIcon /></IconButton>
          </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};
