import { ValidationService } from './validation-service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Ajv2020 from 'ajv/dist/2020';
import JSON5 from 'json5';

// Mock dependencies
vi.mock('ajv/dist/2020');
vi.mock('json5');
vi.mock('../schema/schema', async () => {
  return {
    ocifCoreSchema: { type: 'object', properties: {} },
  };
});

describe('ValidationService', () => {
  let validationService: ValidationService;
  let mockValidate: vi.Mock;

  beforeEach(() => {
    mockValidate = vi.fn();
    // Mock Ajv2020 implementation
    (Ajv2020 as unknown as vi.Mock).mockImplementation(() => ({
      compile: () => mockValidate,
    }));

    validationService = new ValidationService();
  });

  describe('validateFile', () => {
    it('should return isValid: true when validation passes', async () => {
      // Arrange
      mockValidate.mockReturnValue(true);
      const mockFile = new File(['{"test": "valid"}'], 'test.json');

      // Act
      const result = await validationService.validateFile(mockFile);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should return validation errors when validation fails', async () => {
      // Arrange
      mockValidate.mockReturnValue(false);
      mockValidate.errors = [
        {
          instancePath: '/test',
          message: 'Error message',
          keyword: 'type',
          params: { type: 'string' },
        },
      ];
      const mockFile = new File(['{"test": 123}'], 'test.json');

      // Act
      const result = await validationService.validateFile(mockFile);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors![0].path).toBe('/test');
      expect(result.errors![0].message).toBe('Error message');
      expect(result.errors![0].details).toBe('Expected type: string');
    });

    it('should handle invalid JSON format', async () => {
      // Arrange
      const mockFile = new File(['invalid json'], 'test.json');
      vi.spyOn(JSON, 'parse').mockImplementation(() => {
        throw new Error();
      });
      vi.spyOn(JSON5, 'parse').mockImplementation(() => {
        throw new Error();
      });

      // Act
      const result = await validationService.validateFile(mockFile);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors![0].message).toBe('Invalid JSON/JSON5 format');
      expect(result.errors![0].details).toBe(
        'The file contains invalid JSON/JSON5 syntax'
      );
    });

    it('should try parsing with JSON5 when standard JSON fails', async () => {
      // Arrange
      mockValidate.mockReturnValue(true);
      const mockFile = new File(['{"test": value}'], 'test.json'); // Invalid JSON but valid JSON5
      vi.spyOn(JSON, 'parse').mockImplementation(() => {
        throw new Error();
      });
      vi.spyOn(JSON5, 'parse').mockReturnValue({ test: 'value' });

      // Act
      const result = await validationService.validateFile(mockFile);

      // Assert
      expect(result.isValid).toBe(true);
    });
  });

  describe('getSchemaDetails', () => {
    it('should format type error correctly', () => {
      // Arrange
      const error = {
        keyword: 'type',
        params: { type: 'string' },
        message: 'must be string',
      };

      // Act
      const result = (validationService as any).getSchemaDetails(error);

      // Assert
      expect(result).toBe('Expected type: string');
    });

    it('should format enum error correctly', () => {
      // Arrange
      const error = {
        keyword: 'enum',
        params: { allowedValues: ['one', 'two'] },
        message: 'must be equal to one of the allowed values',
      };

      // Act
      const result = (validationService as any).getSchemaDetails(error);

      // Assert
      expect(result).toBe('Allowed values: one, two');
    });
  });
});
