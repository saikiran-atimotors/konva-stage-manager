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
        x={-20}
        y={-50}
        width={totalWidth + 40}
        height={totalHeight + 70}
        fill="rgba(248, 250, 252, 0.95)"
        stroke="#CBD5E1"
        strokeWidth={2}
        cornerRadius={12}
        shadowBlur={15}
        shadowColor="rgba(0, 0, 0, 0.08)"
        shadowOffsetX={0}
        shadowOffsetY={4}
      />

      {/* Area Title */}
      <Text
        x={0}
        y={-35}
        text={name}
        fontSize={18}
        fontFamily="Inter, sans-serif"
        fontStyle="600"
        fill="#1E293B"
      />
      
      {/* Area Info */}
      <Text
        x={0}
        y={-15}
        text={`${rows}×${columns} Grid • ${materials.length} Materials`}
        fontSize={12}
        fontFamily="Inter, sans-serif"
        fill="#64748B"
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
                x={x + 2}
                y={y + 2}
                width={cellSize.width - 4}
                height={cellSize.height - 4}
                fill={material ? "rgba(59, 130, 246, 0.05)" : "rgba(255, 255, 255, 0.8)"}
                stroke={material ? "#3B82F6" : "#E2E8F0"}
                strokeWidth={material ? 2 : 1}
                cornerRadius={6}
                opacity={material ? 0.8 : 0.6}
                onClick={() => onCellClick(row, col)}
                onMouseEnter={(e) => {
                  const target = e.target as any;
                  target.fill(material ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.03)");
                  target.stroke("#3B82F6");
                  target.strokeWidth(2);
                  target.getLayer()?.batchDraw();
                }}
                onMouseLeave={(e) => {
                  const target = e.target as any;
                  target.fill(material ? "rgba(59, 130, 246, 0.05)" : "rgba(255, 255, 255, 0.8)");
                  target.stroke(material ? "#3B82F6" : "#E2E8F0");
                  target.strokeWidth(material ? 2 : 1);
                  target.getLayer()?.batchDraw();
                }}
              />
              
              {/* Cell Grid Reference */}
              <Text
                x={x + 4}
                y={y + 4}
                text={`${String.fromCharCode(65 + row)}${col + 1}`}
                fontSize={9}
                fill="#94A3B8"
                fontFamily="Inter, sans-serif"
                fontStyle="500"
              />
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
          stroke="#CBD5E1"
          strokeWidth={i === 0 || i === columns ? 2 : 1}
          opacity={0.6}
        />
      ))}
      
      {/* Horizontal Lines */}
      {Array.from({ length: rows + 1 }, (_, i) => (
        <Line
          key={`h-line-${i}`}
          points={[0, i * cellSize.height, totalWidth, i * cellSize.height]}
          stroke="#CBD5E1"
          strokeWidth={i === 0 || i === rows ? 2 : 1}
          opacity={0.6}
        />
      ))}
    </Group>
  );
};