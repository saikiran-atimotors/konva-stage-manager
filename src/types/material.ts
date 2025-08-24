export interface Material {
  id: string;
  name: string;
  type: string;
  quantity: number;
  status: 'available' | 'reserved' | 'in-use';
  barcode?: string;
  gridPosition: { row: number; col: number; areaId: string };
  properties: Record<string, any>;
  color?: string;
  size?: { width: number; height: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface StagingArea {
  id: string;
  name: string;
  rows: number;
  columns: number;
  cellSize: { width: number; height: number };
  position: { x: number; y: number };
  color?: string;
  materials: Material[];
}

export interface GridCell {
  row: number;
  col: number;
  areaId: string;
  material?: Material;
  isEmpty: boolean;
}

export interface CanvasState {
  scale: number;
  position: { x: number; y: number };
  selectedMaterials: string[];
  stagingAreas: StagingArea[];
  draggedMaterial?: Material;
}