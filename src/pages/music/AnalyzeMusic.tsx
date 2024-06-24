import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import { ColorPaletteProp } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Autocomplete from '@mui/joy/Autocomplete';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import OpenInNew from '@mui/icons-material/OpenInNew';

import { Music } from 'TYPES';
import './music.css';

export default function AnalyzeMusic() {

  const [searchParams] = useSearchParams();
  const musicId = searchParams.get('id');

  const [music, setMusic] = React.useState({
    id: -1,
    title: '로드 중',
    artist: '',
    status: '',
    albumCover: '',
    playLink: '',
    audioFilename: '',
    audioFile: null,
    lyricFilename: '구현 안됨',
    lyricFile: null,
    lyrics: ''
  });

  const [selectedMusic, setSelectedMusic] = React.useState<Music | null>(null); // 선택된 음악
  const [recentMusics, setRecentMusics] = React.useState<Music[]>([]); // 최근 100개 음악 목록

  // input file trigger를 위한 ref
  const audioRef = React.useRef<HTMLInputElement>(null);
  const lyricRef = React.useRef<HTMLInputElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 처음 로딩 시 음악 선택 후보로 최근 음악 목록을 가져옴
  React.useEffect(() => {
    fetchRecentMusicList();
    if (musicId) {
      fetchMusic(parseInt(musicId));
    }
  }, []);

  // 최근 음악 목록이 업데이트되면 첫 번째 음악을 선택함 (음악 선택 없이 음악 분석 페이지 접속시)
  React.useEffect(() => {
    if (!musicId && selectedMusic == null)
      setSelectedMusic(recentMusics[0]);
  }, [recentMusics]);

  // 음악 상세정보 로드
  React.useEffect(() => {
    if (selectedMusic != null)
      fetchMusic(selectedMusic.id)
  }, [selectedMusic]);

  async function fetchRecentMusicList() {
    const response = await fetch(`/api/music?page=${0}&size=${100}`);
  
    if (response.ok) {
      const data = await response.json();
      setRecentMusics(data.content);
    } else {
      console.error('Failed to fetch recent music list');
    }
  }

  async function fetchMusic(musicId: number) {
    const response = await fetch(`/api/music/${musicId}`);

    if (response.ok) {
      const res = await response.json();
      setMusic({
        ...music,
        id: res.id,
        title: res.title,
        artist: res.artist,
        status: res.status,
        albumCover: res.albumCover,
        playLink: res.playLink ? res.playLink : '',
        audioFile: null,
        audioFilename: res.audioFile ? res.audioFile : '',
        lyricFile: null,
        lyrics: res.lyrics ? res.lyrics : '',
      });
    }
  }

  // 유튜브 링크 저장
  const savePlayLink = async () => {
    let data = new FormData();
    data.append('playLink', music.playLink);

    const res = await fetch(`/api/music/${music.id}`, { method: 'PUT', credentials: 'include', body: data })

    if (res.ok)
      alert('유튜브 링크가 저장되었습니다.');
    else {
      alert('음악 편집 중 오류가 발생하였습니다.');
    }
  };

  const saveAudioFile = async () => {
    if (!music.audioFile)
      return alert('음악 파일을 선택해주세요.');

    let data = new FormData();
    data.append('audioFile', music.audioFile);

    const res = await fetch(`/api/music/${music.id}/files`, { method: 'POST', credentials: 'include', body: data })

    if (res.ok) {
      fetchMusic(music.id);
      alert('음악 파일이 저장되었습니다.');
    }
    else {
      alert('음악 편집 중 오류가 발생하였습니다.');
    }
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setMusic({
      ...music,
      [name]: value
    });
  };

  const handleAudioFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setMusic({
        ...music,
        audioFilename: e.target.value.substring(e.target.value.lastIndexOf('/') + 1)
        .substring(e.target.value.lastIndexOf('\\') + 1),
        audioFile: file
      });
    }
  };

  const handleLyricFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setMusic({
        ...music,
        lyricFilename: e.target.value.substring(e.target.value.lastIndexOf('/') + 1)
        .substring(e.target.value.lastIndexOf('\\') + 1),
        lyricFile: file
      });
    }
  };


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
                음악 분석
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography level="h2" component="h1">
              음악 분석
            </Typography>
          </Box>

          <div className="music">
            <Box sx={{ mt: '16px', mb: '36px' }}>
              <Autocomplete
                placeholder="음악 선택 (최근 100개만 표시됨)"
                options={recentMusics}
                value={selectedMusic}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option) => option.title + ' - ' + option.artist}
                onChange={(e, value) => { setSelectedMusic(value) }}
                sx={{ width: 400 }}
              />
              <Box className='horizontal' sx={{ mt: '24px' }}>
                <div>
                  {music.albumCover && (
                    <img src={music.albumCover} alt="앨범 표지" className='preview-sm' />
                  )}
                </div>
                <Box sx={{ ml: '24px' }}>
                  <Typography level='title-md' sx={{ mt: 1 }}><b>{music.title}</b></Typography>
                  <Typography level='body-sm' sx={{ mt: 1 }}><b>{music.artist}</b></Typography>
                  <Chip
                    variant="soft"
                    size="sm"
                    sx={{ mt: '12px' }}
                    startDecorator={
                      {
                        COMPLETE: <CheckRoundedIcon />,
                        RUNNING: <AutorenewRoundedIcon />,
                        INCOMPLETE: <BlockIcon />,
                      }[music.status]
                    }
                    color={
                      {
                        COMPLETE: 'success',
                        RUNNING: 'neutral',
                        INCOMPLETE: 'danger',
                      }[music.status] as ColorPaletteProp
                    }
                  >
                    {music.status}
                  </Chip>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: '36px' }}>
              <p className='sectionTitle'>정보 입력 및 파일 업로드</p>
              <div className='item'>
                <span>음악 파일</span>
                <input className='hidden' type="file" accept="audio/*" ref={audioRef} onChange={handleAudioFileChange}/>
                <Input
                  value={music.audioFilename}
                  startDecorator={
                    <Button variant="soft" color="neutral" startDecorator={<AttachFileIcon />} onClick={() => { if (audioRef.current) audioRef.current.click() }}>
                      파일
                    </Button>
                  }
                  sx={{ width: 300 }}
                />
                {
                  (music.audioFile === null && music.audioFilename !== '') &&
                  <a href={music.audioFilename} target='_blank'>
                    <Button variant="outlined" color="primary" sx={{ width: '90px', ml: 1 }}>
                      다운로드
                    </Button>
                  </a>
                }
                {
                  (music.audioFile !== null || music.audioFilename === '') &&
                  <Button variant="outlined" color="primary" sx={{ width: '90px', ml: 1 }} onClick={saveAudioFile}>
                    업로드
                  </Button>
                }
                
                <span style={{ marginLeft: '48px' }}>유튜브 링크</span>
                <Input
                  type="text" placeholder="링크 입력" name="playLink"
                  value={music.playLink}
                  onChange={handleInputChange}
                  endDecorator={<IconButton component="a" href={music.playLink} target="_blank"><OpenInNew /></IconButton>}
                  sx={{ width: 240 }}
                />
                <Button variant="outlined" color="primary" onClick={savePlayLink} sx={{ ml: 1 }}>
                  저장
                </Button>
              </div>
              <div className='item'>
                <span>가사 파일</span>
                <input className='hidden' type="file" ref={lyricRef} onChange={handleLyricFileChange}/>
                <Input
                  value={music.lyricFilename}
                  startDecorator={
                    <Button variant="soft" color="neutral" startDecorator={<AttachFileIcon />} onClick={() => { if (lyricRef.current) lyricRef.current.click() }}>
                      파일
                    </Button>
                  }
                  sx={{ width: 300 }}
                />
                <Button variant="outlined" color="primary" sx={{ width: '90px', ml: 1 }}>
                  업로드
                </Button>
                <Button variant="outlined" color="primary" sx={{ width: '100px', ml: 1 }}>
                  가사 표시
                </Button>
              </div>
            </Box>

            <Box sx={{ mt: '36px' }}>
              <p className='sectionTitle'>분석</p>
                <div className='action'>
                  <Typography level='body-xs' sx={{ display: 'inline', mr: 1 }}>음계 예측 신뢰도</Typography>
                  <Input type="number" defaultValue={0.9} slotProps={{ input: { ref: inputRef, min: 0.1, max: 1.0, step: 0.01, }, }}
                    sx={{ display: 'inline-block', verticalAlign: 'bottom', mr: 3 }}/>
                  <Button variant="solid" color="primary">
                    분석 요청
                  </Button>
                </div>
                <Box sx={{ background: 'lightgray', width: '1000px', height: '160px', mt: '24px', mb: '24px' }}></Box>
                <div>
                  <div className='item analysis'>
                    <div><span>최고음</span><Typography level="title-sm">A4</Typography></div>
                    <div><span>고음 비율</span><Typography level="title-sm">22%</Typography></div>
                    <div><span>고음 지속</span><Typography level="title-sm">10초</Typography></div>
                  </div>
                  <div className='item analysis'>
                    <div><span>최저음</span><Typography level="title-sm">D2</Typography></div>
                    <div><span>저음 비율</span><Typography level="title-sm">0%</Typography></div>
                    <div><span>저음 지속</span><Typography level="title-sm">0초</Typography></div>
                  </div>
                  <div className='item analysis'>
                    <div><span>난이도</span><Typography level="title-sm">3</Typography></div>
                    <div><span>급격한 음 변화</span><Typography level="title-sm">3회</Typography></div>
                  </div>
                </div>
            </Box>
          </div>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
