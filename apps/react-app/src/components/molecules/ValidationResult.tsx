import type { ValidationError } from '../../types/ocif'

interface ValidationResultProps {
  isValid: boolean;
  errors?: ValidationError[];
}

export function ValidationResult({ isValid, errors }: ValidationResultProps) {
  return (
    <div 
      className={`mt-8 p-8 rounded-2xl transition-all duration-300 transform animate-slide-in ${
        isValid 
          ? 'bg-teal-50 border border-teal-200' 
          : 'bg-rose-50 border border-rose-200'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        {isValid ? (
          <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <h3 className={`text-xl font-semibold ${
          isValid 
            ? 'text-teal-800' 
            : 'text-rose-800'
        }`}>
          {isValid 
            ? 'Validation Successful!' 
            : 'Validation Failed'}
        </h3>
      </div>
      {errors && (
        <ul className="space-y-4 mt-6">
          {errors.map((error, index) => (
            <li key={index} className="flex flex-col gap-1">
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
          ))}
        </ul>
      )}
    </div>
  )
} 