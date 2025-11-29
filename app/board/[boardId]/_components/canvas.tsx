"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import { Info } from "./info"
import { Priticipants } from "./priticipants"
import { Toolbar } from "./toolbar"
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point, Side, XYWH } from "@/types/canvas";

import { useHistory, useCanUndo, useCanRedo, useMutation, useStorage, useOthersMapped, useSelf } from "@liveblocks/react";
import { CursorPresence } from "./cursor-presence";
import { colorToCss, connectionIdToColor, findIntersectingLayersWithReactangle, penPointsToPathLayer, pointerEventToCanvasPoint, resizeBounce } from "@/lib/utils";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTool } from "./selection-tool";
import { Path } from "./path";



const MAX_LAYERS = 100;

interface CanvasProps {
  boardId: string
}

const Canvas = ({ boardId }: CanvasProps) => {

  const layerIds = useStorage((root) => root.layerIds);

  const pencilDraft = useSelf((root) => root.presence.pencilDraft)

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
  const [lastUseColor, setLastUseColor] = useState<Color>({ r: 0, g: 0, b: 0 })

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const insertLayer = useMutation((
    { storage, setMyPresence },
    layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
    postion: Point,

  ) => {
    const liveLayer = storage.get("layers")
    if (liveLayer.size >= MAX_LAYERS) {
      return
    }

    const liveLayerIds = storage.get("layerIds")
    const layerId = nanoid();

    const layer = new LiveObject({
      type: layerType,
      x: postion.x,
      y: postion.y,
      width: 100,
      height: 100,
      fill: lastUseColor
    })
    liveLayerIds.push(layerId)
    liveLayer.set(layerId, layer)

    setMyPresence({ selection: [layerId] }, { addToHistory: true })
    setCanvasState({
      mode: CanvasMode.None
    })
  }, [lastUseColor])

  const traslateSelectedLayers = useMutation((
    { storage, self },
    point: Point,
  ) => {
    if (canvasState.mode !== CanvasMode.Translating) {
      return
    }
    const offset = {
      x: point.x - canvasState.current.x,
      y: point.y - canvasState.current.y,
    }

    const liveLayer = storage.get("layers")
    for (const layerId of self.presence.selection) {
      const layer = liveLayer.get(layerId)
      if (layer) {
        layer.update({
          x: layer.get("x") + offset.x,
          y: layer.get("y") + offset.y,
        })
      }
    }

    setCanvasState({
      mode: CanvasMode.Translating, current: point
    })
  }, [canvasState])

  const upadateSelectionNet = useMutation((
    { storage, setMyPresence }, current: Point, origin: Point
  ) => {
    const layers = storage.get("layers").toImmutable()

    setCanvasState({
      mode: CanvasMode.SelectionNet,
      origin,
      current
    })

    if (!layerIds) return null

    const ids = findIntersectingLayersWithReactangle(
      layerIds,
      layers,
      origin,
      current
    )

    setMyPresence({ selection: ids })


  }, [layerIds])

  const startMultiSelection = useCallback((
    current: Point,
    origin: Point
  ) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      })
    }
  }, [])

  const continueDrawing = useMutation((
    { self, setMyPresence },
    point: Point,
    e: React.PointerEvent
  ) => {
    const { pencilDraft } = self.presence

    if (
      canvasState.mode !== CanvasMode.Pencil ||
      e.buttons !== 1 ||
      pencilDraft == null
    ) {
      return
    }

    setMyPresence({
      cursor: point,
      pencilDraft:
        pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y ?
          pencilDraft :
          [...pencilDraft, [point.x, point.y, e.pressure]],
    })
  }, [canvasState.mode])

  const insertPath = useMutation((
    { storage, self, setMyPresence },
  ) => {
    const liveLayers = storage.get("layers")
    const { pencilDraft } = self.presence;

    if (
      pencilDraft == null ||
      pencilDraft.length < 2 ||
      liveLayers.size >= MAX_LAYERS
    ) {
      setMyPresence({ pencilDraft: null })
      return
    }

    const id = nanoid()
    liveLayers.set(
      id,
      new LiveObject(penPointsToPathLayer(
        pencilDraft,
        lastUseColor
      ))
    )

    const liveLayerIds = storage.get("layerIds")
    liveLayerIds.push(id)

    setMyPresence({ pencilDraft: null })

    setCanvasState({ mode: CanvasMode.Pencil })

  }, [lastUseColor])

  const startDrawing = useMutation((
    { setMyPresence },
    point: Point,
    pressure: number
  ) => {
    setMyPresence({
      pencilDraft: [[point.x, point.y, pressure]],
      penColor: lastUseColor,
    })
  }, [lastUseColor])

  const unselectLayer = useMutation((
    { self, setMyPresence }
  ) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true })
    }
  }, [])

  const deleteLayers = useMutation((
    { storage, self, setMyPresence }
  ) => {
    const selection = self.presence.selection;

    if (!selection || selection.length === 0) {
      return;
    }

    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");

    for (const id of selection) {
      liveLayers.delete(id);

      const index = liveLayerIds.indexOf(id);
      if (index !== -1) {
        liveLayerIds.delete(index);
      }
    }

    setMyPresence({ selection: [] }, { addToHistory: true });
  }, [history]);

  const duplicateLayers = useMutation((
    { storage, self, setMyPresence }
  ) => {
    const selection = self.presence.selection;

    if (!selection || selection.length === 0) {
      return;
    }

    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");

    const newSelection: string[] = [];

    for (const id of selection) {
      const layer = liveLayers.get(id);

      if (layer) {
        const newLayerId = nanoid();
        const newLayer = layer.clone();

        // Offset the new layer slightly so it's visible
        newLayer.set("x", newLayer.get("x") + 10);
        newLayer.set("y", newLayer.get("y") + 10);

        liveLayerIds.push(newLayerId);
        liveLayers.set(newLayerId, newLayer);

        newSelection.push(newLayerId);
      }
    }

    setMyPresence({ selection: newSelection }, { addToHistory: true });
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (document.activeElement instanceof HTMLElement &&
        (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.isContentEditable)) {
        return;
      }

      switch (e.key) {
        case "Backspace":
        case "Delete":
          deleteLayers();
          break;
        case "z":
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            e.preventDefault();
          }
          break;
        case "y":
          if (e.ctrlKey || e.metaKey) {
            history.redo();
            e.preventDefault();
          }
          break;
        case "d":
          if (e.ctrlKey || e.metaKey) {
            duplicateLayers();
            e.preventDefault();
          }
          break;
        case "Escape":
          // We need to access unselectLayer here, but it's defined later. 
          // Ideally we should move unselectLayer up or define it inside useEffect dependency if possible (but it's a mutation).
          // For now, let's just clear selection manually or move unselectLayer up.
          // Better yet, let's move unselectLayer definition up before this useEffect.
          break;
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.key === " ") {
        setCanvasState({ mode: CanvasMode.None });
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [deleteLayers, duplicateLayers, history, canvasState.mode, setCanvasState]);

  const resizeSelectedLayer = useMutation((
    { storage, self },
    point: Point,
  ) => {
    if (canvasState.mode !== CanvasMode.Resizing) {
      return
    }

    const bounds = resizeBounce(
      canvasState.intialBounce,
      point,
      canvasState.corner
    )

    const liveLayers = storage.get("layers")
    const layer = liveLayers.get(self.presence.selection[0])

    if (layer) {
      layer.update(bounds)
    }

  }, [canvasState])

  const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
    e.preventDefault()
    const current = pointerEventToCanvasPoint(e, camera)

    if (canvasState.mode === CanvasMode.Pressing) {
      startMultiSelection(current, canvasState.origin)
    } else if (canvasState.mode === CanvasMode.SelectionNet) {
      upadateSelectionNet(current, canvasState.origin)
    } else if (canvasState.mode === CanvasMode.Translating) {
      traslateSelectedLayers(current)

    } else if (canvasState.mode === CanvasMode.Resizing) {
      resizeSelectedLayer(current)
    } else if (canvasState.mode === CanvasMode.Pencil) {
      continueDrawing(current, e)
    }
    setMyPresence({
      cursor: current
    })
  }, [canvasState, resizeSelectedLayer, camera, traslateSelectedLayers, continueDrawing, startMultiSelection, upadateSelectionNet])

  const onPointerLeave = useMutation((
    { setMyPresence }
  ) => {
    setMyPresence({
      cursor: null
    })
  }, [])


  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const point = pointerEventToCanvasPoint(e, camera)
    if (canvasState.mode === CanvasMode.Inserting) {
      return
    }

    if (canvasState.mode === CanvasMode.Pencil) {
      startDrawing(point, e.pressure)
      return
    }

    setCanvasState({ origin: point, mode: CanvasMode.Pressing })

  }, [setCanvasState, canvasState.mode, camera, startDrawing])

  const onPointerUp = useMutation((
    { },
    e
  ) => {
    const point = pointerEventToCanvasPoint(e, camera)

    if (canvasState.mode === CanvasMode.None ||
      canvasState.mode === CanvasMode.Pressing
    ) {
      unselectLayer()
      setCanvasState({ mode: CanvasMode.None })
    } else if (canvasState.mode === CanvasMode.Pencil) {
      insertPath()
    } else if (canvasState.mode === CanvasMode.Inserting) {
      insertLayer(canvasState.layerType, point)
    } else {
      setCanvasState({
        mode: CanvasMode.None
      })
    }
    history.resume()
  }, [
    setCanvasState, camera, canvasState, history, insertLayer, unselectLayer, insertPath
  ])

  const selections = useOthersMapped((other) => other.presence.selection)

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }))
  }, [])

  const onResizeHandelPointerDown = useCallback((
    corner: Side,
    initialBounds: XYWH
  ) => {
    history.pause()
    setCanvasState({
      mode: CanvasMode.Resizing,
      intialBounce: initialBounds,
      corner,
    })
  }, [history])

  const layerIdsToColorSelcetion = useMemo(() => {
    const layerIdsToColorSelcetion: Record<string, string> = {}

    for (const user of selections) {
      const [conectionId, selection] = user

      for (const layerId of selection) {
        layerIdsToColorSelcetion[layerId] = connectionIdToColor(conectionId)
      }
    }
    return layerIdsToColorSelcetion
  }, [selections])


  const onLayerPointerDown = useMutation((
    { self, setMyPresence },
    e: React.PointerEvent,
    layerId: string
  ) => {
    if (canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) {
      return;
    }

    history.pause()
    e.stopPropagation()

    const point = pointerEventToCanvasPoint(e, camera)

    if (!self.presence.selection.includes(layerId)) {
      setMyPresence({ selection: [layerId] }, { addToHistory: true })
    }

    setCanvasState({ mode: CanvasMode.Translating, current: point })

  }, [setCanvasState, camera, history, canvasState.mode])

  return (
    <>
      <main className="h-full w-full reletive bg-neutral-100 touch-none">
        <Info boardId={boardId} />
        <Priticipants />
        <Toolbar
          canvasState={canvasState}
          setCanvasState={setCanvasState}
          canUndo={canUndo}
          canRedo={canRedo}
          undo={history.undo}
          redo={history.redo}
        />

        <SelectionTool
          camera={camera}
          setLastUseColor={setLastUseColor}
        />

        <svg
          className="h-[100vh] w-[100vw]"
          onWheel={onWheel}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onPointerUp={onPointerUp}
          onPointerDown={onPointerDown}
        >
          <g
            style={{
              transform: `translate(${camera.x}px, ${camera.y}px)`,

            }}
          >
            {layerIds?.map((layerid) => (
              <LayerPreview
                key={layerid}
                id={layerid}
                onLayerPointerDown={onLayerPointerDown}
                selectionColor={layerIdsToColorSelcetion[layerid]}
              />
            ))}

            <SelectionBox
              onResizeHandelPointerDown={onResizeHandelPointerDown}
            />
            {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
              <rect
                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )}
            <CursorPresence />
            {pencilDraft != null && pencilDraft.length > 0 && (
              <Path
                x={0}
                y={0}
                points={pencilDraft}
                fill={colorToCss(lastUseColor)}
              />
            )}
          </g>

        </svg>
      </main>
    </>
  )
}

export default Canvas
