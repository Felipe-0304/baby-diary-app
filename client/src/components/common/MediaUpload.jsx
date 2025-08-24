import React, { useState, useRef } from 'react';
import { Upload, X, FileImage, FileVideo, Camera, Video, AlertCircle } from 'lucide-react';
import Button from './Button';
import Card from './Card';

const MediaUpload = ({ 
  onFileSelect, 
  acceptedTypes = ['image/*', 'video/*'],
  maxSize = 50,
  showPreview = true,
  multiple = false,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    setError('');
    
    const validFiles = files.filter(file => {
      const isValidType = acceptedTypes.some(type => {
        if (type === 'image/*') return file.type.startsWith('image/');
        if (type === 'video/*') return file.type.startsWith('video/');
        return file.type === type;
      });
      
      const isValidSize = file.size <= maxSize * 1024 * 1024;
      
      if (!isValidType) {
        setError(`Tipo de archivo no válido: ${file.name}`);
        return false;
      }
      
      if (!isValidSize) {
        setError(`Archivo demasiado grande: ${file.name}. Máximo ${maxSize}MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      const newFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles;
      setSelectedFiles(newFiles);
      
      if (showPreview) {
        generatePreviews(newFiles);
      }
      
      onFileSelect(multiple ? newFiles : newFiles[0]);
    }
  };

  const generatePreviews = (files) => {
    const newPreviews = [];
    
    files.forEach(file => {
      const reader = new FileReader();
      const preview = {
        file,
        url: null,
        type: file.type.startsWith('image/') ? 'image' : 'video'
      };
      
      reader.onload = (e) => {
        preview.url = e.target.result;
        setPreviews(prev => {
          const filtered = prev.filter(p => p.file !== file);
          return [...filtered, preview];
        });
      };
      
      reader.readAsDataURL(file);
      newPreviews.push(preview);
    });
  };

  const removeFile = (fileToRemove) => {
    const newFiles = selectedFiles.filter(file => file !== fileToRemove);
    setSelectedFiles(newFiles);
    setPreviews(prev => prev.filter(p => p.file !== fileToRemove));
    onFileSelect(multiple ? newFiles : null);
    setError('');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <Card
        className={`relative border-2 border-dashed transition-all duration-200 cursor-pointer
          ${dragActive 
            ? 'border-primary-400 bg-primary-50 scale-105' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        padding="lg"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center space-y-4">
          {error ? (
            <div className="flex justify-center">
              <AlertCircle className="text-red-500" size={48} />
            </div>
          ) : (
            <div className="flex justify-center space-x-4">
              <Upload className="text-gray-400" size={32} />
              {acceptedTypes.includes('image/*') && <FileImage className="text-blue-400" size={32} />}
              {acceptedTypes.includes('video/*') && <FileVideo className="text-red-400" size={32} />}
            </div>
          )}
          
          <div>
            {error ? (
              <p className="text-red-600 font-medium">{error}</p>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-900">
                  Arrastra archivos aquí o{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary-600 hover:text-primary-500 font-semibold underline"
                  >
                    selecciona archivos
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {acceptedTypes.includes('image/*') && acceptedTypes.includes('video/*') 
                    ? 'Imágenes y videos'
                    : acceptedTypes.includes('image/*') 
                    ? 'Solo imágenes'
                    : 'Solo videos'
                  } hasta {maxSize}MB cada uno
                </p>
              </>
            )}
          </div>
          
          {/* Quick Actions */}
          {!error && (
            <div className="flex justify-center space-x-3">
              {acceptedTypes.includes('image/*') && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Camera size={16} />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Foto
                </Button>
              )}
              {acceptedTypes.includes('video/*') && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Video size={16} />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Video
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Previews */}
      {showPreview && previews.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Archivos seleccionados ({previews.length})
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {previews.map((preview, index) => (
              <Card key={index} className="flex items-center space-x-3 p-3">
                {/* Preview */}
                <div className="flex-shrink-0">
                  {preview.type === 'image' ? (
                    <img
                      src={preview.url}
                      alt={preview.file.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Video className="text-gray-400" size={24} />
                    </div>
                  )}
                </div>
                
                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {preview.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(preview.file.size)} • {preview.type}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div className="bg-primary-500 h-1 rounded-full w-full"></div>
                    </div>
                    <span className="text-xs text-green-600 ml-2">✓</span>
                  </div>
                </div>
                
                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X size={16} />}
                  onClick={() => removeFile(preview.file)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                />
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
