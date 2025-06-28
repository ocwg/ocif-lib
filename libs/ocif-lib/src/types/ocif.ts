export type OCIFNode = {
  id: string;
  position?: [number, number];
  size?: [number, number];
  resource?: string;
  text?: string;
  data?: Array<{
    type:
      | '@ocif/node/oval'
      | '@ocif/node/rect'
      | '@ocif/node/arrow'
      | '@ocif/node/canvas';
    strokeWidth?: number;
    strokeColor?: string;
    fillColor?: string;
    canvas?: OCIFJson;
  }>;
};

export type OCIFEdgeRelation = {
  type: '@ocif/rel/edge';
  start: string;
  end: string;
  rel: string;
  node: string;
};

export type OCIFGroupRelation = {
  type: '@ocif/rel/group';
  members?: string[];
};

export type OCIFJson = {
  nodes?: Array<OCIFNode>;
  relations?: Array<{
    id: string;
    data: Array<OCIFEdgeRelation | OCIFGroupRelation>;
  }>;
  resources?: Array<{
    id: string;
    representations?: Array<{
      'mime-type': string;
      content?: string;
      location?: string;
    }>;
  }>;
};

export interface ValidationError {
  path: string;
  message: string;
  line: number;
  column: number;
  details?: string;
  context?: string;
}

export interface Node {
  id: string;
  type: 'rectangle' | 'oval';
  width: number;
  height: number;
  x: number;
  y: number;
  text?: string;
  style: {
    type: 'rectangle' | 'oval';
    strokeWidth: number;
    strokeColor: string;
    fillColor: string;
    canvas?: OCIFJson;
  };
}

export interface Relation {
  from: string;
  to: string;
  path: string;
  type: string;
  rel: string;
}

export interface Group {
  id: string;
  type: string;
  members: string[];
  x: number;
  y: number;
  width: number;
  height: number;
}
