import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { useMutation } from "@/liveblocks.config";

import { TextLayer } from "@/types/canvas";
import { cn, colorToCss } from "@/lib/utils";
import { MAX_FONT_SIZE, SCALE_FACTOR_TEXT } from "@/constant";

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

const calculateFontSize = (width: number, height: number) => {
  const fontSizeBasedOnHeight = height * SCALE_FACTOR_TEXT;
  const fontSizeBasedOnWidth = width * SCALE_FACTOR_TEXT;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, MAX_FONT_SIZE);
};

interface TextProps {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Text = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: TextProps) => {
  const { x, y, width, height, fill, value } = layer;

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get("layers");

    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
      }}
    >
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className={cn(
          "h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none",
          font.className
        )}
        style={{
          fontSize: calculateFontSize(width, height),
          color: fill ? colorToCss(fill) : "#000",
        }}
      />
    </foreignObject>
  );
};
