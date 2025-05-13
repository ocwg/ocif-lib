# Project: OCIF Utilities

## 1. Overview

The OCIF Utilities project will establish a mono-repo containing a comprehensive suite of tools for working with the Open Canvas Interchange Format (OCIF) **version 0.4**. OCIF is a file format designed to ensure interoperability and data exchange across diverse infinite canvas applications. This initiative will deliver a core TypeScript library and a companion command-line interface (CLI), both distributable via NPM. These tools will enable users and developers to parse, validate, and convert OCIF files, as well as transform other common canvas file formats into OCIF and vice-versa, all while adhering to the OCIF v0.4 specification.

## 2\. Goals

- **Develop a Core TypeScript Library (ocif-lib):**

  - Publishable on NPM for easy integration into other projects.
  - Provide programmatic access to OCIF v0.4 functionalities:
    - **Parsing:** Convert OCIF v0.4 file content into a structured, typed JavaScript object.
    - **Validation:** Verify OCIF files against the OCIF v0.4 specification, offering detailed and actionable error/warning messages that pinpoint deviations from the spec.
    - **Conversion:** Transform data between OCIF v0.4 and other formats (e.g., TLDraw to OCIF, OCIF to SVG).

- **Create a Command-Line Interface (ocif-cli):**

  - Publishable on NPM for global installation and ease of use.
  - Utilize the ocif-lib for its underlying logic.
  - Offer intuitive commands for:
    - Validating OCIF v0.4 files.
    - Converting files between supported formats (with OCIF v0.4 as a primary target/source).
    - Displaying help and usage information.

- **Prioritize Simplicity and Maintainability:** Start with the simplest viable product and evolve as needed, avoiding premature optimization or over-engineering.
- **User Experience:** Ensure clear, helpful error messages and straightforward command structures for both the library and CLI, with validation messages directly referencing OCIF v0.4 specification details.

## 3\. Repository Structure (Initial Proposal)

(No changes from the previous version of this section, but the contents of ocif-lib/src/ will be more spec-aware.)

`ocif-utilities/`
`├── packages/`
`│   ├── ocif-lib/       # Core TypeScript library`
`│   │   ├── src/`
`│   │   │   ├── index.ts          # Main library exports`
`│   │   │   ├── parser.ts         # OCIF parsing logic`  
`│   │   │   ├── validator.ts      # OCIF validation logic`  
`│   │   │   ├── converters/       # Directory for format conversion modules`  
`│   │   │   │   ├── tldrawToOcif.ts`  
`│   │   │   │   └── ocifToSvg.ts`  
`│   │   │   ├── types.ts          # TypeScript type definitions for OCIF v0.4`  
`│   │   │   └── constants.ts      # Constants from the spec (e.g., VERSION, element types)`  
`│   │   ├── package.json`  
`│   │   └── tsconfig.json`  
`│   └── ocif-cli/       # Command-line interface`  
`│       ├── src/`  
`│       │   ├── index.ts          # CLI entry point (registers commands)`  
`│       │   ├── commands/         # Directory for CLI command handlers`  
`│       │   │   ├── validate.ts`  
`│       │   │   ├── convert.ts`  
`│       │   │   └── help.ts       # (Potentially integrated into a CLI framework)`  
`│       │   └── utils/            # Utility functions for the CLI`  
`│       ├── package.json`  
`│       └── tsconfig.json`  
`├── .gitignore`  
`├── package.json        # Root package.json (for workspace config, dev dependencies)`  
`├── tsconfig.base.json  # Shared TypeScript configuration`  
`└── README.md           # Project overview, setup, usage, contribution guidelines`

## 4\. Core Library: ocif-lib

- **Language:** TypeScript
- **Distribution:** NPM Package (e.g., @ocif/lib or ocif-lib)
- **Key Exports & Functionality:**

  - **OCIF_VERSION \= "0.4" (from constants.ts)**
  - **Type Definitions (types.ts):**

    - These will be crucial and directly derived from the OCIF v0.4 spec. Example structure:  
      `// In packages/ocif-lib/src/types.ts`

      `export type ISO8601Timestamp = string;`  
      `export type ColorHex = string; // Or a more specific type if validation is added`

      `export interface CustomData {`  
       `[key: string]: any;`  
      `}`

      `export interface RootMetadata {`  
       `created_at: ISO8601Timestamp;`  
       `updated_at: ISO8601Timestamp;`  
       `custom_data?: CustomData;`  
      `}`

      `export interface CanvasMetadata {`  
       `name?: string;`  
       `created_at: ISO8601Timestamp;`  
       `updated_at: ISO8601Timestamp;`  
       `custom_data?: CustomData;`  
      `}`

      `export enum ElementType {`  
       `Rectangle = "rectangle",`  
       `Ellipse = "ellipse",`  
       `Text = "text",`  
       `Image = "image",`  
       `Line = "line",`  
       `Draw = "draw",`  
       `Group = "group",`  
       `Frame = "frame",`  
       `Embed = "embed",`  
       `StickyNote = "sticky_note",`  
       `Arrow = "arrow",`  
      `}`

      `export interface BaseElement {`  
       `id: string; // UUIDv4 recommended`  
       `type: ElementType;`  
       `created_at: ISO8601Timestamp;`  
       `updated_at: ISO8601Timestamp;`  
       `x: number;`  
       `y: number;`  
       `width: number; // Must be non-negative`  
       `height: number; // Must be non-negative`  
       `rotation: number; // In degrees`  
       `is_locked: boolean;`  
       `custom_data?: CustomData;`  
      `}`

      `// Specific Element Types extending BaseElement`  
      `export interface RectangleElement extends BaseElement {`  
       `type: ElementType.Rectangle;`  
       `fill_color?: ColorHex;`  
       `stroke_color?: ColorHex;`  
       `stroke_width?: number;`  
       `stroke_style?: "solid" | "dashed" | "dotted";`  
      `}`

      `export interface EllipseElement extends BaseElement {`  
       `type: ElementType.Ellipse;`  
       `fill_color?: ColorHex;`  
       `stroke_color?: ColorHex;`  
       `stroke_width?: number;`  
       `stroke_style?: "solid" | "dashed" | "dotted";`  
      `}`

      `export interface TextElement extends BaseElement {`  
       `type: ElementType.Text;`  
       `text: string;`  
       `font_family?: string;`  
       `font_size?: number;`  
       `text_align?: "left" | "center" | "right";`  
       `vertical_align?: "top" | "middle" | "bottom";`  
       `color?: ColorHex;`  
      `}`

      `export interface ImageElement extends BaseElement {`  
       `type: ElementType.Image;`  
       `url?: string;`  
       `data?: string; // Base64 encoded`  
       `mime_type?: string; // Required if data is present`  
       `opacity?: number; // 0.0 to 1.0`  
      `}`

      `export interface LineElement extends BaseElement {`  
       `type: ElementType.Line;`  
       `points: Array<[number, number]>; // At least two points`  
       `stroke_color?: ColorHex;`  
       `stroke_width?: number;`  
       `stroke_style?: "solid" | "dashed" | "dotted";`  
      `}`

      `// ... other element types (Draw, Group, Frame, Embed, StickyNote, Arrow)`

      `export interface Canvas {`  
       `id: string; // UUIDv4 recommended`  
       `elements: Array<BaseElement>; // Actually a union of all specific element types`  
       `metadata?: CanvasMetadata;`  
      `}`

      `export interface OCIFData {`  
       `version: "0.4";`  
       `metadata: RootMetadata;`  
       `canvases: Array<Canvas>;`  
      `}`

  - **parse(ocifFileContent: string): Promise\<OCIFData\>**
    - **Input:** The string content of an OCIF file.
    - **Output:** A Promise resolving to a JavaScript object typed as OCIFData.
    - **Process:** Will parse the JSON and perform initial structural checks. Deeper validation is deferred to the validate function.
    - **Errors:** Throws descriptive errors on JSON syntax or fundamental structural parsing failures (e.g., if version or canvases is missing).
  - **validate(data: OCIFData | object): Promise\<{ isValid: boolean; errors: Array\<{ path: string; message: string; code?: string }\>; warnings: Array\<{ path: string; message: string; code?: string }\> }\>**
    - **Input:** A JavaScript object, ideally typed as OCIFData (output from parse), or a generic object if validating untrusted data.
    - **Output:** A Promise resolving to an object containing:
      - isValid: Boolean.
      - errors: Array of error objects. Each error will include:
        - path: A string path to the field causing the error (e.g., canvases\[0\].elements\[2\].width, metadata.created_at).
        - message: Human-readable message explaining the error in context of the OCIF v0.4 spec (e.g., "Property 'width' must be a non-negative number.", "Element type 'my_custom_shape' is not a recognized OCIF element type.", "Image element 'img123' must have either a 'url' or a 'data' property.").
        - code (optional): A code referencing a specific part of the OCIF spec or an internal error type.
      - warnings: Similar structure for non-critical issues or best practice deviations.
    - **Validation Logic will check:**
      - Root object: version is "0.4", presence of metadata and canvases.
      - RootMetadata: created_at, updated_at are valid ISO 8601\.
      - Each Canvas: id presence, elements array, optional metadata structure.
      - Each Element in Canvas.elements:
        - Presence and correct types of id, type, created_at, updated_at, x, y, width, height (non-negative), rotation, is_locked.
        - type is one of the allowed ElementType enum values.
        - Type-specific properties:
          - rectangle/ellipse: valid fill_color, stroke_color, stroke_width, stroke_style.
          - text: presence of text string, valid font_family, font_size, text_align, vertical_align, color.
          - image: presence of url OR data; mime_type if data is present; opacity between 0.0 and 1.0.
          - line: points array has at least two coordinate pairs.
          - draw: points array structure.
          - group: element_ids is an array of strings.
          - frame: optional name, optional fill_color.
          - embed: presence of url.
          - sticky_note: presence of text, color.
          - arrow: presence of start_point, end_point.
        - custom_data is an object if present.
      - ID uniqueness (e.g., canvas IDs, element IDs within a canvas) could be a validation step.
  - **Conversion Functions (example signatures):**
    - **convert(options: { data: string | object; from: string; to: string }): Promise\<string\>**
      - (No change in signature, but implementation will be aware of OCIF v0.4 types when from or to is 'ocif').
      - When converting _to_ OCIF, the output string must be a valid OCIF v0.4 document. The internal representation before stringification should match OCIFData.
      - When converting _from_ OCIF, the input data (if an object) will be expected to conform to OCIFData.

- **Modularity:** Functions should be individually exportable. Types and constants (like ElementType enum and OCIF_VERSION) will also be exported.

## 5\. Command-Line Interface: ocif-cli

- **Language:** TypeScript (depends on ocif-lib)
- **Distribution:** NPM Package (e.g., ocif or @ocif/cli for global installation)
- **Main Executable:** ocif
- **Proposed Commands:**
  - **ocif help \[command\]** (No change)
  - **ocif validate \<file_path_or_glob...\>**
    - **Behavior:**
      - For each file, it will read the content, then call ocifLib.parse() followed by ocifLib.validate().
      - Error messages will leverage the detailed path and message from the validate function, making them highly specific (e.g., INVALID: my_canvas.ocif \- canvases\[0\].elements\[1\].type: Unknown element type 'circle'. Allowed types are: rectangle, ellipse, ...).
    - (Other details unchanged)
  - **ocif convert \<input_file\> \--to \<target_format\> \[output_options\]**
    - **Behavior:**
      - When \--to ocif is specified, the CLI will ensure the output is a valid OCIF v0.4 document.
      - When \--from ocif is specified, the CLI will parse and potentially validate the input OCIF file using ocif-lib before conversion.
    - (Other details unchanged)

## 6\. Development & Technical Details

- **Error Handling:** Validation errors from ocif-lib will be central to providing actionable feedback in the CLI.
- **Testing:**
  - **ocif-lib:**
    - Extensive unit tests for validator.ts covering all rules in the OCIF v0.4 spec (valid and invalid cases for each property and element type).
    - Unit tests for parser.ts for various valid and malformed OCIF strings.
    - Unit tests for each implemented converter.
    - Test with example OCIF v0.4 files.
  - **ocif-cli:** (No change)
- **Documentation:**
  - The ocif-lib API documentation should clearly reference OCIFData and other exported types from types.ts.
- (Other details unchanged)

## 7\. OCIF Specification Adherence

- The ocif-lib will be the canonical implementation for OCIF v0.4 parsing and validation within this project.
- All tools will explicitly target OCIF version "0.4" as defined in the provided specification.
- Future updates to the OCIF specification will require version bumps and corresponding updates to the library, types, and validation logic.
