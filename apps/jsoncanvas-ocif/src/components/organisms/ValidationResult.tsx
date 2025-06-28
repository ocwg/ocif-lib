import type { ValidationError } from '@ocif/lib';
import { ValidationErrorItem } from '../molecules/ValidationErrorItem';

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
          <svg
            className="w-8 h-8 text-teal-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-8 h-8 text-rose-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
        <h3
          className={`text-xl font-semibold ${
            isValid ? 'text-teal-800' : 'text-rose-800'
          }`}
        >
          {isValid ? 'Validation Successful!' : 'Validation Failed'}
        </h3>
      </div>
      {errors && errors.length > 0 && (
        <ul className="space-y-4 mt-6">
          {errors.map((error: ValidationError, index: number) => (
            <ValidationErrorItem key={index} error={error} />
          ))}
        </ul>
      )}
    </div>
  );
}
