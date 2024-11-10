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
import Textarea from '@mui/joy/Textarea';
import FileDrop from '../../components/FileDrop';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Checkbox from '@mui/joy/Checkbox';

import AttachFileIcon from '@mui/icons-material/AttachFile';

import './music.css';


export default function AddMusicBulk() {

  const [file, setFile] = useState({
    csvFilename: '',
    csvFile: null
  });
  const [bulkLog, setBulkLog] = useState(''); // 음악 업로드 로그
  const [isEucKr, setIsEucKr] = useState(false); // 음악 업로드 EUC-KR 인코딩 사용 여부

  const [fileType, setFileType] = React.useState('앨범 커버'); // 파일 업로드 옵션 (앨범 커버, 음악, 가사)
  const [bulkFileLog, setBulkFileLog] = useState(''); // 파일 업로드 로그

  const csvRef = React.useRef();


  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile({
        ...file,
        csvFilename: e.target.value.substring(e.target.value.lastIndexOf('/') + 1)
          .substring(e.target.value.lastIndexOf('\\') + 1),
        csvFile: file
      });
    }
  };

  const submitCsvFile = () => {
    if (file.csvFile) {
      const formData = new FormData();
      formData.append('bulkFile', file.csvFile);

      fetch(`/api/music/bulk?charset=${isEucKr ? 'euc-kr' : 'utf-8'}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })
        .then(response => {
          if (response.ok) {
            alert('업로드에 성공하였습니다.');
          } else {
            alert('일괄 업로드 중 오류가 발생하였습니다.');
          }
        });
    }
  }

  const submitFileUpload = async (file) => {
    if (!file)
      return;

    let data = new FormData();

    if (fileType === '앨범 커버')
      data.append('albumCover', file);
    else if (fileType === '음악 파일')
      data.append('audioFile', file);
    else if (fileType === '가사 파일')
      data.append('lyricFile', file);

    const res = await fetch(`/api/music/bulk/files`, { method: 'POST', credentials: 'include', body: data })

    if (res.ok) {
      alert(`[${fileType}]`+ file.name + ' 업로드 성공');
    }
    else {
      alert('파일 업로드 중 오류가 발생하였습니다.');
    }
  }

  const fetchBulkLog = (isFile) => {
    fetch('/api/log/bulk' + (isFile ? '/files' : ''), { credentials: 'include' })
      .then(async response => {
        if (response.ok) {
          const logs = await JSON.parse(await response.text());
          if (isFile)
            setBulkFileLog(logs.join('\r\n'));
          else
            setBulkLog(logs.join('\r\n'));
        } else {
          alert('일괄 업로드 로그 조회 중 오류가 발생하였습니다.');
        }
      });
  }

  const clearBulkLog = (isFile) => {
    if (window.confirm('일괄 업로드 로그를 삭제하시겠습니까?\n삭제하면 더 이상 확인할 수 없습니다.')) {
      fetch('/api/log/bulk' + (isFile ? '/files' : ''), {
        method: 'DELETE',
        credentials: 'include'
      })
        .then(response => {
          if (response.ok) {
            if (isFile)
              setBulkFileLog('')
            else
              setBulkLog('');
            alert('일괄 업로드 로그를 삭제하였습니다.');
          } else {
            alert('일괄 업로드 로그 삭제 중 오류가 발생하였습니다.');
          }
        });
    }
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
                음악 일괄 업로드
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography level="h2" component="h1">
              음악 일괄 업로드
            </Typography>

            <div className="music">
              <Box sx={{ mt: '-10px' }}>
                <p className='sectionTitle'>노래 정보 일괄 업로드</p>
                <div className='item' style={{ maxWidth: '1000px', position: 'relative' }}>
                  <span>음악 CSV 파일</span>
                  <input className='hidden' type="file" ref={csvRef} accept=".csv" onChange={handleCsvFileChange}/>
                  <Input
                    value={file.csvFilename}
                    startDecorator={
                      <Button variant="soft" color="neutral" startDecorator={<AttachFileIcon />} onClick={() => { if (csvRef.current) csvRef.current.click() }}>
                        파일
                      </Button>
                    }
                    sx={{ width: 300 }}
                  />
                  <Button variant="solid" color="primary" sx={{ width: '90px', ml: 1 }} onClick={submitCsvFile}>
                    업로드
                  </Button>
                  <Box sx={{ flex: 1 }}>
                    <Checkbox label="EUC-KR 업로드" sx={{ ml: '24px', fontSize: '14px', color: '#8E8F91' }} checked={isEucKr} onChange={(e) => { setIsEucKr(e.target.checked) }}/>
                  </Box>
                  <Box  sx={{ position: 'absolute', right: 0, ml: 4 }}>
                    <a href={"/music-sample.csv"} target='_blank'>
                      <Button variant="outlined" color="primary" sx={{ ml: 2 }}>
                        양식
                      </Button>
                    </a>
                  </Box>
                </div>
                <Box sx={{ textAlign: 'right', maxWidth: '1000px', mt: '24px' }}>
                  <Button variant="outlined" color="primary" onClick={() => clearBulkLog(false)}>
                    로그 삭제
                  </Button>
                  <Button variant="solid" color="primary" sx={{ ml: 1 }} onClick={() => fetchBulkLog(false)}>
                    로그 조회
                  </Button>
                </Box>
                <Textarea
                  value={bulkLog}
                  placeholder="일괄 업로드 결과를 보려면 로그 조회 누르기…"
                  minRows={5}
                  maxRows={5}
                  sx={{ width: '100%', maxWidth: '1000px', mt: '12px'}}
                />
              </Box>
              <Box sx={{ mt: '6px', maxWidth: '1000px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <p className='sectionTitle'>파일 업로드</p>
                  <div>
                    <Typography level='body-xs'>파일의 이름을 노래의 제목으로 설정하세요.</Typography>
                    <Typography level='body-xs'>(두 곡 이상 제목이 같을 경우 '야생화[박효신]'과 같이 가수를 추가하세요.)</Typography>
                  </div>
                </Box>
                <RadioGroup
                  orientation="horizontal" name="fileType" value={fileType}
                  onChange={ (event) => setFileType(event.target.value) }
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
                  {['앨범 커버', '음악 파일', '가사 파일'].map((item) => (
                    <Radio key={item} color="neutral" value={item} disableIcon label={item} variant="plain"
                      sx={{
                        px: 2,
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '24px', mt: '12px' }}>
                  <FileDrop
                    onFileDrop={submitFileUpload}
                    sx={{ width: '100%', height: '200px' }}
                  />
                  <div style={{ width: '100%', height: '200px', marginTop: '-8px' }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Button variant="outlined" color="primary" onClick={() => clearBulkLog(true)}>
                        로그 삭제
                      </Button>
                      <Button variant="solid" color="primary" sx={{ ml: 1 }} onClick={() => fetchBulkLog(true)}>
                        로그 조회
                      </Button>
                    </Box>
                    <Textarea
                      value={bulkFileLog}
                      placeholder="파일 업로드 결과를 보려면 로그 조회 누르기…"
                      minRows={7}
                      maxRows={7}
                      sx={{ width: '100%', mt: '12px'}}
                    />
                  </div>
                </Box>
              </Box>
            </div>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
