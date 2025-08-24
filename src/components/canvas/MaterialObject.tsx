import React, { useRef, useCallback } from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import { Material, StagingArea } from '@/types/material';

interface MaterialObjectProps {
  material: Material;
  isSelected: boolean;
  onSelect: (id: string, multiSelect: boolean) => void;
  onMove: (materialId: string, newPosition: { row: number; col: number; areaId: string }) => void;
  stagingAreas: StagingArea[];
}

export const MaterialObject: React.FC<MaterialObjectProps> = ({
  material,
  isSelected,
  onSelect,
  onMove,
  stagingAreas
}) => {
  const groupRef = useRef<any>();
  
  const getPosition = () => {
    const area = stagingAreas.find(a => a.id === material.gridPosition.areaId);
    if (!area) return { x: 0, y: 0 };
    
    return {
      x: area.position.x + (material.gridPosition.col * area.cellSize.width) + (area.cellSize.width / 2),
      y: area.position.y + (material.gridPosition.row * area.cellSize.height) + (area.cellSize.height / 2)
    };
  };

  const getStatusColor = () => {
    switch (material.status) {
      case 'available': return '#10B981';
      case 'reserved': return '#F59E0B';
      case 'in-use': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleClick = useCallback((e: any) => {
    e.cancelBubble = true;
    const multiSelect = e.evt.ctrlKey || e.evt.metaKey;
    onSelect(material.id, multiSelect);
  }, [material.id, onSelect]);

  const handleDragStart = useCallback(() => {
    if (!isSelected) {
      onSelect(material.id, false);
    }
  }, [isSelected, material.id, onSelect]);

  const handleDragEnd = useCallback((e: any) => {
    const node = e.target;
    const newX = node.x();
    const newY = node.y();
    
    // Find which staging area and cell this position corresponds to
    for (const area of stagingAreas) {
      const relativeX = newX - area.position.x;
      const relativeY = newY - area.position.y;
      
      if (relativeX >= 0 && relativeY >= 0 && 
          relativeX <= area.columns * area.cellSize.width &&
          relativeY <= area.rows * area.cellSize.height) {
        
        const col = Math.floor(relativeX / area.cellSize.width);
        const row = Math.floor(relativeY / area.cellSize.height);
        
        if (col >= 0 && col < area.columns && row >= 0 && row < area.rows) {
          onMove(material.id, { row, col, areaId: area.id });
          return;
        }
      }
    }
    
    // If no valid position found, reset to original position
    const position = getPosition();
    node.x(position.x);
    node.y(position.y);
  }, [material.id, onMove, stagingAreas]);

  const position = getPosition();
  const statusColor = getStatusColor();

  return (
    <Group
      ref={groupRef}
      x={position.x}
      y={position.y}
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={(e) => {
        e.target.getStage()!.container().style.cursor = 'grab';
      }}
      onMouseLeave={(e) => {
        e.target.getStage()!.container().style.cursor = 'default';
      }}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <Rect
          x={-(material.size?.width || 70) / 2 - 8}
          y={-(material.size?.height || 50) / 2 - 8}
          width={(material.size?.width || 70) + 16}
          height={(material.size?.height || 50) + 16}
          stroke="#3B82F6"
          strokeWidth={3}
          cornerRadius={12}
          shadowBlur={12}
          shadowColor="#3B82F6"
          shadowOpacity={0.3}
          fill="rgba(59, 130, 246, 0.05)"
        />
      )}
      
      {/* Material Body */}
      <Rect
        x={-(material.size?.width || 70) / 2}
        y={-(material.size?.height || 50) / 2}
        width={material.size?.width || 70}
        height={material.size?.height || 50}
        fill={material.color || statusColor}
        stroke="#FFFFFF"
        strokeWidth={3}
        cornerRadius={8}
        shadowBlur={8}
        shadowColor="rgba(0, 0, 0, 0.15)"
        shadowOffsetX={0}
        shadowOffsetY={4}
        opacity={0.95}
      />
      
      {/* Material Name */}
      <Text
        x={-(material.size?.width || 70) / 2 + 8}
        y={-(material.size?.height || 50) / 2 + 8}
        text={material.name}
        fontSize={11}
        fontFamily="Inter, sans-serif"
        fontStyle="600"
        fill="#FFFFFF"
        width={(material.size?.width || 70) - 16}
        align="center"
        wrap="word"
        ellipsis
      />
      
      {/* Material Type */}
      <Text
        x={-(material.size?.width || 70) / 2 + 8}
        y={-(material.size?.height || 50) / 2 + 22}
        text={material.type}
        fontSize={8}
        fontFamily="Inter, sans-serif"
        fill="rgba(255, 255, 255, 0.8)"
        width={(material.size?.width || 70) - 16}
        align="center"
        ellipsis
      />
      
      {/* Quantity Badge */}
      <Circle
        x={(material.size?.width || 70) / 2 - 12}
        y={-(material.size?.height || 50) / 2 + 12}
        radius={10}
        fill="#FFFFFF"
        stroke={statusColor}
        strokeWidth={2}
        shadowBlur={4}
        shadowColor="rgba(0, 0, 0, 0.1)"
      />
      
      <Text
        x={(material.size?.width || 70) / 2 - 12 - 6}
        y={-(material.size?.height || 50) / 2 + 12 - 5}
        text={material.quantity.toString()}
        fontSize={9}
        fontFamily="Inter, sans-serif"
        fontStyle="700"
        fill={statusColor}
        width={12}
        align="center"
      />
      
      {/* Status Indicator Bar */}
      <Rect
        x={-(material.size?.width || 70) / 2}
        y={(material.size?.height || 50) / 2 - 6}
        width={material.size?.width || 70}
        height={6}
        fill={statusColor}
        cornerRadius={[0, 0, 8, 8]}
        opacity={0.9}
      />
      
      {/* Barcode/ID */}
      {material.barcode && (
        <Text
          x={-(material.size?.width || 70) / 2 + 4}
          y={(material.size?.height || 50) / 2 - 18}
          text={material.barcode}
          fontSize={7}
          fontFamily="Inter, sans-serif"
          fontStyle="500"
          fill="rgba(255, 255, 255, 0.7)"
        />
      )}
    </Group>
  );
};