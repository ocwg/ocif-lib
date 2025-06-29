import { JsonCanvas, Node, Edge, CanvasColor } from "../types/jsoncanvas";
import { OCIFJson, OCIFNode } from "../types/ocif";

export class JsonCanvasService {
  private static generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private static getNodeColor(node: OCIFNode): CanvasColor {
    const nodeData = node.data?.[0];
    if (nodeData?.fillColor) {
      return nodeData.fillColor as CanvasColor;
    }
    return "#ffffff" as CanvasColor;
  }

  private static getNodeText(
    node: OCIFNode,
    resources?: OCIFJson["resources"]
  ): string {
    if (typeof node.text === "string") {
      return node.text;
    }
    if (node.resource && resources) {
      const resource = resources.find((r) => r.id === node.resource);
      if (resource) {
        const textRep = resource.representations?.find(
          (rep) => rep["mime-type"] === "text/plain"
        );
        if (textRep?.content) {
          return textRep.content;
        }
        const anyRep = resource.representations?.find((rep) => rep.content);
        if (anyRep?.content) {
          return anyRep.content;
        }
      }
    }
    return "Node";
  }

  public static convertToJsonCanvas(ocifJson: OCIFJson): JsonCanvas {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeSpacing = 100;

    // Process nodes
    if (ocifJson.nodes) {
      Object.entries(ocifJson.nodes).forEach(([, node], index) => {
        if (node.data?.[0]?.type === "@ocif/node/arrow") return;

        const nodeWidth = node.size?.[0] || 120;
        const nodeHeight = node.size?.[1] || 60;
        const x =
          node.position?.[0] || 50 + (index % 3) * (nodeWidth + nodeSpacing);
        const y =
          node.position?.[1] ||
          50 + Math.floor(index / 3) * (nodeHeight + nodeSpacing);

        nodes.push({
          id: node.id,
          type: "text",
          x,
          y,
          width: nodeWidth,
          height: nodeHeight,
          text: this.getNodeText(node, ocifJson.resources),
          color: this.getNodeColor(node),
        });
      });
    }

    // Process relations
    if (ocifJson.relations) {
      ocifJson.relations.forEach((relationGroup) => {
        relationGroup.data.forEach((relation) => {
          if (relation.type === "@ocif/rel/edge") {
            const fromNode = nodes.find((n) => n.id === relation.start);
            const toNode = nodes.find((n) => n.id === relation.end);

            if (fromNode && toNode) {
              edges.push({
                id: this.generateId(),
                fromNode: fromNode.id,
                toNode: toNode.id,
                fromSide: "right",
                toSide: "left",
              });
            }
          }
        });
      });
    }

    return {
      nodes,
      edges,
    };
  }

  public static exportToJsonCanvas(ocifJson: OCIFJson): void {
    const jsonCanvas = this.convertToJsonCanvas(ocifJson);
    const jsonString = JSON.stringify(jsonCanvas, null, 2);

    // Create a blob and download link
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ocif-export.canvas";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
