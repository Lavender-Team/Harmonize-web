import * as React from 'react';
import { useState } from 'react';
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

import './music.css';

const GENRELIST = ['가요', '팝송', '발라드', '랩/힙합', '댄스', '일본곡', 'R&B',
                   'OST', '인디뮤직', '트로트', '어린이곡']

export default function AddMusic() {

  // 이미지 표시용으로 임시로 넣어둠
  const [albumCover, setAlbumCover] = useState(null);

  const handleAlbumCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAlbumCover(reader.result);
      };
      reader.readAsDataURL(file);
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
                  <div className={(albumCover) ? "none" : ""}>
                  <input type="file" id="albumCover" accept="image/*" onChange={handleAlbumCoverChange} className="inputfile" />
                  <label htmlFor="albumCover" className="plus-button">+<span className='name'>앨범 표지</span></label>
                  </div>              
                  {albumCover && (
                    <label htmlFor="albumCover"><img src={albumCover} alt="앨범 표지" className='preview' /></label>
                  )}
                </div>
                <div style={{ margin: "0 0 0 12px" }}>
                  <Input type="text" placeholder="음악 제목 입력" sx={{ width: 400 }}/>
                  <Input type="text" placeholder="가수 선택" sx={{ width: 400, mt: "12px" }}/>
                </div>
              </div>
              <div className='section'>
                <p className='sectionTitle'>노래 정보</p>
                <div className='item'>
                  <span>장르</span>
                  <Select placeholder="장르 선택" sx={{ width: 180 }}>
                  {
                    GENRELIST.map((genre, index) => (
                      <Option key={index} value={genre}>{genre}</Option>
                    ))
                  }
                  </Select>
                </div>
                <div className='item'>
                  <span>발매일</span>
                  <Input type="date" placeholder="날짜 선택" sx={{ width: 180 }}/>
                </div>
                <div className='item'>
                  <span>노래방 번호</span>
                  <Input type="text" placeholder="노래방 번호 입력" sx={{ width: 180 }}/>
                </div>
                <div className='item'>
                  <span>음악 특징</span>
                  <Input type="text" placeholder="음악/목소리 특징 입력" sx={{ width: 450 }}/>
                </div>
              </div>
              <div className='action'>
                <Button variant="outlined" sx={{ width: 80, height: 40, mr: '12px' }}>초기화</Button>
                <Button variant="solid" sx={{ width: 120, height: 40 }}>음악 등록</Button>
              </div>
            </div>

          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
