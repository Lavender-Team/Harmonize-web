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
import RadioGroup from "@mui/joy/RadioGroup";
import Radio from "@mui/joy/Radio";

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import { alertMessage } from '../../libs/ErrorMessage';
import SingerGroupSelector from "../../components/SingerGroupSelector";
import "./group.css";

export default function EditGroup() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [group, setGroup] = useState({
    groupName: '',
    groupType: "솔로",
    agency: '',
    profileImage: null,
    profileImageFile: null,
  });

  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchGroup(id);
  }, []);

  async function fetchGroup(groupId) {
    const response = await fetch(`/api/group/${groupId}`);

    if (response.ok) {
      const res = await response.json();
      setGroup({
        ...group,
        groupName: res.groupName,
        groupType: (res.groupType === 'SOLO') ? '솔로' : '그룹',
        agency: res.agency,
        profileImage: res.profileImage,
      });
      setMembers(res.members);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroup({
      ...group,
      [name]: value
    });
  };

  const handleGroupTypeChange = (value) => {
    setGroup({
        ...group,
        groupType: value,
    });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            setGroup({
                ...group,
                profileImage: reader.result,
                profileImageFile: file,
            });
        };
        reader.readAsDataURL(file);
    }
  };

  const isGroupValid = (singer) => {
    if (
        !group.groupName ||
        !group.agency ||
        !group.profileImage ||
        members.length === 0
    ) {
        // TODO: 필수가 아닌 항목은 체크하지 않아도 되도록 수정
        return false;
    }
    return true;
  };

  const handleGroupSubmit = async () => {
    if (!isGroupValid(group)) {
      alert("그룹 정보를 모두 입력해주세요.");
      return;
    }
    
    let data = new FormData();
    data.append("groupName", group.groupName);
    data.append("groupType", (members.length === 1) ? 'SOLO' : 'GROUP');
    data.append("agency", group.agency);
    data.append("artistIds", members.map((member) => member.id).toString());
    if (group.profileImageFile)
      data.append("profileImage", group.profileImageFile);

    const res = await fetch(`/api/group/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: data
    })

    if (res.ok) {
      navigate('/group-manage')
    }
    else {
      const errors = await res.json();
      alert(alertMessage(errors));
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
                그룹 관리
              </Typography>
              <Link component={RouterLink} to="/group-manage">
                <Typography color="neutral" fontWeight={500} fontSize={12}>
                그룹 관리
                </Typography>
              </Link>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                그룹 정보 편집
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography level="h2" component="h1">
              그룹 정보 편집
            </Typography>

            <div className="singer">
              <div className='horizontal'>
                <div>
                  <div className={(group.profileImage) ? "none" : ""}>
                  <input type="file" id="profileImage" accept="image/*" onChange={handleProfileImageChange} className="inputfile" />
                  <label htmlFor="profileImage" className="plus-button">+<span className='name'>프로필 이미지</span></label>
                  </div>
                  {group.profileImage && (
                    <label htmlFor="profileImage"><img src={group.profileImage} alt="앨범 표지" className='preview' /></label>
                  )}
                </div>
                <div style={{ margin: "0 0 0 12px" }}>
                  <Input type="text" placeholder="그룹 이름 입력" name="groupName" value={group.groupName} onChange={handleInputChange} sx={{ width: 400 }}/>
                  <Input type="text" placeholder="소속사 입력" name="agency" value={group.agency} onChange={handleInputChange} sx={{ width: 220, mt: '12px' }} />
                </div>
              </div>
              <div className="section">
                <RadioGroup
                    orientation="horizontal" name="groupType" value={group.groupType}
                    onChange={ (event) => handleGroupTypeChange(event.target.value) }
                    sx={{
                        display: 'inline-flex',
                        minHeight: 48,
                        padding: '4px',
                        borderRadius: '12px',
                        bgcolor: 'neutral.softBg',
                        '--RadioGroup-gap': '4px',
                        '--Radio-actionRadius': '8px',
                    }}
                    >
                    {['솔로', '그룹'].map((item) => (
                        <Radio key={item} color="neutral" value={item} disableIcon label={item} variant="plain"
                        sx={{
                            px: 6,
                            alignItems: 'center',
                            fontSize: '14px',
                        }}
                        slotProps={{
                            action: ({ checked }) => ({
                            sx: {
                                ...(checked && {
                                bgcolor: 'background.surface',
                                boxShadow: 'sm',
                                '&:hover': {
                                    bgcolor: 'background.surface',
                                },
                                }),
                            },
                            }),
                        }}
                        />
                    ))}
                </RadioGroup>
                <Box sx={{ maxWidth: '1000px' }}>
                    <SingerGroupSelector
                        multiple={(group.groupType === '그룹')}
                        members={members}
                        setMembers={setMembers}
                    />
                </Box>
              </div>
              
              <div className='action'>
                <Button variant="solid" onClick={handleGroupSubmit} sx={{ width: 140, height: 40, verticalAlign: 'bottom' }}>그룹 정보 편집</Button>
              </div>
            </div>

          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
