import { useState, useCallback, useRef } from 'react';
import { CanvasState, Material, StagingArea } from '@/types/material';

const initialCanvasState: CanvasState = {
  scale: 1,
  position: { x: 0, y: 0 },
  selectedMaterials: [],
  stagingAreas: [
    {
      id: 'area-1',
      name: 'Staging Area A',
      rows: 6,
      columns: 10,
      cellSize: { width: 90, height: 70 },
      position: { x: 100, y: 80 },
      color: '#3B82F6',
      materials: []
    }
  ],
  draggedMaterial: undefined
};

export const useCanvas = () => {
  const [canvasState, setCanvasState] = useState<CanvasState>(initialCanvasState);
  const stageRef = useRef<any>(null);

  const updateScale = useCallback((newScale: number) => {
    setCanvasState(prev => ({
      ...prev,
      scale: Math.max(0.1, Math.min(3, newScale))
    }));
  }, []);

  const updatePosition = useCallback((deltaX: number, deltaY: number) => {
    setCanvasState(prev => ({
      ...prev,
      position: {
        x: prev.position.x + deltaX,
        y: prev.position.y + deltaY
      }
    }));
  }, []);

  const selectMaterial = useCallback((materialId: string, isMultiSelect: boolean = false) => {
    setCanvasState(prev => {
      if (isMultiSelect) {
        const isSelected = prev.selectedMaterials.includes(materialId);
        return {
          ...prev,
          selectedMaterials: isSelected
            ? prev.selectedMaterials.filter(id => id !== materialId)
            : [...prev.selectedMaterials, materialId]
        };
      } else {
        return {
          ...prev,
          selectedMaterials: [materialId]
        };
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      selectedMaterials: []
    }));
  }, []);

  const addStagingArea = useCallback((area: Omit<StagingArea, 'id' | 'materials'>) => {
    const newArea: StagingArea = {
      ...area,
      id: `area-${Date.now()}`,
      materials: []
    };
    
    setCanvasState(prev => ({
      ...prev,
      stagingAreas: [...prev.stagingAreas, newArea]
    }));
  }, []);

  const updateStagingArea = useCallback((areaId: string, updates: Partial<StagingArea>) => {
    setCanvasState(prev => ({
      ...prev,
      stagingAreas: prev.stagingAreas.map(area =>
        area.id === areaId ? { ...area, ...updates } : area
      )
    }));
  }, []);

  const moveMaterial = useCallback((materialId: string, newPosition: { row: number; col: number; areaId: string }) => {
    setCanvasState(prev => {
      const updatedAreas = prev.stagingAreas.map(area => {
        // Remove material from current area
        const materialsWithoutMoved = area.materials.filter(m => m.id !== materialId);
        
        // Add material to new area if this is the target
        if (area.id === newPosition.areaId) {
          const material = prev.stagingAreas
            .flatMap(a => a.materials)
            .find(m => m.id === materialId);
          
          if (material) {
            const updatedMaterial = {
              ...material,
              gridPosition: newPosition
            };
            return {
              ...area,
              materials: [...materialsWithoutMoved, updatedMaterial]
            };
          }
        }
        
        return {
          ...area,
          materials: materialsWithoutMoved
        };
      });

      return {
        ...prev,
        stagingAreas: updatedAreas
      };
    });
  }, []);

  const resetView = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      scale: 1,
      position: { x: 0, y: 0 }
    }));
  }, []);

  return {
    canvasState,
    stageRef,
    updateScale,
    updatePosition,
    selectMaterial,
    clearSelection,
    addStagingArea,
    updateStagingArea,
    moveMaterial,
    resetView
  };
};