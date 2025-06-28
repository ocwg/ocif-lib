// CanvasColor can be a hex string or a number from "1" to "6"
export type CanvasColor = `#${string}` | "1" | "2" | "3" | "4" | "5" | "6";

// Base node type shared by all node variants
export interface NodeBase {
  id: string;
  type: "text" | "file" | "link" | "group" | "nested-canvas";
  x: number;
  y: number;
  width: number;
  height: number;
  color?: CanvasColor;
}

// Node for plain text content (Markdown allowed)
export interface TextNode extends NodeBase {
  type: "text";
  text: string;
}

// Node linking to a file in the system
export interface FileNode extends NodeBase {
  type: "file";
  file: string;
  subpath?: string; // Must start with `#` if used
}

// Node linking to an external URL
export interface LinkNode extends NodeBase {
  type: "link";
  url: string;
}

// Node representing a visual group container
export interface GroupNode extends NodeBase {
  type: "group";
  label?: string;
  background?: string;
  backgroundStyle?: "cover" | "ratio" | "repeat";
}

export interface CanvasNode extends NodeBase {
  type: "nested-canvas";
  title?: string;
  canvas: JsonCanvas;
}

// Union of all node types
export type Node = TextNode | FileNode | LinkNode | GroupNode | CanvasNode;

// Edge connecting two nodes with optional styles and labels
export interface Edge {
  id: string;
  fromNode: string;
  fromSide?: "top" | "right" | "bottom" | "left";
  fromEnd?: "none" | "arrow"; // Defaults to none
  toNode: string;
  toSide?: "top" | "right" | "bottom" | "left";
  toEnd?: "none" | "arrow"; // Defaults to arrow
  color?: CanvasColor;
  label?: string;
}

// Main canvas structure
export interface JsonCanvas {
  nodes?: Node[];
  edges?: Edge[];
}
