import { DragEvent } from 'react';
import { FileUploadButton } from '../molecules/FileUploadButton';

interface FileDropZoneProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  accept: string;
}

export function FileDropZone({ 
  onFileSelect, 
  onFileDrop, 
  onDragOver, 
  onDragLeave, 
  isDragging,
  accept 
}: FileDropZoneProps) {
  return (
    <div 
      className={`border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
        isDragging 
          ? 'border-indigo-400 bg-indigo-50' 
          : 'border-zinc-200 hover:border-indigo-300'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onFileDrop}
    >
      <div className="space-y-6 text-center">
        <div className="relative">
          <svg
            className="mx-auto h-16 w-16 text-indigo-400 transition-transform duration-300 group-hover:scale-110"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <FileUploadButton onFileSelect={onFileSelect} accept={accept} />
          <p className="text-zinc-600">or drag and drop</p>
          <p className="text-sm text-zinc-500">JSON and JSON5 files</p>
        </div>
      </div>
    </div>
  );
} 