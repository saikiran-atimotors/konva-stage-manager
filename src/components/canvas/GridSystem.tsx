import React from 'react';
import { Group, Rect, Line, Text } from 'react-konva';
import { StagingArea, Material } from '@/types/material';

interface GridSystemProps {
  stagingArea: StagingArea;
  materials: Material[];
  onCellClick: (row: number, col: number) => void;
}

export const GridSystem: React.FC<GridSystemProps> = ({
  stagingArea,
  materials,
  onCellClick
}) => {
  const { position, rows, columns, cellSize, name } = stagingArea;
  const totalWidth = columns * cellSize.width;
  const totalHeight = rows * cellSize.height;

  const getMaterialInCell = (row: number, col: number): Material | undefined => {
    return materials.find(m => 
      m.gridPosition.row === row && 
      m.gridPosition.col === col
    );
  };

  const getCellColor = (row: number, col: number): string => {
    const material = getMaterialInCell(row, col);
    if (material) {
      switch (material.status) {
        case 'available': return '#10B981'; // green
        case 'reserved': return '#F59E0B'; // yellow
        case 'in-use': return '#EF4444'; // red
        default: return '#E5E7EB'; // gray
      }
    }
    return '#FFFFFF'; // white for empty cells
  };

  return (
    <Group x={position.x} y={position.y}>
      {/* Area Background */}
      <Rect
        x={0}
        y={0}
        width={totalWidth}
        height={totalHeight}
        fill="rgba(255, 255, 255, 0.8)"
        stroke="#D1D5DB"
        strokeWidth={2}
        cornerRadius={8}
        shadowBlur={10}
        shadowColor="rgba(0, 0, 0, 0.1)"
        shadowOffsetX={2}
        shadowOffsetY={2}
      />

      {/* Area Title */}
      <Text
        x={10}
        y={-30}
        text={name}
        fontSize={16}
        fontFamily="Inter, sans-serif"
        fontStyle="bold"
        fill="#374151"
      />

      {/* Grid Cells */}
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: columns }, (_, col) => {
          const x = col * cellSize.width;
          const y = row * cellSize.height;
          const material = getMaterialInCell(row, col);
          
          return (
            <Group key={`cell-${row}-${col}`}>
              {/* Cell Background */}
              <Rect
                x={x + 1}
                y={y + 1}
                width={cellSize.width - 2}
                height={cellSize.height - 2}
                fill={getCellColor(row, col)}
                stroke="#E5E7EB"
                strokeWidth={1}
                opacity={material ? 0.3 : 0.1}
                onClick={() => onCellClick(row, col)}
                onMouseEnter={(e) => {
                  e.target.opacity(material ? 0.5 : 0.2);
                  e.target.getLayer()?.batchDraw();
                }}
                onMouseLeave={(e) => {
                  e.target.opacity(material ? 0.3 : 0.1);
                  e.target.getLayer()?.batchDraw();
                }}
              />
              
              {/* Cell Coordinates (for debugging) */}
              {/* <Text
                x={x + 5}
                y={y + 5}
                text={`${row},${col}`}
                fontSize={10}
                fill="#9CA3AF"
                fontFamily="monospace"
              /> */}
            </Group>
          );
        })
      )}

      {/* Grid Lines */}
      {/* Vertical Lines */}
      {Array.from({ length: columns + 1 }, (_, i) => (
        <Line
          key={`v-line-${i}`}
          points={[i * cellSize.width, 0, i * cellSize.width, totalHeight]}
          stroke="#E5E7EB"
          strokeWidth={1}
          opacity={0.5}
        />
      ))}
      
      {/* Horizontal Lines */}
      {Array.from({ length: rows + 1 }, (_, i) => (
        <Line
          key={`h-line-${i}`}
          points={[0, i * cellSize.height, totalWidth, i * cellSize.height]}
          stroke="#E5E7EB"
          strokeWidth={1}
          opacity={0.5}
        />
      ))}
    </Group>
  );
};