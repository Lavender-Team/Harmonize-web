import * as React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import { alertMessage } from '../../libs/ErrorMessage';
import "./singer.css";

const GENDERLIST = { 남성: "MALE", 여성: "FEMALE", 기타: "OTHER" };

function convertGenderToLabel(genre) {
  for (const [label, value] of Object.entries(GENDERLIST)) {
    if (value === genre) {
      return label;
    }
  }
  return '';
}

export default function EditSinger() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [singer, setSinger] = useState({
    artistName: "",
    gender: "",
    activityPeriod: "",
    nation: "",
    agency: "",
    profileImage: null,
    profileImageFile: null,
  });

  useEffect(() => {
    fetchSinger(id);
  }, []);

  async function fetchSinger(singerId) {
    const response = await fetch(`/api/artist/${singerId}`, { credentials: 'include' });

    if (response.ok) {
      const res = await response.json();
      setSinger({
        ...singer,
        artistName: res.artistName,
        gender: res.gender,
        activityPeriod: res.activityPeriod,
        nation: res.nation,
        agency: res.agency,
        profileImage: res.profileImage
      });
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSinger({
      ...singer,
      [name]: value
    });
  };

  const handleGenderChange = (value) => {
    setSinger({
        ...singer,
        gender: value,
    });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            setSinger({
                ...singer,
                profileImage: reader.result,
                profileImageFile: file,
            });
        };
        reader.readAsDataURL(file);
    }
  };

  const isSingerValid = (singer) => {
    if (
        !singer.artistName ||
        !singer.gender ||
        !singer.nation
    ) {
        return false;
    }
    return true;
};

  const handleSingerSubmit = async () => {
    if (!isSingerValid(singer)) {
      alert("가수 정보를 모두 입력해주세요.");
      return;
    }
    
    let data = new FormData();
    data.append("artistName", singer.artistName);
    data.append("gender", singer.gender);
    data.append("activityPeriod", singer.activityPeriod);
    data.append("nation", singer.nation);
    data.append("agency", singer.agency);
    if (singer.profileImageFile)
      data.append("profileImage", singer.profileImageFile);

    const res = await fetch(`/api/artist/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: data
    })

    if (res.ok) {
      navigate(-1)
    }
    else {
      const errors = await res.json();
      alert(alertMessage(errors));
    }
  };

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
                가수 관리
              </Typography>
              <Link component={RouterLink} to="/singer-manage">
                <Typography color="neutral" fontWeight={500} fontSize={12}>
                  가수 관리
                </Typography>
              </Link>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                가수 정보 편집
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography level="h2" component="h1">
              가수 정보 편집
            </Typography>

            <div className="singer">
              <div className='horizontal'>
                <div>
                  <div className={(singer.profileImage) ? "none" : ""}>
                  <input type="file" id="profileImage" accept="image/*" onChange={handleProfileImageChange} className="inputfile" />
                  <label htmlFor="profileImage" className="plus-button">+<span className='name'>프로필 이미지</span></label>
                  </div>
                  {singer.profileImage && (
                    <label htmlFor="profileImage"><img src={singer.profileImage} alt="앨범 표지" className='preview' /></label>
                  )}
                </div>
                <div style={{ margin: "0 0 0 12px" }}>
                  <Input type="text" placeholder="가수 이름 입력" name="artistName" value={singer.artistName} onChange={handleInputChange} sx={{ width: 400 }}/>
                </div>
              </div>
              <div className='section'>
                <p className='sectionTitle'>가수 정보</p>
                <div className='item'>
                  <span>성별</span>
                  <Select placeholder={convertGenderToLabel(singer.gender)} sx={{ width: 180 }}>
                    {Object.keys(GENDERLIST).map((gender, index) => (
                      <Option key={index} value={gender} onClick={() => { handleGenderChange(GENDERLIST[gender]); }}>
                        {gender}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className='item'>
                  <span>활동 연대</span>
                  <Input type="text" placeholder="활동 연대 입력" name="activityPeriod" value={singer.activityPeriod}
                      onChange={handleInputChange} sx={{ width: 180 }} />
                </div>
                <div className="item">
                  <span>국적</span>
                  <Input type="text" placeholder="국적 입력" name="nation" value={singer.nation}
                      onChange={handleInputChange} sx={{ width: 180 }} />
              </div>
              <div className="item">
                  <span>소속사</span>
                  <Input type="text" placeholder="소속사 입력" name="agency" value={singer.agency}
                      onChange={handleInputChange} sx={{ width: 180 }}/>
              </div>
              </div>
              
              <div className='action'>
                <Button variant="solid" onClick={handleSingerSubmit} sx={{ width: 140, height: 40, verticalAlign: 'bottom' }}>가수 정보 편집</Button>
              </div>
            </div>

          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
