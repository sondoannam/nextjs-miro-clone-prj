"use client";

import React, { memo } from "react";

import { useMutation, useSelf } from "@/liveblocks.config";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  BringToFront,
  SendToBack,
  Trash2,
} from "lucide-react";

import { ColorPicker } from "./color-picker";

import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { useDeleteLayers } from "@/hooks/use-select-layer";

import { Camera, Color, XYWH } from "@/types/canvas";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

export const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf((me) => me.presence.selection);

    const moveToBack = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];

        const arr = liveLayerIds.toArray();

        for (let i = 0; i < arr.length; i++) {
          if (selection.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = 0; i < indices.length; i++) {
          liveLayerIds.move(indices[i], i);
        }
      },
      [selection]
    );

    const moveToFront = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];

        const arr = liveLayerIds.toArray();

        for (let i = 0; i < arr.length; i++) {
          if (selection.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
          liveLayerIds.move(
            indices[i],
            arr.length - 1 - (indices.length - 1 - i)
          );
        }
      },
      [selection]
    );

    const setFill = useMutation(
      ({ storage }, fill: Color) => {
        const liveLayers = storage.get("layers");

        setLastUsedColor(fill);

        selection.forEach((id) => {
          liveLayers.get(id)?.set("fill", fill);
        });
      },
      [selection, setLastUsedColor]
    );

    const alignCenterRow = useMutation(
      ({ storage }) => {
        const liveLayers = storage.get("layers");

        if (!selectionBounds) {
          return;
        }

        if (selection.length <= 1) {
          return;
        }

        let boundHeight = liveLayers.get(selection[0])?.get("height") ?? 0;

        for (const id of selection) {
          const layer = liveLayers.get(id);

          if (layer) {
            layer.update({
              y: selectionBounds.y + camera.y,
            });
            if (layer.get("height") >= boundHeight) {
              boundHeight = layer.get("height");
            }
          }
        }

        for (const id of selection) {
          const layer = liveLayers.get(id);

          if (layer) {
            if (layer.get("height") < boundHeight) {
              layer.update({
                y: layer.get("y") + boundHeight / 2 - layer.get("height") / 2,
              });
            }
          }
        }
      },
      [selection]
    );

    const alignCenterColumn = useMutation(
      ({ storage }) => {
        const liveLayers = storage.get("layers");

        if (!selectionBounds) {
          return;
        }

        if (selection.length <= 1) {
          return;
        }

        let boundWidth = liveLayers.get(selection[0])?.get("width") ?? 0;

        for (const id of selection) {
          const layer = liveLayers.get(id);

          if (layer) {
            layer.update({
              x: selectionBounds.x + camera.x,
            });
            if (layer.get("width") >= boundWidth) {
              boundWidth = layer.get("width");
            }
          }
        }

        for (const id of selection) {
          const layer = liveLayers.get(id);

          if (layer) {
            if (layer.get("width") < boundWidth) {
              layer.update({
                x: layer.get("x") + boundWidth / 2 - layer.get("width") / 2,
              });
            }
          }
        }
      },
      [selection]
    );

    const deleteLayers = useDeleteLayers();

    const selectionBounds = useSelectionBounds();

    if (!selectionBounds) {
      return null;
    }

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;

    return (
      <div
        className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
        style={{
          transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,
        }}
      >
        <ColorPicker onChange={setFill} />
        <div className="flex flex-col gap-y-0.5">
          <Hint label="Bring to front">
            <Button onClick={moveToFront} variant="board" size="icon">
              <BringToFront />
            </Button>
          </Hint>
          <Hint label="Send to back" side="bottom">
            <Button onClick={moveToBack} variant="board" size="icon">
              <SendToBack />
            </Button>
          </Hint>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <Hint label="Align center row">
            <Button
              onClick={alignCenterRow}
              variant="board"
              size="icon"
              disabled={selection.length <= 1}
            >
              <AlignCenterHorizontal />
            </Button>
          </Hint>
          <Hint label="Align center column" side="bottom">
            <Button
              onClick={alignCenterColumn}
              variant="board"
              size="icon"
              disabled={selection.length <= 1}
            >
              <AlignCenterVertical />
            </Button>
          </Hint>
        </div>
        <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
          <Hint label="Delete">
            <Button variant="board" size="icon" onClick={deleteLayers}>
              <Trash2 />
            </Button>
          </Hint>
        </div>
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";
