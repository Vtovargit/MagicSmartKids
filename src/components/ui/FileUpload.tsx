import React, { useState } from 'react';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { Button } from './Button';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  allowedFormats?: string[];
  existingFiles?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  maxFiles = 3,
  maxSizeMB = 10,
  allowedFormats = ['jpg', 'jpeg', 'png', 'pdf', 'docx'],
  existingFiles = []
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setError('');

    // Validar número de archivos
    if (selectedFiles.length + files.length > maxFiles) {
      setError(`Solo puedes subir un máximo de ${maxFiles} archivos`);
      return;
    }

    // Validar cada archivo
    const validFiles: File[] = [];
    for (const file of files) {
      // Validar tamaño
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`El archivo ${file.name} excede el tamaño máximo de ${maxSizeMB}MB`);
        continue;
      }

      // Validar formato
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      if (!allowedFormats.includes(extension)) {
        setError(`El formato .${extension} no está permitido. Formatos permitidos: ${allowedFormats.join(', ')}`);
        continue;
      }

      validFiles.push(file);
    }

    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);
    onFilesChange(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesChange(newFiles);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png'].includes(extension)) {
      return <Image className="h-5 w-5 text-blue-600" />;
    } else if (extension === 'pdf') {
      return <FileText className="h-5 w-5 text-red-600" />;
    } else {
      return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-3">
      {/* Área de carga */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
        <input
          type="file"
          id="file-upload"
          multiple
          accept={allowedFormats.map(f => `.${f}`).join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={selectedFiles.length >= maxFiles}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer ${selectedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            Haz clic para seleccionar archivos o arrástralos aquí
          </p>
          <p className="text-xs text-gray-500">
            Formatos: {allowedFormats.join(', ').toUpperCase()} • Máximo {maxSizeMB}MB por archivo
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {selectedFiles.length}/{maxFiles} archivos seleccionados
          </p>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Lista de archivos seleccionados */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Archivos seleccionados:</p>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3 flex-1">
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeFile(index)}
                className="ml-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Archivos existentes */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Archivos adjuntos:</p>
          {existingFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 truncate">
                  {file.split('/').pop()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
