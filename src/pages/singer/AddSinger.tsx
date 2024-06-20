import * as React from 'react';
import { useState, ChangeEvent } from 'react';
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

import './singer.css';

const GENDERLIST = ['남성', '여성', '혼성']
const TYPELIST = ['솔로', '듀오', '그룹']

export default function AddSinger() {

  // 이미지 표시용으로 임시로 넣어둠
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProfilePicture(reader.result);
        }
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
                가수 관리
              </Typography>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                가수 추가
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography level="h2" component="h1">
              가수 추가
            </Typography>

            <div className="singer">
              <div className='horizontal'>
                <div>
                  <div className={(profilePicture) ? "none" : ""}>
                    <input type="file" id="profilePicture" accept="image/*" onChange={handleProfilePictureChange} className="inputfile" />
                    <label htmlFor="profilePicture" className="plus-button">+<span className='name'>프로필</span></label>
                  </div>              
                  {profilePicture && (
                    <label htmlFor="profilePicture"><img src={profilePicture} alt="프로필" className='preview' /></label>
                  )}
                </div>
                <div style={{ margin: "0 0 0 12px" }}>
                  <Input type="text" placeholder="가수 이름 입력" sx={{ width: 400 }}/>
                </div>
              </div>
              <div className='section'>
                <p className='sectionTitle'>가수 정보</p>
                <div className='item'>
                  <span>성별</span>
                  <Select placeholder="성별 선택" sx={{ width: 180 }}>
                  {
                    GENDERLIST.map((gender, index) => (
                      <Option key={index} value={gender}>{gender}</Option>
                    ))
                  }
                  </Select>
                </div>
                <div className='item'>
                  <span>유형</span>
                  <Select placeholder="유형 선택" sx={{ width: 180 }}>
                  {
                    TYPELIST.map((type, index) => (
                      <Option key={index} value={type}>{type}</Option>
                    ))
                  }
                  </Select>
                </div>
                <div className='item'>
                  <span>활동년대</span>
                  <Input type="text" placeholder="활동년대 입력" sx={{ width: 180 }}/>
                </div>
                <div className='item'>
                  <span>국적</span>
                  <Input type="text" placeholder="국적 입력" sx={{ width: 180 }}/>
                </div>
              </div>
              <div className='action'>
                <Button variant="solid" sx={{ width: 120, height: 40 }}>가수 등록</Button>
              </div>
            </div>

          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
