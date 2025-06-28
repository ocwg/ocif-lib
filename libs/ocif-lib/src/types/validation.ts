export interface ValidationIssue {
  severity: "error" | "warning" | "info";
  message: string;
  path: string;
}

export interface ValidationResult {
  status: "valid" | "invalid";
  issues: ValidationIssue[];
}
