import React from 'react'

interface FileDropZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileDropZone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileUpload
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
      onDrop={onDrop}
    >
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <img src="/jsoncanvas-logo.svg" alt="JSON Canvas Logo" className="w-16 h-16" />
          <label
            htmlFor="file-upload"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Upload a file</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept=".json,.json5,.canvas"
              onChange={onFileUpload}
            />
          </label>
          <p className="text-zinc-600">or drag and drop</p>
          <p className="text-sm text-zinc-500">JSON Canvas JSON and JSON5 files</p>
        </div>
      </div>
    </div>
  )
} 