import type { ValidationError } from '../../types/ocif';

interface ValidationErrorItemProps {
  error: ValidationError;
}

export function ValidationErrorItem({ error }: ValidationErrorItemProps) {
  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <span className="text-rose-500 mt-1 flex-shrink-0">•</span>
        <div className="flex-1 min-w-0">
          <p className="text-rose-700 font-medium flex flex-wrap gap-2 items-baseline">
            <span>Error at {error.path}</span>
            <span className="text-zinc-600 font-normal text-sm">
              (line {error.line}, column {error.column})
            </span>
          </p>
          {error.context && (
            <pre className="mt-2 p-2 bg-white/50 border border-rose-200 rounded-lg text-sm font-mono text-zinc-700 whitespace-pre-wrap break-all max-h-[6.5rem] overflow-y-auto">
              {error.context}
            </pre>
          )}
          <p className="text-rose-600 mt-2 break-words">{error.message}</p>
          {error.details && (
            <p className="text-zinc-600 text-sm mt-1 break-words">{error.details}</p>
          )}
        </div>
      </div>
    </li>
  );
} 