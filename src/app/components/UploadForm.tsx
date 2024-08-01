// components/UploadForm.tsx
"use client"
import React, { useState } from 'react';

const UploadForm: React.FC = () => {
  const [keywords, setKeywords] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (files.length + newFiles.length > 10) {
        alert('You can only upload up to 10 resumes.');
        return;
      }
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    // Split keywords by space and limit to 5 keywords
    const keywordArray = keywords.split(/\s+/).slice(0, 5);
    formData.append('keywords', JSON.stringify(keywordArray));
    files.forEach((file) => formData.append('resumes', file));

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Resumes uploaded successfully!');
    } else {
      alert('Failed to upload resumes.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
            Keywords
          </label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter keywords separated by spaces"
            required
          />
        </div>
        <div>
          <label htmlFor="resumes" className="block text-sm font-medium text-gray-700">
            Upload Resumes (.docx, up to 10 files)
          </label>
          <input
            type="file"
            id="resumes"
            accept=".docx"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer"
            required
          />
        </div>
        {files.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Uploaded Resumes:</h4>
            <ul className="list-disc list-inside mt-2">
              {files.map((file, index) => (
                <li key={index} className="text-sm text-gray-600">{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
