import { useState, useCallback } from 'react';
import { Material } from '@/types/material';

const sampleMaterials: Material[] = [
  {
    id: 'mat-1',
    name: 'Steel Beam A',
    type: 'Structural',
    quantity: 10,
    status: 'available',
    barcode: 'SB001',
    gridPosition: { row: 0, col: 0, areaId: 'area-1' },
    properties: { length: '6m', weight: '250kg' },
    color: '#10B981',
    size: { width: 60, height: 40 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'mat-2',
    name: 'Concrete Block B',
    type: 'Foundation',
    quantity: 25,
    status: 'reserved',
    barcode: 'CB002',
    gridPosition: { row: 1, col: 2, areaId: 'area-1' },
    properties: { dimensions: '40x20x20cm', weight: '18kg' },
    color: '#F59E0B',
    size: { width: 50, height: 50 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'mat-3',
    name: 'Wire Mesh C',
    type: 'Reinforcement',
    quantity: 5,
    status: 'in-use',
    barcode: 'WM003',
    gridPosition: { row: 3, col: 1, areaId: 'area-1' },
    properties: { mesh: '6x6mm', area: '2x3m' },
    color: '#EF4444',
    size: { width: 70, height: 30 },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const useMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>(sampleMaterials);
  const [isLoading, setIsLoading] = useState(false);

  const createMaterial = useCallback(async (materialData: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMaterial: Material = {
      ...materialData,
      id: `mat-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setMaterials(prev => [...prev, newMaterial]);
    setIsLoading(false);
    return newMaterial;
  }, []);

  const updateMaterial = useCallback(async (id: string, updates: Partial<Material>) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setMaterials(prev => prev.map(material => 
      material.id === id 
        ? { ...material, ...updates, updatedAt: new Date() }
        : material
    ));
    
    setIsLoading(false);
  }, []);

  const deleteMaterial = useCallback(async (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setMaterials(prev => prev.filter(material => material.id !== id));
    setIsLoading(false);
  }, []);

  const getMaterialById = useCallback((id: string) => {
    return materials.find(material => material.id === id);
  }, [materials]);

  const getMaterialsByStatus = useCallback((status: Material['status']) => {
    return materials.filter(material => material.status === status);
  }, [materials]);

  const searchMaterials = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return materials.filter(material =>
      material.name.toLowerCase().includes(lowercaseQuery) ||
      material.type.toLowerCase().includes(lowercaseQuery) ||
      material.barcode?.toLowerCase().includes(lowercaseQuery)
    );
  }, [materials]);

  return {
    materials,
    isLoading,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialById,
    getMaterialsByStatus,
    searchMaterials
  };
};