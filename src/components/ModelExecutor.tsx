import React from 'react';
import axios from "axios";
import Box from '@mui/joy/Box';
import Button from "@mui/joy/Button";
import CircleIcon from '@mui/icons-material/Circle';
import { Typography } from '@mui/joy';

import { User } from 'TYPES';

export default function ModelExecutor({ user }: {
  user: User
}) {

  const [musicAnalysis, setMusicAnalysis] = React.useState<boolean>(false);
  const [recSys, setRecSys] = React.useState<boolean>(false);

  const [isContentBasedButtonDisabled, setIsContentBasedButtonDisabled] = React.useState<boolean>(false);
  const [isOneButtonDisabled, setIsOneButtonDisabled] = React.useState<boolean>(false);
  const [isAllButtonDisabled, setIsAllButtonDisabled] = React.useState<boolean>(false);

  React.useEffect(() => {
    axios.get("/api/music/status").then((response) => {
      setMusicAnalysis(response.data.musicAnalysis);
      setRecSys(response.data.recSys);
    });
  }, []);

  async function requestContentBased() {
    setIsContentBasedButtonDisabled(true);
    
    axios.post("/api/music/recsys/content-based", undefined, { withCredentials: true }).finally(() => {
      setIsContentBasedButtonDisabled(false);
    });
  }

  async function recommendAgainOne(userId: number) {
    setIsOneButtonDisabled(true);
    
    axios.post("/api/music/recsys/collaborative?userId="+userId, undefined, { withCredentials: true }).finally(() => {
      setIsOneButtonDisabled(false);
    });
  }

  async function recommendAgainAll() {
    setIsAllButtonDisabled(true);
    
    axios.post("/api/music/recsys/collaborative", undefined, { withCredentials: true }).finally(() => {
      setIsAllButtonDisabled(false);
    });
  }

  return (
    <Box sx={{ mt: '12px', backgroundColor: '#f0f4f8',  p: '12px', borderRadius: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CircleIcon htmlColor={(musicAnalysis ? 'green' : 'red')} sx={{ fontSize: '12px' }} />
          <Typography level='title-sm'>
            음악 분석 ({musicAnalysis ? "ready" : "stop or busy"})
          </Typography>
          <CircleIcon htmlColor={(recSys ? 'green' : 'red')} sx={{ fontSize: '12px', ml: '12px' }} />
          <Typography level='title-sm'>
            추천 시스템 ({recSys ? "ready" : "stop or busy"})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '16px' }}>
          <Button
            disabled={isContentBasedButtonDisabled}
            variant="solid"
            onClick={requestContentBased}
            sx={{ height: 40 }}
          >
            유사한 음악 추천 재실행
          </Button>
          <Box sx={{ display: 'flex', gap: '12px' }}>
            <Button
              disabled={(isOneButtonDisabled || user === null)}
              variant="solid"
              onClick={() => { recommendAgainOne(user.userId) }}
              sx={{ height: 40 }}
            >
              선택한 회원 추천 재실행
            </Button>
            <Button
              disabled={isAllButtonDisabled}
              variant="solid"
              onClick={recommendAgainAll}
              sx={{ height: 40 }}
            >
              전체 회원 추천 재실행
            </Button>
          </Box>
        </Box>
    </Box>
  );
};
