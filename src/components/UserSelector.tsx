import React from 'react';
import Avatar from '@mui/joy/Avatar';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Typography from "@mui/joy/Typography";
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Box from '@mui/joy/Box';

import SearchIcon from '@mui/icons-material/Search';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { Music, User } from 'TYPES';

export default function UserSelector({ user, setUser } : {
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>
}) {

  const [query, setQuery] = React.useState<string>('');
  const [searchResult, setSearchResult] = React.useState<User[]>([]);
  const [recomResult, setRecomResult] = React.useState<Music[]>([]);

  React.useEffect(() => {
    fetchUserList(query);
  }, [query]);

  React.useEffect(() => {
    if (user) {
      fetchMusicList(user.userId);
    }
  }, [user]);

  async function fetchUserList(loginId: string) {
    const response = await fetch('/api/user?size=20&query=' + loginId, { credentials: 'include' });
    
    if (response.ok) {
      const data = await response.json();
      setSearchResult(data.content);
    } else {
      console.error('Failed to fetch user list');
    }
  }

  async function fetchMusicList(userId: number) {
    const response = await fetch('/api/music/recommend?size=30&userId=' + userId, { credentials: 'include' });
    
    if (response.ok) {
      const data = await response.json();
      setRecomResult(data.content.sort((a: Music, b: Music) => a.rank - b.rank));
    } else {
      console.error('Failed to fetch recommend list');
    }
  }

  return (
    <Box sx={{ mt: '24px', display: 'flex' }}>
      <Box sx={{ width: '440px', backgroundColor: '#f0f4f8', p: '12px', borderRadius: '12px' }}>
        <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="sm"
            placeholder="아이디 검색"
            startDecorator={<SearchIcon />}
            sx={{ flexGrow: 1, mb: '12px' }}
        />
        <List sx={{ '--ListItemDecorator-size': '56px', height: '360px', overflowY: 'auto', pr: '4px' }}>
          {searchResult.map((u) => (
            <ListItem sx={{ borderRadius: '8px', mb: '8px', backgroundColor: '#fbfcfe' }}>
              <ListItemContent>
                <Typography level="title-sm">{u.loginId}</Typography>
                <Typography level="body-xs" noWrap>{u.nickname}</Typography>
              </ListItemContent>
              <IconButton variant="plain" color="primary" onClick={() => { setUser(u) }}> <NavigateNextIcon /></IconButton>
          </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ width: '540px', ml: '20px', backgroundColor: '#f0f4f8', p: '12px', borderRadius: '12px' }}>
        <Typography level="title-sm" sx={{ mt: '6px', mb: '24px', ml: '12px' }}>선택한 유저({user?.loginId})에게 추천되는 음악 목록</Typography>
        <List sx={{ '--ListItemDecorator-size': '56px', height: '360px', overflowY: 'auto', pr: '4px' }}>
          {recomResult.map((music) => (
            <ListItem sx={{ borderRadius: '8px', mb: '8px', backgroundColor: '#fbfcfe' }}>
              <ListItemDecorator>
                <Avatar src={music.albumCover} />
              </ListItemDecorator>
              <ListItemContent>
                <Typography level="title-sm">{music.title} - {music.artist}</Typography>
                <Typography level="body-xs" noWrap>rank={music.rank}, score={music.score}</Typography>
              </ListItemContent>
          </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};
