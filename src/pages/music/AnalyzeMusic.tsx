import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import { ColorPaletteProp } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
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

import './music.css';

export default function AnalyzeMusic() {

  const [music, setMusic] = React.useState({
    title: '음악 제목',
    artist: '구현 안됨',
    genre: '',
    releaseDate: '',
    karaokeNum: '',
    themes: [],
    status: 'INCOMPLETE',
    albumCover: '/api/music/albumcover/17.jpg', // 테스트
    playLink: '',
    musicFilename: '',
    musicFile: null,
    lyricFilename: '',
    lyricFile: null
  });

  // input file trigger를 위한 ref
  const musicRef = React.useRef<HTMLInputElement>(null);
  const lyricRef = React.useRef<HTMLInputElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setMusic({
      ...music,
      [name]: value
    });
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
                placeholder="음악 선택"
                options={[]}
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
                <input className='hidden' type="file" ref={musicRef} onChange={(e) => {
                  setMusic({
                    ...music,
                    musicFilename: e.target.value.substring(e.target.value.lastIndexOf('/') + 1)
                      .substring(e.target.value.lastIndexOf('\\') + 1)
                  })
                }}/>
                <Input
                  value={music.musicFilename}
                  startDecorator={
                    <Button variant="soft" color="neutral" startDecorator={<AttachFileIcon />} onClick={() => { if (musicRef.current) musicRef.current.click() }}>
                      파일
                    </Button>
                  }
                  sx={{ width: 300 }}
                />
                <Button variant="outlined" color="primary" sx={{ width: '90px', ml: 1 }}>
                  업로드
                </Button>
                <span style={{ marginLeft: '48px' }}>유튜브 링크</span>
                <Input type="text" placeholder="링크 입력" name="playLink" value={music.playLink} onChange={handleInputChange} sx={{ width: 240 }}/>
                <Button variant="outlined" color="primary" sx={{ ml: 1 }}>
                  저장
                </Button>
              </div>
              <div className='item'>
                <span>가사 파일</span>
                <input className='hidden' type="file" ref={lyricRef} onChange={(e) => {
                  setMusic({
                    ...music,
                    lyricFilename: e.target.value.substring(e.target.value.lastIndexOf('/') + 1)
                      .substring(e.target.value.lastIndexOf('\\') + 1)
                  })
                }}/>
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
                  다운로드
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
