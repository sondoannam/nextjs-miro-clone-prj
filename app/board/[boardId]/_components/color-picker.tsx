"use client";

import React from "react";

import { Color } from "@/types/canvas";
import { colorToCss } from "@/lib/utils";
import { COLORS } from "@/constant";

interface ColorButtonProps {
  onClick: (color: Color) => void;
  color: Color;
}

const ColorButton = ({ onClick, color }: ColorButtonProps) => {
  return (
    <button
      type="button"
      title={`${color.r + color.g + color.b}`}
      className="w-8 h-8 flex items-center justify-center hover:opacity-75 transition"
      onClick={() => onClick(color)}
    >
      <div
        className="h-8 w-8 rounded-md border border-neutral-300"
        style={{ background: colorToCss(color) }}
      />
    </button>
  );
};

interface ColorPickerProps {
  onChange: (color: Color) => void;
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
      {COLORS.map((color) => (
        <ColorButton
          key={color.r + color.g + color.b}
          color={color}
          onClick={onChange}
        />
      ))}
    </div>
  );
};
