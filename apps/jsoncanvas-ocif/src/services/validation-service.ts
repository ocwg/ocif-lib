import { ErrorObject } from 'ajv';
import Ajv2020 from 'ajv/dist/2020';
import JSON5 from 'json5';
import { jsonCanvasSchema } from '../jsoncanvas-schema/schema';
import { JsonCanvas } from '../types/jsoncanvas';

export interface ValidationError {
  path: string;
  message: string;
  line: number;
  column: number;
  details?: string;
  context?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: ValidationError[];
  jsonCanvas?: JsonCanvas;
}

export class ValidationService {
  private readonly ajv: Ajv2020;
  private readonly validate: ReturnType<Ajv2020['compile']>;

  constructor() {
    this.ajv = new Ajv2020({ allErrors: true, verbose: true });
    this.validate = this.ajv.compile<JsonCanvas>(jsonCanvasSchema);
  }

  private getSchemaDetails(error: ErrorObject): string {
    switch (error.keyword) {
      case 'type':
        return `Expected type: ${error.params.type}`;
      case 'enum':
        return `Allowed values: ${(error.params.allowedValues as string[]).join(
          ', '
        )}`;
      case 'required':
        return `Required property missing: ${error.params.missingProperty}`;
      case 'pattern':
        return `Should match pattern: ${error.params.pattern}`;
      case 'format':
        return `Should match format: ${error.params.format}`;
      case 'const':
        return `Expected value: ${JSON.stringify(error.params.allowedValue)}`;
      case 'minimum':
      case 'maximum':
      case 'minLength':
      case 'maxLength':
        return `${error.message} (${JSON.stringify(error.params)})`;
      default:
        if (error.message?.startsWith('must be equal to constant')) {
          return '';
        }
        return error.message || '';
    }
  }

  private findLineColumn(
    jsonString: string,
    path: string
  ): { line: number; column: number } {
    const lines = jsonString.split('\n');
    const currentPath: string[] = [];
    let inString = false;
    let escapeNext = false;
    let currentKey = '';
    let collectingKey = false;

    for (let line = 0; line < lines.length; line++) {
      const lineContent = lines[line];
      for (let col = 0; col < lineContent.length; col++) {
        const char = lineContent[col];

        if (escapeNext) {
          escapeNext = false;
          continue;
        }

        if (char === '\\') {
          escapeNext = true;
          continue;
        }

        if (char === '"' && !escapeNext) {
          inString = !inString;
          if (!inString && collectingKey) {
            collectingKey = false;
            currentPath.push(currentKey);
            currentKey = '';
          }
          continue;
        }

        if (inString) {
          if (collectingKey) {
            currentKey += char;
          }
          continue;
        }

        if (char === ':') {
          collectingKey = false;
          continue;
        }

        if (char === '{' || char === '[') {
          if (char === '{') {
            collectingKey = true;
          }
          continue;
        }

        if (char === '}' || char === ']' || char === ',') {
          if (currentPath.length > 0) {
            currentPath.pop();
          }
          if (char === ',') {
            collectingKey = true;
          }
          continue;
        }

        const currentPathStr = '/' + currentPath.join('/');
        if (currentPathStr === path) {
          // Look ahead to find the actual value position
          const restOfLine = lineContent.slice(col);
          const valueMatch = restOfLine.match(/:\s*"?([^"]*)"?/);
          if (valueMatch) {
            const valueStart =
              col + valueMatch.index! + valueMatch[0].indexOf(valueMatch[1]);
            return { line: line + 1, column: valueStart + 1 };
          }
          return { line: line + 1, column: col + 1 };
        }
      }
    }

    return { line: 1, column: 1 };
  }

  private parseJSON(text: string): unknown {
    try {
      // First try standard JSON parse
      return JSON.parse(text);
    } catch {
      try {
        // If standard JSON fails, try JSON5
        return JSON5.parse(text);
      } catch {
        throw new Error('Invalid JSON/JSON5 format');
      }
    }
  }

  public async validateFile(file: File): Promise<ValidationResult> {
    try {
      const text = await file.text();
      const json = this.parseJSON(text);
      const isValid = this.validate(json);

      if (!isValid && this.validate.errors) {
        const errors: ValidationError[] = this.validate.errors.map((error) => {
          const path = error.instancePath || '/';
          const { line, column } = this.findLineColumn(text, path);

          // Get context from the file
          const lines = text.split('\n');
          const contextLine = lines[line - 1] || '';
          const context = contextLine.trim();

          return {
            path: path === '' ? '/' : path,
            message: error.message || 'Unknown error',
            line,
            column,
            details: this.getSchemaDetails(error),
            context,
          };
        });

        return {
          isValid: false,
          errors,
        };
      }

      return {
        isValid: true,
        jsonCanvas: json as JsonCanvas,
      };
    } catch {
      return {
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
      };
    }
  }
}

// Create a singleton instance
const validationService = new ValidationService();

// Export the validation function that matches the interface expected by App.tsx
export function validateJson(
  json: unknown,
  jsonString: string
): ValidationResult {
  const isValid = validationService['validate'](json);

  if (!isValid && validationService['validate'].errors) {
    const errors: ValidationError[] = validationService['validate'].errors.map(
      (error) => {
        const path = error.instancePath || '/';
        const { line, column } = validationService['findLineColumn'](
          jsonString,
          path
        );

        // Get context from the file
        const lines = jsonString.split('\n');
        const contextLine = lines[line - 1] || '';
        const context = contextLine.trim();

        return {
          path: path === '' ? '/' : path,
          message: error.message || 'Unknown error',
          line,
          column,
          details: validationService['getSchemaDetails'](error),
          context,
        };
      }
    );

    return {
      isValid: false,
      errors,
    };
  }

  return {
    isValid: true,
    jsonCanvas: json as JsonCanvas,
  };
}
