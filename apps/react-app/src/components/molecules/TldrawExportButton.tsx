import { IconButton } from '../atoms/IconButton';

interface TldrawExportButtonProps {
  onExport: () => void;
  disabled?: boolean;
  variant?: 'default' | 'subtle';
}

export function TldrawExportButton({ onExport, disabled = false, variant = 'default' }: TldrawExportButtonProps) {
  return (
    <IconButton
      onClick={onExport}
      disabled={disabled}
      variant={variant}
      icon={
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      }
    >
      Export tldraw
    </IconButton>
  );
} 