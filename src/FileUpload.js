import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadSuccess(true);
        console.log('File uploaded successfully', result);
      } else {
        setUploadSuccess(false);
        console.error('Error uploading file', result.error);
      }
    } catch (error) {
      setUploadSuccess(false);
      console.error('Error uploading file', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {uploadSuccess === true && <p>Upload successful!</p>}
      {uploadSuccess === false && <p>Error uploading file!</p>}
    </div>
  );
};

export default FileUpload;
