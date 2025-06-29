import { OCIFJson, OCIFNode } from '@ocif/lib';

export function generateTldrawJson(json: OCIFJson): string {
  // Create base tldraw structure
  const tldrawJson = {
    tldrawFileFormatVersion: 1,
    schema: {
      schemaVersion: 2,
      sequences: {
        'com.tldraw.store': 4,
        'com.tldraw.asset': 1,
        'com.tldraw.camera': 1,
        'com.tldraw.document': 2,
        'com.tldraw.instance': 25,
        'com.tldraw.instance_page_state': 5,
        'com.tldraw.page': 1,
        'com.tldraw.instance_presence': 5,
        'com.tldraw.pointer': 1,
        'com.tldraw.shape': 4,
        'com.tldraw.asset.bookmark': 1,
        'com.tldraw.asset.image': 3,
        'com.tldraw.asset.video': 3,
        'com.tldraw.shape.group': 0,
        'com.tldraw.shape.text': 2,
        'com.tldraw.shape.bookmark': 2,
        'com.tldraw.shape.draw': 1,
        'com.tldraw.shape.geo': 8,
        'com.tldraw.shape.note': 6,
        'com.tldraw.shape.line': 4,
        'com.tldraw.shape.frame': 0,
        'com.tldraw.shape.arrow': 4,
        'com.tldraw.shape.highlight': 0,
        'com.tldraw.shape.embed': 4,
        'com.tldraw.shape.image': 3,
        'com.tldraw.shape.video': 2,
        'com.tldraw.binding.arrow': 0,
      },
    },
    records: [
      {
        gridSize: 10,
        name: '',
        meta: {},
        id: 'document:document',
        typeName: 'document',
      },
      {
        id: 'pointer:pointer',
        typeName: 'pointer',
        x: 0,
        y: 0,
        lastActivityTimestamp: Date.now(),
        meta: {},
      },
      {
        meta: {},
        id: 'page:page',
        name: 'Page 1',
        index: 'a1',
        typeName: 'page',
      },
      {
        followingUserId: null,
        opacityForNextShape: 1,
        stylesForNextShape: {
          'tldraw:geo': 'rectangle',
        },
        brush: null,
        scribbles: [],
        cursor: {
          type: 'default',
          rotation: 0,
        },
        isFocusMode: false,
        exportBackground: true,
        isDebugMode: false,
        isToolLocked: false,
        screenBounds: {
          x: 0,
          y: 0,
          w: 1502,
          h: 809,
        },
        insets: [false, false, false, false],
        zoomBrush: null,
        isGridMode: false,
        isPenMode: false,
        chatMessage: '',
        isChatting: false,
        highlightedUserIds: [],
        isFocused: true,
        devicePixelRatio: 2,
        isCoarsePointer: false,
        isHoveringCanvas: true,
        openMenus: [],
        isChangingStyle: false,
        isReadonly: false,
        meta: {},
        duplicateProps: null,
        id: 'instance:instance',
        currentPageId: 'page:page',
        typeName: 'instance',
      },
      {
        editingShapeId: null,
        croppingShapeId: null,
        selectedShapeIds: [],
        hoveredShapeId: null,
        erasingShapeIds: [],
        hintingShapeIds: [],
        focusedGroupId: null,
        meta: {},
        id: 'instance_page_state:page:page',
        pageId: 'page:page',
        typeName: 'instance_page_state',
      },
      {
        x: 0,
        y: 0,
        z: 1,
        meta: {},
        id: 'camera:page:page',
        typeName: 'camera',
      },
    ],
  } as any;

  // Add nodes
  if (json.nodes) {
    Object.entries(json.nodes).forEach(([_nodeId, node], index) => {
      if (node.data?.[0]?.type === '@ocif/node/arrow') return;

      const nodeWidth = node.size?.[0] || 120;
      const nodeHeight = node.size?.[1] || 60;
      const x = node.position?.[0] || 100;
      const y = node.position?.[1] || 100;

      const nodeData = node.data?.[0];
      const nodeType =
        nodeData?.type === '@ocif/node/oval' ? 'oval-node' : 'rect-node';
      const strokeColor = nodeData?.strokeColor || '#000000';
      const fillColor = nodeData?.fillColor || '#FFFFFF';
      const strokeWidth = nodeData?.strokeWidth || 2;

      // Get node text
      let nodeText = 'Node';
      if (typeof node.text === 'string') {
        nodeText = node.text;
      } else if (node.resource && json.resources) {
        const resource = json.resources.find((r) => r.id === node.resource);
        if (resource) {
          // Try to find a text representation
          const textRep = resource.representations?.find(
            (rep) => rep['mime-type'] === 'text/plain'
          );
          if (textRep?.content) {
            nodeText = textRep.content;
          } else {
            // Fallback to any representation with content
            const anyRep = resource.representations?.find((rep) => rep.content);
            if (anyRep?.content) {
              nodeText = anyRep.content;
            }
          }
        }
      }

      // Add group for the node
      tldrawJson.records.push({
        x,
        y,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {
          isFlowNode: true,
          nodeInfo: {
            type: nodeType,
            strokeColor,
            fillColor,
            strokeWidth,
            text: nodeText,
            formValues: {},
            isOCIFNode: true,
          },
        },
        id: `shape:${node.id}_group`,
        type: 'group',
        parentId: 'page:page',
        index: `b${index.toString().padStart(8, '1')}`,
        props: {},
        typeName: 'shape',
      } as any);

      // Add the actual shape
      tldrawJson.records.push({
        x: 0,
        y: 0,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {},
        id: `shape:${node.id}`,
        type: 'geo',
        props: {
          w: nodeWidth,
          h: nodeHeight,
          geo: 'rectangle',
          color: 'black',
          labelColor: 'black',
          fill: 'none',
          dash: 'draw',
          size: 's',
          font: 'draw',
          text: nodeText,
          align: 'middle',
          verticalAlign: 'middle',
          growY: 0,
          url: '',
        },
        parentId: `shape:${node.id}_group`,
        index: `b${index.toString().padStart(8, '1')}`,
        typeName: 'shape',
      } as any);
    });
  }

  // Add relations (arrows)
  if (json.relations) {
    json.relations.forEach((relationGroup, index) => {
      relationGroup.data.forEach((relation: any) => {
        // TODO FIX
        const nodes = json.nodes as unknown as Array<OCIFNode>;
        const fromNode = nodes?.find((node) => node.id === relation.start);
        const toNode = nodes?.find((node) => node.id === relation.end);

        if (fromNode && toNode) {
          const fromX = fromNode.position?.[0] || 100;
          const fromY = fromNode.position?.[1] || 100;
          const toX = toNode.position?.[0] || 300;
          const toY = toNode.position?.[1] || 100;

          // Get relation text if available
          let relationText = '';
          // Check if the relation has a resource property (using type assertion)
          const relationWithResource = relation as any;
          if (relationWithResource.resource && json.resources) {
            const resource = json.resources.find(
              (r) => r.id === relationWithResource.resource
            );
            if (resource) {
              const textRep = resource.representations?.find(
                (rep) => rep['mime-type'] === 'text/plain'
              );
              if (textRep?.content) {
                relationText = textRep.content;
              }
            }
          }

          // Calculate center point of source node
          const fromCenterX = fromX + (fromNode.size?.[0] || 120) / 2;
          const fromCenterY = fromY + (fromNode.size?.[1] || 60) / 2;

          // Add arrow
          tldrawJson.records.push({
            x: fromCenterX,
            y: fromCenterY,
            rotation: 0,
            isLocked: false,
            opacity: 1,
            meta: {
              nodeInfo: {},
            },
            id: `shape:${relation.node}`,
            type: 'arrow',
            parentId: 'page:page',
            index: `a${index.toString().padStart(8, '1')}`,
            props: {
              dash: 'draw',
              size: 'm',
              fill: 'none',
              color: 'black',
              labelColor: 'black',
              bend: 0,
              start: {
                x: 0,
                y: 0,
              },
              end: {
                x: toX - fromCenterX,
                y: toY - fromCenterY,
              },
              arrowheadStart: 'none',
              arrowheadEnd: 'arrow',
              text: relationText,
              labelPosition: 0.5,
              font: 'draw',
            },
            typeName: 'shape',
          } as any);

          // Add start binding
          tldrawJson.records.push({
            meta: {},
            id: `binding:${relation.node}_binding_start`,
            type: 'arrow',
            fromId: `shape:${relation.node}`,
            toId: `shape:${relation.start}`,
            props: {
              isPrecise: true,
              isExact: false,
              normalizedAnchor: {
                x: 0.5,
                y: 0.5,
              },
              terminal: 'start',
            },
            typeName: 'binding',
          } as any);

          // Add end binding
          tldrawJson.records.push({
            meta: {},
            id: `binding:${relation.node}_binding_end`,
            type: 'arrow',
            fromId: `shape:${relation.node}`,
            toId: `shape:${relation.end}`,
            props: {
              isPrecise: true,
              isExact: false,
              normalizedAnchor: {
                x: 0.5,
                y: 0.5,
              },
              terminal: 'end',
            },
            typeName: 'binding',
          } as any);
        }
      });
    });
  }

  return JSON.stringify(tldrawJson, null, 2);
}
