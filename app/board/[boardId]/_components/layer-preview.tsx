"use client";

import { memo } from "react";

import { useStorage } from "@/liveblocks.config";

import { LayerType } from "@/types/canvas";
import { Rectangle } from "./rectangle-layer";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const LayerPreview = memo(
  ({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) return;

    switch (layer.type) {
      case LayerType.Text:
        return <div>Text</div>;
      case LayerType.Note:
        return <div>Note</div>;
      case LayerType.Rectangle:
        return (
          <Rectangle
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Ellipse:
        return <div>Ellipse</div>;
      default:
        console.warn("Unknown layer type");
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";
