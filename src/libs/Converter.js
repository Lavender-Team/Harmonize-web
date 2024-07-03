export function getNoteFromFrequency(frequency) {
    // 주파수와 음계의 매핑
    const notes = [
        { note: "C1", freq: 32.70 },
        { note: "D1", freq: 36.71 },
        { note: "E1", freq: 41.20 },
        { note: "F1", freq: 43.65 },
        { note: "G1", freq: 49.00 },
        { note: "A1", freq: 55.00 },
        { note: "B1", freq: 61.74 },
        { note: "C2", freq: 65.41 },
        { note: "D2", freq: 73.42 },
        { note: "E2", freq: 82.41 },
        { note: "F2", freq: 87.31 },
        { note: "G2", freq: 98.00 },
        { note: "A2", freq: 110.00 },
        { note: "B2", freq: 123.47 },
        { note: "C3", freq: 130.81 },
        { note: "D3", freq: 146.83 },
        { note: "E3", freq: 164.81 },
        { note: "F3", freq: 174.61 },
        { note: "G3", freq: 196.00 },
        { note: "A3", freq: 220.00 },
        { note: "B3", freq: 246.94 },
        { note: "C4", freq: 261.63 },
        { note: "D4", freq: 293.66 },
        { note: "E4", freq: 329.63 },
        { note: "F4", freq: 349.23 },
        { note: "G4", freq: 392.00 },
        { note: "A4", freq: 440.00 },
        { note: "B4", freq: 493.88 },
        { note: "C5", freq: 523.25 },
        { note: "D5", freq: 587.33 },
        { note: "E5", freq: 659.25 },
        { note: "F5", freq: 698.46 },
        { note: "G5", freq: 783.99 },
        { note: "A5", freq: 880.00 },
        { note: "B5", freq: 987.77 },
        { note: "C6", freq: 1046.50 }
    ];

    // 주어진 주파수에 가장 가까운 음계를 찾기
    let closestNote = notes[0].note;
    let minDiff = Math.abs(frequency - notes[0].freq);

    for (let i = 1; i < notes.length; i++) {
        let diff = Math.abs(frequency - notes[i].freq);
        if (diff < minDiff) {
            minDiff = diff;
            closestNote = notes[i].note;
        }
    }

    return closestNote;
}
