import { IconButton } from '../atoms/IconButton';

interface ExportButtonProps {
  onExport: () => void;
  disabled?: boolean;
  variant?: 'default' | 'subtle';
}

export function ExportButton({ onExport, disabled = false, variant = 'default' }: ExportButtonProps) {
  return (
    <IconButton
      onClick={onExport}
      disabled={disabled}
      variant={variant}
      icon={
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      }
    >
      Export SVG
    </IconButton>
  );
} 