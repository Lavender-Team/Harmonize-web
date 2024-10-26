import * as XLSX from 'xlsx';

export const fetchPitchGraph = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const time = [];
        const pitch = [];
        for (const row of jsonData) {
            time[row.index] = row.time;
            if (row.pitch !== 0)
                pitch[row.index] = row.pitch;
            else
                pitch[row.index] = null;
        }

        return [time, pitch];
    } catch (err) {
        console.error('Error fetching the Excel file:', err);
        return [];
    }
};