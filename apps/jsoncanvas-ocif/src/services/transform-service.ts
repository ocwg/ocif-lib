import { CanvasColor, GroupNode, JsonCanvas } from '../types/jsoncanvas';
import { OCIFJson } from '@ocif/lib';

function canvasColorToOCIFColor(color?: CanvasColor): string {
  switch (color) {
    case '1':
      return 'red';
    case '2':
      return 'orange';
    case '3':
      return 'yellow';
    case '4':
      return 'green';
    case '5':
      return 'cyan';
    case '6':
      return 'purple';
  }
  return color || 'black';
}

export class TransformService {
  public transformJsonCanvasToOCIF(jsonCanvas: JsonCanvas): OCIFJson {
    const ocif: OCIFJson = {
      nodes: [],
      relations: [],
      resources: [],
    };

    jsonCanvas.nodes?.forEach((node) => {
      if (!ocif.nodes || !ocif.relations || !ocif.resources) {
        throw new Error('OCIF JSON is missing required properties');
      }
      if (node.type !== 'group') {
        const resource =
          node.type === 'text'
            ? node.text
            : node.type === 'file'
            ? node.file
            : node.type === 'link'
            ? node.url
            : undefined;
        if (resource) {
          ocif.resources.push({
            id: `resource-${node.id}`,
            representations: [
              {
                'mime-type':
                  node.type === 'text' ? 'text/markdown' : 'text/plain',
                content: resource,
              },
            ],
          });
        }
        if (node.type === 'nested-canvas') {
          const canvas = node.canvas;
          const canvasOCIF = this.transformJsonCanvasToOCIF(canvas);
          ocif.nodes.push({
            id: node.id,
            position: [node.x, node.y],
            size: [node.width, node.height],
            resource: resource ? `resource-${node.id}` : undefined,
            data: [
              {
                type: '@ocif/node/canvas',
                canvas: canvasOCIF,
              },
            ],
          });
        } else {
          ocif.nodes.push({
            id: node.id,
            position: [node.x, node.y],
            size: [node.width, node.height],
            resource: resource ? `resource-${node.id}` : undefined,
            data: [
              {
                type: '@ocif/node/rect',
                strokeColor: canvasColorToOCIFColor(node.color),
              },
            ],
          });
        }
      }
    });

    jsonCanvas.edges?.forEach((edge) => {
      if (!ocif.nodes || !ocif.relations || !ocif.resources) {
        throw new Error('OCIF JSON is missing required properties');
      }
      const fromNode = jsonCanvas.nodes?.find((n) => n.id === edge.fromNode);
      const toNode = jsonCanvas.nodes?.find((n) => n.id === edge.toNode);
      if (!fromNode || !toNode) {
        throw new Error('JSON Canvas is missing nodes');
      }

      ocif.nodes.push({
        id: `arrow-${edge.id}`,
        position: [
          fromNode.x + fromNode.width / 2,
          fromNode.y + fromNode.height / 2,
        ],
        size: [toNode.x - fromNode.x, toNode.y - fromNode.y],
        data: [
          {
            type: '@ocif/node/arrow',
          },
        ],
      });
      ocif.relations.push({
        id: edge.id,
        data: [
          {
            type: '@ocif/rel/edge',
            start: edge.fromNode,
            end: edge.toNode,
            rel: edge.label || '',
            node: `arrow-${edge.id}`,
          },
        ],
      });
    });

    jsonCanvas.nodes?.forEach((node) => {
      if (node.type === 'group' && ocif.relations) {
        const group = node as GroupNode;
        const members: string[] = [];
        jsonCanvas.nodes?.forEach((child) => {
          if (child.type !== 'group') {
            if (
              child.x >= group.x &&
              child.x <= group.x + group.width &&
              child.y >= group.y &&
              child.y <= group.y + group.height
            ) {
              members.push(child.id);
            }
          }
        });
        if (members.length > 0) {
          ocif.relations.push({
            id: `group-${group.id}`,
            data: [
              {
                type: '@ocif/rel/group',
                members: members,
              },
            ],
          });
        }
      }
    });
    return ocif;
  }
}
