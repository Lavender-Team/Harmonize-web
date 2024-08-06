import * as React from 'react';
import Input from '@mui/joy/Input';
import Avatar from '@mui/joy/Avatar';
import Typography from "@mui/joy/Typography";
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';

import { Group } from 'TYPES';

export default function GroupSelector({ setGroup, query, setQuery }:
  {
    setGroup: React.Dispatch<React.SetStateAction<Group>>;
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
  }) {

  const [isListOpen, setIsListOpen] = React.useState<boolean>(false);
  const [groupList, setGroupList] = React.useState<Group[]>([]);

  React.useEffect(() => {
    fetchGroupList();
  }, []);

  React.useEffect(() => {
    fetchGroupList();
  }, [query]);

  async function fetchGroupList() {
    const response = await fetch(`/api/group?page=0&size=10&groupName=${query}`);

    if (response.ok) {
      const res = await response.json();
      setGroupList(res.content);
    } else {
      console.error('Failed to fetch group list');
    }
  }

  return (
    <>
      <Input type="text" placeholder="가수 선택" sx={{ width: 400, mt: "12px" }}
            value={query} onChange={(e) => { setQuery(e.target.value); }} onClick={() => { setIsListOpen(true); }}/>
      
      <div style={{ position: 'relative' }}>
        {isListOpen && <List sx={{ '--ListItemDecorator-size': '56px', height: '300px', overflowY: 'auto', pr: '4px',
                    border: '#cdd7e1 0.8px solid', shadow: 'rgb(0, 0, 0) 0px', borderRadius: '8px', zIndex: '100',
                    position: 'absolute', top: '4px', width: 400, backgroundColor: '#fcfcfc' }}>
          {groupList.map((group) => (
            <ListItem sx={{ pt: '8px', pb: '8px', cursor: 'pointer',
                            '&:hover': { backgroundColor: '#f0f4f8' } }}
                            onClick={() => { setGroup(group); setQuery(group.groupName); setIsListOpen(false); }}>
              <ListItemDecorator>
                <Avatar src={group.profileImage} />
              </ListItemDecorator>
              <ListItemContent>
                <Typography level="title-sm">{group.groupName}</Typography>
                <Typography level="body-xs" noWrap>{group.members.map(m => m.artistName).join(', ')}</Typography>
              </ListItemContent>
          </ListItem>
          ))}
        </List>}
      </div>
    </>
  );
}