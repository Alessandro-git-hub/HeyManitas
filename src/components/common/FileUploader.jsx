import React, { useState, useRef } from 'react';
import { FaUpload, FaFile, FaTimes, FaImage, FaFilePdf, FaFileWord, FaFileExcel } from 'react-icons/fa';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../utils/firebase';

const FileUploader = ({ onFilesChange, maxFiles = 5, maxFileSize = 10 * 1024 * 1024, acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt'] }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <FaImage className="text-primary-500" />;
    if (fileType === 'application/pdf') return <FaFilePdf className="text-red-500" />;
    if (fileType.includes('word') || fileType.includes('msword')) return <FaFileWord className="text-primary-600" />;
    if (fileType.includes('sheet') || fileType.includes('excel')) return <FaFileExcel className="text-green-600" />;
    return <FaFile className="text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size must be less than ${formatFileSize(maxFileSize)}`;
    }

    // Check file type
    const isAccepted = acceptedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      return file.type === type || file.name.toLowerCase().endsWith(type);
    });

    if (!isAccepted) {
      return `File type not accepted. Allowed types: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFileSelect = async (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    
    // Check if adding these files would exceed the limit
    if (files.length + fileArray.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }

    const validFiles = [];
    const errors = [];

    // Validate each file
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    // Show validation errors
    if (errors.length > 0) {
      alert('Some files were rejected:\n' + errors.join('\n'));
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    const uploadedFiles = [];

    try {
      // Upload each valid file
      for (const file of validFiles) {
        const fileId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const fileName = `booking-attachments/${fileId}-${file.name}`;
        const storageRef = ref(storage, fileName);

        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        try {
          // Upload file
          const uploadResult = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(uploadResult.ref);

          const uploadedFile = {
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            url: downloadURL,
            storagePath: fileName
          };

          uploadedFiles.push(uploadedFile);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        } catch (error) {
          console.error('Error uploading file:', file.name, error);
          setUploadProgress(prev => ({ ...prev, [fileId]: -1 })); // -1 indicates error
        }
      }

      // Update files state
      const newFiles = [...files, ...uploadedFiles];
      setFiles(newFiles);
      onFilesChange(newFiles);

    } catch (error) {
      console.error('Error in file upload process:', error);
    } finally {
      setUploading(false);
      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress({});
      }, 2000);
    }
  };

  const handleRemoveFile = async (fileToRemove) => {
    try {
      // Delete from Firebase Storage
      if (fileToRemove.storagePath) {
        const fileRef = ref(storage, fileToRemove.storagePath);
        await deleteObject(fileRef);
      }

      // Remove from state
      const updatedFiles = files.filter(file => file.id !== fileToRemove.id);
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    } catch (error) {
      console.error('Error removing file:', error);
      // Still remove from UI even if storage deletion fails
      const updatedFiles = files.filter(file => file.id !== fileToRemove.id);
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      {/* Uploaded Files Preview - Above Upload Area */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Attached Files ({files.length}/{maxFiles})
            </h4>
            <span className="text-xs text-gray-500">
              Click × to remove files
            </span>
          </div>
          
          {/* Compact file list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                {/* Upload Progress */}
                {uploadProgress[file.id] !== undefined && uploadProgress[file.id] < 100 && uploadProgress[file.id] !== -1 && (
                  <div className="flex-shrink-0 mx-2">
                    <div className="w-6 h-6 relative">
                      <div className="w-full h-full rounded-full border border-primary-200 bg-primary-50">
                        <div 
                          className="absolute top-0 left-0 rounded-full bg-primary-500 transition-all duration-300"
                          style={{
                            width: '100%',
                            height: '100%',
                            transform: `scale(${uploadProgress[file.id] / 100})`,
                            transformOrigin: 'center'
                          }}
                        />
                      </div>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-primary-600">
                        {uploadProgress[file.id]}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Error indicator */}
                {uploadProgress[file.id] === -1 && (
                  <div className="flex-shrink-0 mx-2">
                    <span className="text-red-500 text-xs font-medium">Failed</span>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file);
                  }}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors rounded"
                  title="Remove file"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          uploading 
            ? 'border-primary-300 bg-primary-50' 
            : files.length > 0 
            ? 'border-gray-200 bg-gray-50 hover:border-gray-300'
            : 'border-gray-300 hover:border-gray-400 cursor-pointer'
        } ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !uploading && files.length < maxFiles && fileInputRef.current?.click()}
      >
        <FaUpload className={`mx-auto mb-3 text-2xl ${uploading ? 'text-primary-500' : files.length > 0 ? 'text-gray-300' : 'text-gray-400'}`} />
        <p className="text-gray-600 mb-2">
          {uploading 
            ? 'Uploading files...' 
            : files.length >= maxFiles 
            ? `Maximum ${maxFiles} files reached`
            : files.length > 0 
            ? 'Add more files or drop here'
            : 'Drop files here or click to browse'
          }
        </p>
        {files.length < maxFiles && (
          <>
            <p className="text-sm text-gray-500">
              {maxFiles - files.length} more file{maxFiles - files.length !== 1 ? 's' : ''} allowed, up to {formatFileSize(maxFileSize)} each
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Accepted: Images, PDF, Word documents, Excel files, Text files
            </p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
        accept={acceptedTypes.join(',')}
        disabled={uploading || files.length >= maxFiles}
      />
    </div>
  );
};

export default FileUploader;
