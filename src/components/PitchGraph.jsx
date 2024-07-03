import React from 'react';
import Plot from 'react-plotly.js';
import { fetchPitchGraph } from '../libs/ExcelReader';

function PitchGraph({ enabled, src, seek }) {

  const [state, setState] = React.useState({
    time: [],
    pitch: [],
    revision: 0
  });

  React.useEffect(() => {
    if (src && enabled) {
      updateGraph();
    }
  }, [src]);

  const updateGraph = async () => {
    let [timeD, pitchD] = await fetchPitchGraph(src);
    setState({ time: timeD, pitch: pitchD, revision: state.revision+1 });
  }

  const handleOnClick = (data) => {
    seek(dt2sec(data.points[0].x));
  }

  return (
    <div style={{ border: '1px solid #D5D5D5', borderRadius: '8px', maxWidth: '1000px', padding: '4px' }}>
        <Plot
          data={[
            {
              x: state.time.map(sec2dt),
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
              range: [0, state.time[state.time.length - 1]].map(sec2dt),
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
    </div>
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