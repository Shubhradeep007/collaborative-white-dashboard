'use client'

import { colorToCss } from "@/lib/utils"
import { Color } from "@/types/canvas"

import { useProModal } from "@/store/use-pro-modal";
import { Plus } from "lucide-react";
import { useRef } from "react";

interface ColorPickerProps {
    onChange: (color: Color) => void;
    isPro: boolean;
}

export const ColorPicker = ({ onChange, isPro }: ColorPickerProps) => {
    const { onOpen } = useProModal();

    const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hex = e.target.value;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        onChange({ r, g, b });
    };

    return (
        <div
            className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
            <ColorButton onClick={onChange} color={{ r: 243, g: 82, b: 35 }} />
            <ColorButton onClick={onChange} color={{ r: 255, g: 249, b: 177 }} />
            <ColorButton onClick={onChange} color={{ r: 68, g: 202, b: 99 }} />
            <ColorButton onClick={onChange} color={{ r: 39, g: 142, b: 237 }} />
            <ColorButton onClick={onChange} color={{ r: 155, g: 105, b: 245 }} />
            <ColorButton onClick={onChange} color={{ r: 252, g: 142, b: 42 }} />
            <ColorButton onClick={onChange} color={{ r: 0, g: 0, b: 0 }} />

            <div className="relative w-8 h-8 flex items-center justify-center">
                <button
                    className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
                >
                    <div className="h-8 w-8 rounded-md border border-neutral-300 flex items-center justify-center bg-white">
                        <Plus className="h-4 w-4 text-neutral-500" />
                    </div>
                </button>
                <input
                    type="color"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={onColorChange}
                    onClick={(e) => {
                        if (!isPro) {
                            e.preventDefault();
                            onOpen();
                        }
                    }}
                />
            </div>
        </div>
    )
}

interface colorButtonProps {
    onClick: (color: Color) => void
    color: Color
}

const ColorButton = ({ onClick, color }: colorButtonProps) => {
    return (
        <button
            className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
            onClick={() => onClick(color)}
        >
            <div className="h-8 w-8 rounded-md border border-neutral-300 "
                style={{
                    backgroundColor: colorToCss(color)
                }}
            >

            </div>

        </button>
    )
}
