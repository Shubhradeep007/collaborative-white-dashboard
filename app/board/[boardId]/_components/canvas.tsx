"use client"

import { useCallback, useMemo, useState } from "react";
import { Info } from "./info"
import { Priticipants } from "./priticipants"
import { Toolbar } from "./toolbar"
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point, Side, XYWH } from "@/types/canvas";

import { useHistory, useCanUndo, useCanRedo, useMutation, useStorage, useOthersMapped } from "@liveblocks/react";
import { CursorPresence } from "./cursor-presence";
import { connectionIdToColor, pointerEventToCanvasPoint, resizeBounce } from "@/lib/utils";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";


const MAX_LAYERS = 100;

interface CanvasProps {
  boardId: string
}

const Canvas = ({ boardId }: CanvasProps) => {

  const layerIds = useStorage((root) => root.layerIds);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
  const [lastUseColor, setLastUseColor] = useState<Color>({ r: 0, g: 0, b: 0 })

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const insertLayer = useMutation((
    {storage, setMyPresence},
    layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
    postion: Point,
    
  ) => {
      const liveLayer = storage.get("layers")
      if(liveLayer.size >= MAX_LAYERS){
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

      setMyPresence({ selection: [layerId]}, { addToHistory: true })
      setCanvasState({
        mode: CanvasMode.None
      })
  }, [lastUseColor]) 

  const traslateSelectedLayers = useMutation((
    {storage, self},
    point: Point,
  ) => {
    if(canvasState.mode !== CanvasMode.Translating){
      return
    }
    const offset = {
      x: point.x - canvasState.current.x,
      y: point.y - canvasState.current.y,
    }

    const liveLayer = storage.get("layers")    
    for(const layerId of self.presence.selection){
      const layer = liveLayer.get(layerId)
      if(layer){
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
   

  const resizeSelectedLayer = useMutation((
    {storage, self},
    point: Point,
  ) => {
    if(canvasState.mode !== CanvasMode.Resizing){
      return
    }

    const bounce = resizeBounce(canvasState.intialBounce, point, canvasState.corner)

    const liveLayers = storage.get("layers")
    const layer = liveLayers.get(self.presence.selection[0])

    if(layer){
      layer.update(bounce)
    }

  }, [canvasState])

  const unselectLayer = useMutation((
    {self, setMyPresence}
  ) => {
    if(self.presence.selection.length > 0){
    setMyPresence({ selection: [] }, { addToHistory: true })
    }
  }, [])

  const onResizeHandelPointerDown = useCallback((
    corner: Side,
    intialBounce: XYWH
  ) => {
    console.log({
      corner,
      intialBounce
    });
    
    history.pause()
    setCanvasState({
      mode: CanvasMode.Resizing,
      corner,
      intialBounce,
    })
  }, [history])

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }))
  }, [])

  const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
    e.preventDefault()
    const current = pointerEventToCanvasPoint(e, camera)

    if(canvasState.mode === CanvasMode.Translating){
      traslateSelectedLayers(current)
      
    } else if(canvasState.mode === CanvasMode.Resizing) {
      resizeSelectedLayer(current)
    }
    setMyPresence({
      cursor: current
    })
  }, [canvasState, resizeSelectedLayer, camera, traslateSelectedLayers])

  const onPointerLeave = useMutation((
    { setMyPresence }
  ) => {
    setMyPresence({
      cursor: null
    })
  }, [])


  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const point = pointerEventToCanvasPoint(e, camera)
    if(canvasState.mode === CanvasMode.Inserting){
      return
    }
    
    // Todo: Add case for Drawing
    setCanvasState({ origin: point, mode: CanvasMode.Pressing })
    
   }, [setCanvasState, canvasState.mode, camera])

  const onPointerUp = useMutation((
    {},
    e
  ) => {
    const point = pointerEventToCanvasPoint(e, camera)

    if(canvasState.mode === CanvasMode.None || 
      canvasState.mode === CanvasMode.Pressing
    ) {
      unselectLayer()
      setCanvasState({ mode: CanvasMode.None })
    } else if(canvasState.mode === CanvasMode.Inserting){
      insertLayer(canvasState.layerType, point)
    } else {
      setCanvasState({
        mode: CanvasMode.None
      })
    }
    history.resume()
  }, [
    camera, canvasState, history, insertLayer, unselectLayer
  ])

  const selections = useOthersMapped((other) => other.presence.selection)

  const layerIdsToColorSelcetion = useMemo(() => {
    const layerIdsToColorSelcetion: Record<string, string> = {}

    for(const user of selections){
      const [conectionId, selection ] = user

      for(const layerId of selection){
        layerIdsToColorSelcetion[layerId] = connectionIdToColor(conectionId)
      }
    }
    return layerIdsToColorSelcetion
  }, [selections])


  const onLayerPointerDown = useMutation((
    {self, setMyPresence},
    e: React.PointerEvent,
    layerId: string
  ) => {
    if(canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting){
      return ;
    }

    history.pause()
    e.stopPropagation()

    const point = pointerEventToCanvasPoint(e, camera)
    
    if(!self.presence.selection.includes(layerId)){
      setMyPresence({ selection: [layerId] }, {addToHistory: true})
    }

    setCanvasState({ mode: CanvasMode.Translating, current: point})

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
            <CursorPresence />
          </g>

        </svg>
      </main>
    </>
  )
}

export default Canvas