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

import AttachFileIcon from '@mui/icons-material/AttachFile';

import './music.css';


export default function AddMusicBulk() {

  const [file, setFile] = useState({
    csvFilename: '',
    csvFile: null
  });
  const [bulkLog, setBulkLog] = useState('');

  const csvRef = React.useRef();


  const handleCsvFileChange = (e: any) => {
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

      fetch('/api/music/bulk', {
        method: 'POST',
        body: formData
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

  const fetchBulkLog = () => {
    fetch('/api/log/bulk')
      .then(async response => {
        if (response.ok) {
          const logs = await JSON.parse(await response.text());
          setBulkLog(logs.join('\r\n'));
        } else {
          alert('일괄 업로드 로그 조회 중 오류가 발생하였습니다.');
        }
      });
  }

  const clearBulkLog = () => {
    if (window.confirm('일괄 업로드 로그를 삭제하시겠습니까?\n삭제하면 더 이상 확인할 수 없습니다.')) {
      fetch('/api/log/bulk', {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
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
                  <a href={"/music-sample.csv"} target='_blank'>
                    <Button variant="outlined" color="primary" sx={{ ml: 2 }}>
                      양식 다운로드
                    </Button>
                  </a>
                  <Box  sx={{ position: 'absolute', right: 0, ml: 4 }}>
                    <Button variant="outlined" color="primary" onClick={clearBulkLog}>
                      로그 삭제
                    </Button>
                    <Button variant="solid" color="primary" sx={{ ml: 1 }} onClick={fetchBulkLog}>
                      로그 조회
                    </Button>
                  </Box>
                </div>
                <Textarea
                  value={bulkLog}
                  placeholder="일괄 업로드 결과를 보려면 로그 조회 누르기…"
                  minRows={5}
                  maxRows={5}
                  sx={{ width: '100%', maxWidth: '1000px', mt: '24px'}}
                />
              </Box>
            </div>

          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
