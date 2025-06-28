import { ChangeEvent } from 'react';
import { IconButton } from '../atoms/IconButton';

interface FileUploadButtonProps {
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  accept: string;
}

export function FileUploadButton({ onFileSelect, accept }: FileUploadButtonProps) {
  const uploadIcon = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );

  return (
    <label htmlFor="file-upload" className="cursor-pointer">
      <IconButton icon={uploadIcon} as="div">
        Upload a file
      </IconButton>
      <input
        id="file-upload"
        name="file-upload"
        type="file"
        className="sr-only"
        accept={accept}
        onChange={onFileSelect}
      />
    </label>
  );
} 