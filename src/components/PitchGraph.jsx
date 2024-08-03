import React from 'react';
import Plot from 'react-plotly.js';
import { fetchPitchGraph } from '../libs/ExcelReader';
import { Typography, Button } from '@mui/joy';
import { getNoteFromFrequency, playSoundFromFrequency } from '../libs/Converter';

function PitchGraph({ musicId, status, src, refresh, audioSrc }) {

  const [state, setState] = React.useState({
    time: [],
    pitch: [],
    revision: 0
  });
  
  const [analysis, setAnalysis] = React.useState({
    highestPitch: null,
    highPitchRatio: null,
    highPitchCont: null, 
    lowestPitch: null,
    lowPitchRatio: null,
    lowPitchCont: null,
    steepSlope: null,
    level: null
  });

  React.useEffect(() => {
    if (src && status === 'COMPLETE') {
      updateGraph();
    }
    updateMusicAnalysis(musicId);
  }, [musicId, src, status, refresh]);

  const updateGraph = async () => {
    let [timeD, pitchD] = await fetchPitchGraph(src);
    setState({ time: timeD, pitch: pitchD, revision: state.revision+1 });
  }

  const updateMusicAnalysis = async (musicId) => {
    if (!musicId || musicId === -1) return;

    const response = await fetch(`/api/music/${musicId}`);

    if (response.ok) {
      const res = await response.json();
      setAnalysis({
        highestPitch: res.highestPitch,
        highPitchRatio: res.highPitchRatio,
        highPitchCont: res.highPitchCont, 
        lowestPitch: res.lowestPitch,
        lowPitchRatio: res.lowPitchRatio,
        lowPitchCont: res.lowPitchCont,
        steepSlope: res.steepSlope,
        level: res.level
      });
    }
  }

  const handleOnClick = (data) => {
    handleSeekChange(data.points[0].x);
    handleSelectedChange(data.points[0].x, data.points[0].y);
  }

  /* 오디오 재생 관련 */
  const audioPlayRef = React.useRef(null);
  const selectedTimeRef = React.useRef(null);
  const selectedPitchRef = React.useRef(null);
  const selectedNoteRef = React.useRef(null);

  // 오디오 재생 위치 변경
  const handleSeekChange = (time) => {
    if (!audioPlayRef.current) return;
    audioPlayRef.current.currentTime = time;
  };

  // 선택한 음 값 설정 (state로 관리시 다시 렌더링되기 때문에 ref로 관리)
  const handleSelectedChange = (time, pitch) => {
    selectedTimeRef.current.innerText = time;
    selectedPitchRef.current.innerText = pitch.toFixed(3);
    selectedNoteRef.current.innerText = getNoteFromFrequency(pitch);
  }

  const playSound = () => {
    const pitch = parseFloat(selectedPitchRef.current.innerText);
    if (!isNaN(pitch))
      playSoundFromFrequency(pitch, 500);
  }

  const deletePoint = async () => {
    if (!selectedTimeRef.current.innerText)
      return;

    const response = await fetch(`/api/music/${musicId}/delete?time=${selectedTimeRef.current.innerText}`, {
      method: 'POST'
    });

    if (response.ok) {
      alert('삭제 요청이 완료되었습니다. (몇 초 소요됨)');
    } else {
      alert('삭제 요청 중 오류가 발생하였습니다.');
    }
  }
  

  return (
    <>
      <div style={{ border: '1px solid #D5D5D5', borderRadius: '8px', maxWidth: '1000px', padding: '4px', textAlign: 'center' }}>
          {
            (status === 'INCOMPLETE') &&
            <Typography level='body-sm' sx={{ mt: '48px', mb: '48px' }}>음악 분석을 실행하여야 합니다.</Typography>
          }
          {
            (status === 'RUNNING') &&
            <Typography color='primary' level='body-sm' sx={{ mt: '48px', mb: '48px' }}>음악 분석 실행 중...</Typography>
          }
          {
            (status === 'COMPLETE') &&
            <Plot
              data={[
                {
                  x: state.time,
                  y: state.pitch,
                  type: 'scatter',
                  mode: 'markers',
                  marker: { color: '#770ef8', size: 3 },
                },
              ]}
              layout={{
                width: 1000-8,
                height: 240,
                margin: { l: 24, r: 24, t: 48, b: 18 },
                xaxis: {
                  range: [0, state.time[state.time.length - 1]],
                  tickformat: '%M:%S:%L',
                },
                yaxis: {
                  range: [0, Math.max(...state.pitch)+10],
                  fixedrange: true, // y축 이동 비활성화
                  tickvals: [65.42, 98.00, 130.81, 196.00, 261.63, 392.00, 523.25, 783.99],
                  ticktext: ['C2', 'G2', 'C3', 'G3', 'C4', 'G4', 'C5', 'G5']
                },
              }}
              datarevision={state.revision}
              onClick={handleOnClick}
            />
          }
      </div>
      {
        (status === 'COMPLETE') && <>
          <audio
            ref={audioPlayRef}
            src={audioSrc}
            controls={true}
            style={{ width: '100%', maxWidth: '1000px', height: '40px', marginTop: '12px', marginBottom: '12px' }}
          ></audio>
          <div style={{ display: 'flex', maxWidth: '1000px' }}>
            <div>
              <div className='item analysis'>
                <div><span>최고음</span><Typography level="title-sm">
                  {(analysis.highestPitch) ? getNoteFromFrequency(analysis.highestPitch) + ` (${analysis.highestPitch.toFixed(2)})` : '-'}
                </Typography></div>
                <div><span>고음 비율</span><Typography level="title-sm">-%</Typography></div>
                <div><span>고음 지속</span><Typography level="title-sm">-초</Typography></div>
              </div>
              <div className='item analysis'>
                <div><span>최저음</span><Typography level="title-sm">
                  {(analysis.lowestPitch) ? getNoteFromFrequency(analysis.lowestPitch) + ` (${analysis.lowestPitch.toFixed(2)})` : '-'}  
                </Typography></div>
                <div><span>저음 비율</span><Typography level="title-sm">-%</Typography></div>
                <div><span>저음 지속</span><Typography level="title-sm">-초</Typography></div>
              </div>
              <div className='item analysis'>
                <div><span>난이도</span><Typography level="title-sm">-</Typography></div>
                <div><span>급격한 음 변화</span><Typography level="title-sm">-회</Typography></div>
              </div>
            </div>
            <div style={{ flex: 1, padding: '12px', paddingLeft: '48px' }}>
              <Typography level="body-sm">선택한 음</Typography>
              <Typography level="title-md" sx={{ mt: '4px', mb: '12px' }}>
                <span ref={selectedTimeRef}>-</span>초,&nbsp;
                <span ref={selectedPitchRef}>-</span>(<span ref={selectedNoteRef}>-</span>)
              </Typography>
              <Button variant="outlined" size="sm" onClick={playSound}>음 듣기</Button>
              <Button variant="outlined" size="sm" onClick={deletePoint} sx={{ ml: '12px' }}>삭제</Button>
            </div>
          </div>
        </>
      }
    </>
  );
}

function sec2dt(v) {
  var MIN = 60
  var HOUR = 60 * 60
  
  var h = Math.floor(v / HOUR)
  var m =  Math.floor((v - (h * HOUR)) / MIN)
  var s = Math.floor(v - (h * HOUR) - (m * MIN))
  var ms = Math.floor((v - Math.floor(v)) * 1000)

  // you have to provide YYYY-MM-DD
  // for plotly to understand it as a date
  return `2017-01-01 ${h}:${pad(m)}:${pad(s)}.${pad3(ms)}`
}

function dt2sec(v) {
  var MIN = 60
  var HOUR = 60 * 60

  var [h, m, s] = v.split(' ')[1].split(':').map(Number)

  return h * HOUR + m * MIN + s
}

function pad(v) {
  return v < 10 ? '0' + v : String(v)
}

function pad3(v) {
  if (v < 10) return '00' + v
  else if (v < 100) return '0' + v
  else return String(v)
}

export default PitchGraph;