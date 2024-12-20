import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Autocomplete from '@mui/joy/Autocomplete';

import { alertMessage } from '../../libs/ErrorMessage';
import GroupSelector from '../../components/GroupSelector';
import './music.css';

const GENRELIST = { '가요': 'KPOP', '팝송': 'POP', '발라드': 'BALLADE', '랩/힙합': 'RAP', '댄스':
                    'DANCE', '일본곡': 'JPOP', 'R&B': 'RNB', '포크/블루스': 'FOLK', '록/메탈': 'ROCK',
                    'OST': 'OST', '인디뮤직': 'INDIE', '트로트': 'TROT', '어린이곡': 'KID' }

export default function AddMusic() {
  const navigate = useNavigate();

  const [music, setMusic] = useState({
    title: '',
    genre: '',
    releaseDate: '',
    karaokeNum: '',
    themes: [],
    albumCover: null,
    albumCoverFile: null
  });

  const [group, setGroup] = useState();
  const [query, setQuery] = useState('');
  const [themeList, setThemeList] = useState([]);

  useEffect(() => {
    fetchThemeList();
  }, []);

  async function fetchThemeList() {
    const response = await fetch(`/api/music/theme?page=0&size=1000`, { credentials: 'include' });
  
    if (response.ok) {
      const res = await response.json();
      const themeObjs = [];
      for (const [index, themeLabel] of res.content.entries()) {
        themeObjs.push({id: index, label: themeLabel});
      }

      setThemeList(themeObjs);
    } else {
      console.error('Failed to fetch theme list');
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMusic({
      ...music,
      [name]: value
    });
  };

  const handleGenreChange = (value) => {
    setMusic({
      ...music,
      genre: value
    });
  };

  const handleAlbumCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMusic({
          ...music,
          title: (music.title) ? music.title : file.name.split('.')[0], // 이름 없으면 파일명으로 이름 자동 입력
          albumCover: reader.result,
          albumCoverFile: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const isMusicValid = (music) => {
    if (!music.title || !music.genre || !music.releaseDate || !music.karaokeNum || !music.albumCover) {
      return false;
    }
    return true;
  }

  // 음악 등록 요청
  const handleMusicSubmit = async () => {
    if (!isMusicValid(music)) {
      alert('음악 정보를 모두 입력해주세요.');
      return;
    }
    
    let data = new FormData();
    data.append('title', music.title);
    data.append('genre', music.genre);
    data.append('releaseDate', music.releaseDate + 'T00:00:00');
    data.append('karaokeNum', music.karaokeNum);
    data.append('albumCover', music.albumCoverFile);
    data.append('themes', music.themes.map(theme => theme.label).join(','));
    if (group) {
      data.append('groupId', group.id);
    }

    const res = await fetch(`/api/music`, {
        method: 'POST',
        credentials: 'include',
        body: data
    })

    if (res.ok) {
      navigate('/music-manage')
    }
    else {
      const errors = await res.json();
      alert(alertMessage(errors));
    }
  };

  const clearMusic = () => {
    setMusic({
      ...music,
      title: '',
      releaseDate: '',
      karaokeNum: '',
      themes: [],
      albumCover: null,
      albumCoverFile: null
    });
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
              <Typography color="neutral" fontWeight={500} fontSize={12}>
                음악 관리
              </Typography>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                음악 등록
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography level="h2" component="h1">
              음악 등록
            </Typography>

            <div className="music">
              <div className='horizontal'>
                <div>
                  <div className={(music.albumCover) ? "none" : ""}>
                  <input type="file" id="albumCover" accept="image/*" onChange={handleAlbumCoverChange} className="inputfile" />
                  <label htmlFor="albumCover" className="plus-button">+<span className='name'>앨범 표지</span></label>
                  </div>
                  {music.albumCover && (
                    <label htmlFor="albumCover"><img src={music.albumCover} alt="앨범 표지" className='preview' /></label>
                  )}
                </div>
                <div style={{ margin: "0 0 0 12px" }}>
                  <Input type="text" placeholder="음악 제목 입력" name="title" value={music.title} onChange={handleInputChange} sx={{ width: 400 }}/>
                  <GroupSelector setGroup={setGroup} query={query} setQuery={setQuery} />
                </div>
              </div>
              <div className='section'>
                <p className='sectionTitle'>노래 정보</p>
                <div className='item'>
                  <span>장르</span>
                  <Select placeholder="장르 선택" sx={{ width: 180 }}>
                  {
                    Object.keys(GENRELIST).map((genre, index) => (
                      <Option key={index} value={genre} onClick={() => { handleGenreChange(GENRELIST[genre]) }}>{genre}</Option>
                    ))
                  }
                  </Select>
                </div>
                <div className='item'>
                  <span>발매일</span>
                  <Input type="date" placeholder="날짜 선택" name="releaseDate" value={music.releaseDate} onChange={handleInputChange} sx={{ width: 180 }}/>
                </div>
                <div className='item'>
                  <span>노래방 번호</span>
                  <Input type="text" placeholder="노래방 번호 입력" name="karaokeNum" value={music.karaokeNum} onChange={handleInputChange} sx={{ width: 180 }}/>
                </div>
                <div className='item'>
                  <span>음악 특징</span>
                  <Autocomplete
                    value={music.themes}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value !== '') {
                        e.preventDefault();
                        setMusic({ ...music, themes: music.themes.concat({ id: -1, label: e.target.value })});
                      }
                    }}
                    onChange={(e, value) => { setMusic({ ...music, themes: value })}}
                    multiple
                    options={themeList}
                    getOptionKey={(option) => option.id}
                    getOptionLabel={(option) => option.label}
                    sx={{ width: 500 }}
                  />
                </div>
              </div>
              <div className='action'>
                <Button variant="outlined" onClick={clearMusic} sx={{ width: 80, height: 40, mr: '12px' }}>초기화</Button>
                <Button variant="solid" onClick={handleMusicSubmit} sx={{ width: 120, height: 40 }}>음악 등록</Button>
              </div>
            </div>

          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
