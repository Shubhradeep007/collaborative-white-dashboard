import { Circle, MousePointer2, Pencil, Redo, Square, StickyNote, Type, Undo } from "lucide-react";
import { ToolButton } from "./toolbutton";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";


interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isPro: boolean;
}


export const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
  isPro
}: ToolbarProps) => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">

        <ToolButton
          lebel="select"
          icon={MousePointer2}
          onClick={() => setCanvasState({ mode: CanvasMode.None, })}
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.Resizing ||
            canvasState.mode === CanvasMode.SelectionNet
          }
        />

        <ToolButton
          lebel="text"
          icon={Type}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Text
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Text
          }
        />

        <ToolButton
          lebel="Sticky Note"
          icon={StickyNote}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Note
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Note
          }
        />


        <ToolButton
          lebel="Rectangle"
          icon={Square}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Rectangle
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Rectangle
          }
        />

        <ToolButton
          lebel="Ellipse"
          icon={Circle}
          onClick={() => setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Ellipse
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting && canvasState.layerType === LayerType.Ellipse
          }
        />

        <ToolButton
          lebel="Pen"
          icon={Pencil}
          onClick={() => setCanvasState({
            mode: CanvasMode.Pencil

          })}
          isActive={
            canvasState.mode === CanvasMode.Pencil
          }
        />
      </div>

      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md ">

        <ToolButton
          lebel="Undo"
          icon={Undo}
          onClick={undo}
          isDisabled={!canUndo}
        />

        <ToolButton
          lebel="Redo"
          icon={Redo}
          onClick={redo}
          isDisabled={!canRedo}
        />

      </div>
    </div>
  );
};

Toolbar.Skeleton = function ToolbarSkeleton() {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md" />
  );
};
