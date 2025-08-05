import React, { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [publicId, setPublicId] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert('Please select a file');
    await handleUpload(selectedFile);
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file); // ✅ Matches backend multer field

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadedUrl(data.url);
      setPublicId(data.public_id);
      console.log("Uploaded URL:", data.url);
    } catch (err) {
      console.error("Upload error:", err.message);
      alert("Upload failed");
    }
  };

  const handleDelete = async () => {
    if (!publicId) return;

    try {
      const response = await fetch(`http://localhost:5000/delete/${publicId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Delete failed");
      }

      alert("Image deleted");
      setUploadedUrl("");
      setPublicId("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Delete error:", err.message);
      alert("Delete failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Cloudinary Image Upload</h2>

      <form onSubmit={handleUploadSubmit}>
        <input type="file" name="image" onChange={handleFileChange} accept="image/*" />
        <br />
        <button type="submit" style={styles.uploadBtn}>Upload</button>
      </form>

      {uploadedUrl && (
        <div style={styles.preview}>
          <h3>Preview</h3>
          <img src={uploadedUrl} alt="Uploaded" style={styles.image} />
          <br />
          <button onClick={handleDelete} style={styles.deleteBtn}>Delete</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: 'auto',
    padding: '40px',
    textAlign: 'center',
    background: '#fff',
    borderRadius: '8px',
    marginTop: '40px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  image: {
    width: '100%',
    marginTop: '15px',
    borderRadius: '4px'
  },
  uploadBtn: {
    marginTop: '10px',
    padding: '10px 20px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  },
  deleteBtn: {
    marginTop: '10px',
    padding: '10px 20px',
    background: '#f44336',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  },
  preview: {
    marginTop: '30px'
  }
};

export default App;

