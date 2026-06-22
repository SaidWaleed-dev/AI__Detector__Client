import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Image as ImageIcon, Music, Video } from 'lucide-react';
import '../styles/FileUpload.css';

const ACCEPT_MAP = {
    'image/*': { 'image/*': [] },
    'audio/*': { 'audio/*': [] },
};

const FileUpload = ({ onFileSelect, selectedFile, accept = 'image/*', t }) => {
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPT_MAP[accept] || ACCEPT_MAP['image/*'],
        maxFiles: 1
    });

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return <ImageIcon size={48} className="file-icon" />;
        if (type.startsWith('audio/')) return <Music size={48} className="file-icon" />;
        if (type.startsWith('video/')) return <Video size={48} className="file-icon" />;
        return <FileText size={48} className="file-icon" />;
    };

    const uploadPrompt = accept === 'audio/*' ? t.upload_prompt_audio : t.upload_prompt_image;

    return (
        <div className="file-upload-container">
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} ${selectedFile ? 'has-file' : ''}`}>
                <input {...getInputProps({ accept })} />

                {selectedFile ? (
                    <div className="file-preview fade-in">
                        {getFileIcon(selectedFile.type)}
                        <div className="file-info">
                            <p className="file-name">{selectedFile.name}</p>
                            <p className="file-size">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <button
                            className="change-file-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onFileSelect(null);
                            }}
                        >
                            {t.change_file}
                        </button>
                    </div>
                ) : (
                    <div className="upload-prompt">
                        <UploadCloud size={64} className="upload-icon" />
                        <p className="upload-text">
                            {isDragActive ? t.upload_drop : uploadPrompt}
                        </p>
                        <p className="upload-subtext">{t.upload_browse}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
