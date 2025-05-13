# ocif-tools Phased Implementation Plan

## Guiding Principles for Development

- **Test-Driven Development (TDD):** For each new piece of functionality (especially in ocif-lib), tests will be written _before_ the implementation. This ensures clarity on requirements and verifiable correctness.
- **Incremental Builds:** Each phase builds upon the previous, creating usable and testable software at each step.
- **Focus on OCIF v0.4:** All development will strictly adhere to the provided OCIF v0.4 specification.
- **Separate Library and CLI Development:** While interdependent, treat ocif-lib and ocif-cli as distinct development efforts within their phases, with the library generally preceding CLI features that depend on it.

## Development Plan: OCIF Utilities

### Phase 0: Project Foundation & ocif-lib Scaffolding

- **Goal:** Set up the development environment, monorepo structure, and define the core data structures for OCIF v0.4 in ocif-lib.
- **Tasks:**
  1. **Monorepo Setup:**
     - Initialize project directory with Git.
     - Set up npm/yarn/pnpm workspaces.
     - Create packages/ocif-lib and packages/ocif-cli.
     - Root package.json with workspace configuration and shared dev dependencies (TypeScript, ESLint, Prettier, Jest/Vitest).
  2. **ocif-lib Initial Setup:**
     - package.json specific to ocif-lib.
     - tsconfig.json for ocif-lib (extending a base tsconfig.base.json).
     - Set up testing framework (e.g., Jest or Vitest) within ocif-lib.
     - **Implement ocif-lib/src/types.ts:** Define all TypeScript interfaces and enums based on the OCIF v0.4 spec (e.g., OCIFData, RootMetadata, Canvas, CanvasMetadata, BaseElement, all specific Element types like RectangleElement, ImageElement, etc., ElementType enum, ISO8601Timestamp, ColorHex).
     - **Implement ocif-lib/src/constants.ts:** Define OCIF_VERSION \= "0.4" and potentially an array of ElementType values for easier iteration if needed.
  3. **Tooling & CI:**
     - Configure ESLint and Prettier for code consistency.
     - Set up basic Continuous Integration (e.g., GitHub Actions) to run linting and (initially empty) tests.
- **Testing Strategy for Phase 0:**
  - No functional tests yet, but ensure the project structure compiles.
  - CI setup will verify tooling.
  - The primary deliverable, types.ts, will be validated by its usage in subsequent phases.
- **Deliverables:**
  - Initialized monorepo with configured tooling.
  - ocif-lib package with complete types.ts and constants.ts reflecting OCIF v0.4.
  - Basic CI pipeline.

### Phase 1: ocif-lib \- Core OCIF v0.4 Validation (TDD)

- **Goal:** Implement a robust OCIF v0.4 validator within ocif-lib, driven by a comprehensive test suite.
- **Tasks:**
  1. **Test Data Preparation:**
     - Create a ocif-lib/test/fixtures/validation/ directory.
     - **Valid Samples:** Develop 2-3 small but complete, valid OCIF v0.4 JSON files.
     - **Invalid Unitary Samples:** Create numerous small OCIF JSON snippets, each designed to fail a _specific_ validation rule (e.g., missing version, incorrect version, invalid timestamp format in metadata.created_at, canvas.elements\[0\].width as a string, image element missing url and data, unknown element type, etc.).
     - **Invalid Complex Samples:** Create 1-2 larger OCIF JSON files with multiple, varied errors.
     - _(Self-correction: "Robust inputs from many different libraries" should be interpreted as crafting OCIF files that represent potential conversion targets, then introducing errors into those OCIF files to test the validator's strictness against the spec, not testing non-OCIF files with the OCIF validator directly)._
  2. **Implement ocif-lib/src/validator.ts (TDD):**
     - Define the validate(data: OCIFData | object): Promise\<{ isValid: boolean; errors: Array\<...\>; warnings: Array\<...\> }\> function signature.
     - Iteratively implement validation logic:
       - **Test First:** For each rule (e.g., "Root object must have 'version' property equal to '0.4'"):
         - Write a test using a valid snippet that passes this rule.
         - Write a test using an invalid snippet that fails this rule, asserting the expected error path and message.
       - **Implement Rule:** Write the validation code to make the tests pass.
       - **Refactor:** Clean up code if necessary.
     - **Validation Coverage (based on OCIF v0.4 spec):**
       - Root object structure (version, metadata, canvases).
       - RootMetadata and CanvasMetadata fields and types.
       - Canvas structure and id uniqueness (within the file).
       - BaseElement properties: presence, types, constraints (e.g., width/height non-negative).
       - Element.id uniqueness within its canvas.
       - Element.type against ElementType enum.
       - All type-specific properties for each ElementType (e.g., text.text presence, image requiring url or data, line.points having at least two entries, etc.).
       - Data format validations (ISO 8601 timestamps, color formats if specified, opacity range).
       - custom_data structure (must be an object if present).
- **Testing Strategy for Phase 1:**
  - Heavy use of Jest/Vitest's describe, it, expect.
  - Test suites organized by OCIF object type (root, metadata, canvas, specific elements).
  - Ensure error objects contain accurate path and message properties.
- **Deliverables:**
  - A thoroughly tested validator.ts module in ocif-lib.
  - A comprehensive suite of validation test cases and fixture files.
  - CI pipeline successfully running all validation tests.

### Phase 2: ocif-lib \- OCIF v0.4 Parser (TDD)

- **Goal:** Implement a parser that safely converts an OCIF v0.4 JSON string into a typed JavaScript object.
- **Tasks:**
  1. **Test Data Preparation (ocif-lib/test/fixtures/parsing/):**
     - Use valid OCIF JSON strings (can reuse from validation fixtures).
     - Create malformed JSON strings.
     - Create valid JSON strings that are _not_ OCIF structures (e.g., \[\], {"foo": "bar"}).
  2. **Implement ocif-lib/src/parser.ts (TDD):**
     - Define parse(ocifFileContent: string): Promise\<OCIFData\> function signature.
     - **Test First:**
       - Test parsing of valid OCIF string to OCIFData object.
       - Test parsing of malformed JSON (expect specific JSON parse error).
       - Test parsing of valid JSON that isn't structurally OCIF (expect a meaningful error, e.g., "Not an OCIF object: 'version' property missing"). _The parser can do a light structural check before handing off to the more comprehensive validator._
     - **Implement:** Use JSON.parse() and add light initial checks (e.g., presence of version).
- **Testing Strategy for Phase 2:**
  - Focus on successful parsing and graceful error handling for invalid JSON.
- **Deliverables:**
  - A tested parser.ts module in ocif-lib.
  - Parser test suite and fixtures.

### Phase 3: ocif-cli \- Setup & validate Command (TDD)

- **Goal:** Create the basic CLI application and implement the validate command, using the ocif-lib.
- **Tasks:**
  1. **ocif-cli Initial Setup:**
     - package.json for ocif-cli (dependencies on ocif-lib, CLI argument parser like yargs or commander).
     - tsconfig.json for ocif-cli.
     - CLI entry point (src/index.ts) with shebang \#\!/usr/bin/env node.
     - Configure bin in package.json to expose the ocif command.
     - Setup testing for CLI (integration style, e.g., using execa to run compiled CLI commands and check stdout, stderr, exit codes).
  2. **Implement ocif validate \<file_path_or_glob...\> command (TDD):**
     - Define command structure using the chosen CLI framework.
     - **Test First (CLI integration tests):**
       - Test ocif validate valid_file.ocif (expect success message, exit code 0).
       - Test ocif validate invalid_file.ocif (expect detailed error messages from ocif-lib\#validate, exit code 1).
       - Test with multiple files (glob pattern, mix of valid/invalid).
       - Test with non-existent file (expect CLI error message).
       - Test output format for clarity.
     - **Implement:**
       - Logic to parse arguments and resolve file paths/globs.
       - For each file: read content, call ocifLib.parse(), then ocifLib.validate().
       - Format and print results to console.
       - Set process exit code based on validation outcomes.
- **Testing Strategy for Phase 3:**
  - Focus on CLI behavior: argument parsing, file handling, correct invocation of ocif-lib, console output, and exit codes.
  - Use fixture files from ocif-lib's validation tests as input for CLI tests.
- **Deliverables:**
  - ocif-cli package with a working validate command.
  - CLI test suite for the validate command.

### Phase 4: ocif-lib \- Initial Converters (e.g., TLDraw to OCIF, OCIF to SVG) (TDD)

- **Goal:** Implement core conversion functionalities in ocif-lib.
- **Tasks (repeated for each converter, e.g., TLDraw to OCIF):**
  1. **Research & Understand Source Format:** Deeply understand the structure of the source format (e.g., TLDraw's JSON).
  2. **Test Data Preparation (ocif-lib/test/fixtures/conversion/tldraw_to_ocif/):**
     - Gather diverse sample files from the source format (e.g., various TLDraw files with different elements, properties).
     - For each source sample, manually create the _expected_ OCIF v0.4 JSON output. This is critical for TDD.
  3. **Implement Converter Logic (e.g., converters/tldrawToOcif.ts) (TDD):**
     - Define the main conversion function (e.g., tldrawToOcif(tldrawJson: object): Promise\<OCIFData\>).
     - **Test First:** For each distinct element or feature in TLDraw:
       - Write a test using a small TLDraw snippet.
       - Assert that the converter produces the expected OCIF element(s) structure.
     - **Implement:** Write mapping logic from TLDraw properties to OCIF v0.4 properties. Ensure generated OCIF data conforms to OCIFData types.
     - **Self-Validate Output:** Internally, after generating the OCIF object, run it through ocifLib.validate() within the tests to ensure the converter produces valid OCIF.
  4. **Implement OCIF to SVG Converter:**
     - Similar process: define OCIF input samples, manually determine expected SVG snippets/structure (SVG testing can be complex; might involve snapshot testing or checking for key element presence and attributes).
- **Testing Strategy for Phase 4:**
  - Unit tests for each transformation rule within a converter.
  - Ensure outputs are valid OCIF v0.4 (for toOcif converters) by re-using the validate function.
  - For ocifToSvg, tests might check for the presence of specific SVG tags, correct attributes, or use snapshot testing for visual stability.
- **Deliverables:**
  - Tested converter modules within ocif-lib (e.g., tldrawToOcif.ts, ocifToSvg.ts).
  - Comprehensive test suites and fixture files for each converter.

### Phase 5: ocif-cli \- convert Command (TDD)

- **Goal:** Implement the convert command in the CLI, utilizing the converters from ocif-lib.
- **Tasks:**
  1. **Implement ocif convert \<input_file\> \--to \<target_format\> \[...\] command (TDD):**
     - Define command structure, including options: \--from, \--to, \-o/--output.
     - **Test First (CLI integration tests):**
       - Test ocif convert input.tldr \--to ocif \-o output.ocif.
       - Test ocif convert input.ocif \--to svg (default output naming).
       - Test various combinations of options (format inference for \--from, output to directory).
       - Test error handling (unsupported format, file I/O errors).
     - **Implement:**
       - Argument parsing and validation.
       - File reading.
       - Logic to select and call the appropriate ocifLib.convert function (or specific converter).
       - Output file path determination and writing.
       - User feedback messages.
- **Testing Strategy for Phase 5:**
  - CLI integration tests covering various conversion scenarios, options, and error conditions.
  - Use fixture files from ocif-lib converter tests as inputs.
- **Deliverables:**
  - Working convert command in ocif-cli.
  - CLI test suite for the convert command.

### Phase 6: ocif-cli \- help Command & Polish

- **Goal:** Ensure the CLI is user-friendly with good help messages and overall polish.
- **Tasks:**
  1. **Implement/Refine ocif help \[command\]:**
     - Ensure chosen CLI framework generates helpful and accurate messages for ocif help, ocif validate \--help, ocif convert \--help.
  2. **Review CLI UX:**
     - Check all console outputs for clarity, consistency, and usefulness.
     - Error message review.
  3. **Code Cleanup:** General refactoring in both libraries.
- **Testing Strategy for Phase 6:**
  - Manual testing of help commands.
  - Automated tests for help output (if supported by CLI framework).
- **Deliverables:**
  - Polished CLI with comprehensive help messages.

### Phase 7: Documentation, Packaging & Release

- **Goal:** Prepare comprehensive documentation and package the libraries for NPM release.
- **Tasks:**
  1. **Documentation:**
     - **Root README.md:** Project overview, installation, quick start for CLI, contribution guidelines.
     - **packages/ocif-lib/README.md:** Detailed API documentation (how to use parse, validate, convert), exported types, examples. Consider using TSDoc/TypeDoc to generate HTML API docs.
     - **packages/ocif-cli/README.md:** Detailed usage for each command, all options explained, examples.
  2. **Packaging:**
     - Finalize package.json files for both packages (versioning \- start with e.g., 0.1.0, author, license, keywords, repository link, files array for included files).
     - Add build scripts to transpile TypeScript and prepare packages for publishing.
  3. **Pre-Release Testing:**
     - Install packages locally from tarballs (npm pack) to simulate user installation.
     - Perform final manual smoke tests.
  4. **Release:**
     - Publish ocif-lib and ocif-cli to NPM.
     - Tag the release in Git.
- **Testing Strategy for Phase 7:**
  - Manual testing of documentation for clarity and accuracy.
  - Testing the local installation and basic functionality of the packed NPM packages.
- **Deliverables:**
  - Comprehensive documentation.
  - Versioned ocif-lib and ocif-cli packages published on NPM.
