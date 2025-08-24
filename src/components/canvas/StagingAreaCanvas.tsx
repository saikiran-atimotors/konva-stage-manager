import React, { useCallback, useEffect } from 'react';
import { Stage, Layer, Group } from 'react-konva';
import { useCanvas } from '@/hooks/useCanvas';
import { useMaterials } from '@/hooks/useMaterials';
import { GridSystem } from './GridSystem';
import { MaterialObject } from './MaterialObject';
import { CanvasControls } from './CanvasControls';

interface StagingAreaCanvasProps {
  width: number;
  height: number;
}

export const StagingAreaCanvas: React.FC<StagingAreaCanvasProps> = ({
  width,
  height
}) => {
  const {
    canvasState,
    stageRef,
    updateScale,
    updatePosition,
    selectMaterial,
    clearSelection,
    moveMaterial
  } = useCanvas();

  const { materials } = useMaterials();

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    updateScale(newScale);
    
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    
    updatePosition(newPos.x - stage.x(), newPos.y - stage.y());
  }, [updateScale, updatePosition, stageRef]);

  const handleDragEnd = useCallback((e: any) => {
    updatePosition(e.target.x() - canvasState.position.x, e.target.y() - canvasState.position.y);
  }, [updatePosition, canvasState.position]);

  const handleStageClick = useCallback((e: any) => {
    // Clear selection when clicking on empty canvas
    if (e.target === e.target.getStage()) {
      clearSelection();
    }
  }, [clearSelection]);

  return (
    <div className="relative w-full h-full bg-canvas-bg rounded-lg shadow-canvas overflow-hidden">
      <Stage
        width={width}
        height={height}
        onWheel={handleWheel}
        scaleX={canvasState.scale}
        scaleY={canvasState.scale}
        x={canvasState.position.x}
        y={canvasState.position.y}
        draggable
        onDragEnd={handleDragEnd}
        onClick={handleStageClick}
        ref={stageRef}
      >
        <Layer>
          {/* Grid System for each staging area */}
          {canvasState.stagingAreas.map(area => (
            <Group key={area.id}>
              <GridSystem
                stagingArea={area}
                materials={materials.filter(m => m.gridPosition.areaId === area.id)}
                onCellClick={(row, col) => {
                  console.log(`Cell clicked: ${row}, ${col} in area ${area.id}`);
                }}
              />
            </Group>
          ))}
          
          {/* Material Objects */}
          {materials.map(material => (
            <MaterialObject
              key={material.id}
              material={material}
              isSelected={canvasState.selectedMaterials.includes(material.id)}
              onSelect={(id, multiSelect) => selectMaterial(id, multiSelect)}
              onMove={(materialId, newPosition) => moveMaterial(materialId, newPosition)}
              stagingAreas={canvasState.stagingAreas}
            />
          ))}
        </Layer>
      </Stage>
      
      <CanvasControls
        scale={canvasState.scale}
        onZoomIn={() => updateScale(canvasState.scale * 1.2)}
        onZoomOut={() => updateScale(canvasState.scale / 1.2)}
        onResetView={() => {
          updateScale(1);
          updatePosition(-canvasState.position.x, -canvasState.position.y);
        }}
        selectedCount={canvasState.selectedMaterials.length}
      />
    </div>
  );
};