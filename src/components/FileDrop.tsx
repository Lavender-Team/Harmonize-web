import React, { useState } from 'react';
import { Typography } from '@mui/joy';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface FileDropProps {
    onFileDrop: (file: File) => void;
    sx: any;
}


const FileDrop: React.FC<FileDropProps> = ({ onFileDrop, sx }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        for (let i = 0; i < event.dataTransfer.files.length; i++) {
            const file = event.dataTransfer.files[i];
            onFileDrop(file);
        }
    };

    const fileDropStyles = {
        border: '2px dashed rgb(205, 215, 225)',
        boxSizing: 'border-box',
        borderRadius: '8px',
        textAlign: 'center',
        paddingTop: '60px',
    }

    const fileDropHoverStyles = {
        border: '2px solid #770ef8'
    }

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
                ...fileDropStyles,
                ...(isDragging ? fileDropHoverStyles : {}),
                ...sx
            }}
        >
            <UploadFileIcon sx={{ fontSize: 48, mb: '12px' }} />
            <Typography level='body-sm'>
                업로드할 파일을 여기로 드래그 앤 드롭하세요.
            </Typography>
            
        </div>
    );
};

export default FileDrop;