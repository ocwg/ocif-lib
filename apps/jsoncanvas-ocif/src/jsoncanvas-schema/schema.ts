export const jsonCanvasSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://example.com/schemas/jsoncanvas.schema.json',
  title: 'JSON Canvas',
  type: 'object',
  properties: {
    nodes: {
      type: 'array',
      items: { $ref: '#/$defs/Node' },
    },
    edges: {
      type: 'array',
      items: { $ref: '#/$defs/Edge' },
    },
  },
  required: [],
  additionalProperties: false,

  $defs: {
    JsonCanvas: {
      type: 'object',
      properties: {
        nodes: { type: 'array', items: { $ref: '#/$defs/Node' } },
        edges: { type: 'array', items: { $ref: '#/$defs/Edge' } },
      },
      required: [],
    },
    CanvasColor: {
      type: 'string',
      description: 'Hex color (e.g., #FF0000) or preset color number (1–6)',
      pattern: '^#[0-9A-Fa-f]{6}$|^[1-6]$',
    },

    NodeBase: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: { type: 'string' },
        x: { type: 'number' },
        y: { type: 'number' },
        width: { type: 'integer' },
        height: { type: 'integer' },
        color: { $ref: '#/$defs/CanvasColor' },
      },
      required: ['id', 'type', 'x', 'y', 'width', 'height'],
    },

    TextNode: {
      allOf: [
        { $ref: '#/$defs/NodeBase' },
        {
          properties: {
            type: { const: 'text' },
            text: { type: 'string' },
            x: { type: 'number' },
            y: { type: 'number' },
            width: { type: 'integer' },
            height: { type: 'integer' },
          },
          required: ['text'],
        },
      ],
    },

    FileNode: {
      allOf: [
        { $ref: '#/$defs/NodeBase' },
        {
          properties: {
            type: { const: 'file' },
            file: { type: 'string' },
            subpath: {
              type: 'string',
              pattern: '^#.*',
            },
            x: { type: 'number' },
            y: { type: 'number' },
            width: { type: 'integer' },
            height: { type: 'integer' },
          },
          required: ['file'],
        },
      ],
    },

    LinkNode: {
      allOf: [
        { $ref: '#/$defs/NodeBase' },
        {
          properties: {
            type: { const: 'link' },
            url: { type: 'string' },
            x: { type: 'number' },
            y: { type: 'number' },
            width: { type: 'integer' },
            height: { type: 'integer' },
          },
          required: ['url'],
        },
      ],
    },

    GroupNode: {
      allOf: [
        { $ref: '#/$defs/NodeBase' },
        {
          properties: {
            type: { const: 'group' },
            label: { type: 'string' },
            background: { type: 'string' },
            backgroundStyle: {
              type: 'string',
              enum: ['cover', 'ratio', 'repeat'],
            },
            x: { type: 'number' },
            y: { type: 'number' },
            width: { type: 'integer' },
            height: { type: 'integer' },
          },
        },
      ],
    },

    CanvasNode: {
      allOf: [
        { $ref: '#/$defs/NodeBase' },
        {
          properties: {
            type: { const: 'nested-canvas' },
            canvas: { $ref: '#/$defs/JsonCanvas' },
            x: { type: 'number' },
            y: { type: 'number' },
            width: { type: 'integer' },
            height: { type: 'integer' },
            title: { type: 'string' },
          },
          required: ['canvas', 'title'],
        },
      ],
    },

    Node: {
      oneOf: [
        { $ref: '#/$defs/TextNode' },
        { $ref: '#/$defs/FileNode' },
        { $ref: '#/$defs/LinkNode' },
        { $ref: '#/$defs/GroupNode' },
        { $ref: '#/$defs/CanvasNode' },
      ],
    },

    Edge: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        fromNode: { type: 'string' },
        fromSide: {
          type: 'string',
          enum: ['top', 'right', 'bottom', 'left'],
        },
        fromEnd: {
          type: 'string',
          enum: ['none', 'arrow'],
          default: 'none',
        },
        toNode: { type: 'string' },
        toSide: {
          type: 'string',
          enum: ['top', 'right', 'bottom', 'left'],
        },
        toEnd: {
          type: 'string',
          enum: ['none', 'arrow'],
          default: 'arrow',
        },
        color: { $ref: '#/$defs/CanvasColor' },
        label: { type: 'string' },
      },
      required: ['id', 'fromNode', 'toNode'],
      additionalProperties: false,
    },
  },
};
