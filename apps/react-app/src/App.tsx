import { useState, useCallback } from 'react';
import JSON5 from 'json5';
import { OCIFJson, ValidationError } from '@ocif/lib';
import { validateJson } from './services/validation-service';
import { generateSVG } from './services/svg-service';
import { generateTldrawJson } from './services/tldraw-service';
import { JsonCanvasService } from './services/jsoncanvas-service';
import { Layout } from './components/templates/Layout';
import { FileDropZone } from './components/molecules/FileDropZone';
import { ValidationResult } from './components/molecules/ValidationResult';
import { ExportButton } from './components/molecules/ExportButton';
import { TldrawExportButton } from './components/molecules/TldrawExportButton';
import { JsonCanvasExportButton } from './components/molecules/JsonCanvasExportButton';

function App() {
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors?: ValidationError[];
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentJson, setCurrentJson] = useState<OCIFJson | null>(null);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        let json;

        try {
          // First try standard JSON parse
          json = JSON.parse(text);
        } catch {
          try {
            // If standard JSON fails, try JSON5
            json = JSON5.parse(text);
          } catch {
            throw new Error('Invalid JSON/JSON5 format');
          }
        }

        setCurrentJson(json);
        setValidationResult(validateJson(json, text));
      } catch {
        setCurrentJson(null);
        setValidationResult({
          isValid: false,
          errors: [
            {
              path: '/',
              message: 'Invalid JSON/JSON5 format',
              line: 1,
              column: 1,
              details: 'The file contains invalid JSON/JSON5 syntax',
            },
          ],
        });
      }
    },
    []
  );

  const handleExport = useCallback(() => {
    if (!currentJson || !validationResult?.isValid) return;

    // Create SVG content based on OCIF data
    const svgContent = generateSVG(currentJson);

    // Create blob and download
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ocif-export.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentJson, validationResult]);

  const handleTldrawExport = useCallback(() => {
    if (!currentJson || !validationResult?.isValid) return;

    // Create tldraw content based on OCIF data
    const tldrawContent = generateTldrawJson(currentJson);

    // Create blob and download
    const blob = new Blob([tldrawContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ocif-export.tldr.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentJson, validationResult]);

  const handleJsonCanvasExport = useCallback(() => {
    if (!currentJson || !validationResult?.isValid) return;

    // Export the OCIF file to JSONCanvas format
    JsonCanvasService.exportToJsonCanvas(currentJson);
  }, [currentJson, validationResult]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (
        file &&
        (file.type === 'application/json' ||
          file.name.toLowerCase().endsWith('.json') ||
          file.name.toLowerCase().endsWith('.json5'))
      ) {
        const input = document.getElementById(
          'file-upload'
        ) as HTMLInputElement;
        if (input) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          input.files = dataTransfer.files;
          const event = new Event('change', {
            bubbles: true,
          }) as unknown as React.ChangeEvent<HTMLInputElement>;
          Object.defineProperty(event, 'target', { value: input });
          handleFileUpload(event);
        }
      }
    },
    [handleFileUpload]
  );

  return (
    <Layout>
      <div className="mt-8">
        <FileDropZone
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileUpload={handleFileUpload}
        />
      </div>

      {validationResult && (
        <ValidationResult
          isValid={validationResult.isValid}
          errors={validationResult.errors}
        />
      )}

      {validationResult?.isValid && (
        <div className="mt-8 flex justify-center gap-4">
          <ExportButton
            onExport={handleExport}
            disabled={!currentJson || !validationResult?.isValid}
            variant="subtle"
          />
          <TldrawExportButton
            onExport={handleTldrawExport}
            disabled={!currentJson || !validationResult?.isValid}
            variant="subtle"
          />
          <JsonCanvasExportButton
            onExport={handleJsonCanvasExport}
            disabled={!currentJson || !validationResult?.isValid}
            variant="subtle"
          />
        </div>
      )}
    </Layout>
  );
}

export default App;
