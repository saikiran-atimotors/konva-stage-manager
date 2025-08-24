import React, { useState, useRef, useEffect } from 'react';
import { Plus, Settings, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StagingAreaCanvas } from '@/components/canvas/StagingAreaCanvas';
import { MaterialForm } from '@/components/forms/MaterialForm';
import { SearchFilterPanel } from '@/components/forms/SearchFilterPanel';
import { useMaterials } from '@/hooks/useMaterials';
import { useToast } from '@/hooks/use-toast';
import { Material } from '@/types/material';

const MaterialTrackingSystem: React.FC = () => {
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { createMaterial, updateMaterial, isLoading } = useMaterials();
  const { toast } = useToast();

  // Update canvas size based on container
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasContainerRef.current) {
        const rect = canvasContainerRef.current.getBoundingClientRect();
        setCanvasSize({
          width: rect.width,
          height: Math.max(600, rect.height)
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const handleCreateMaterial = async (materialData: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createMaterial(materialData);
      setIsCreateDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Material created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create material',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateMaterial = async (materialData: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedMaterial) return;
    
    try {
      await updateMaterial(selectedMaterial.id, materialData);
      setSelectedMaterial(undefined);
      toast({
        title: 'Success',
        description: 'Material updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update material',
        variant: 'destructive',
      });
    }
  };

  const handleMaterialSelect = (material: Material) => {
    setSelectedMaterial(material);
  };

  return (
    <div className="min-h-screen bg-gradient-canvas">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-5 w-5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl font-bold text-foreground">
                Material Tracking System
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-mts-primary hover:bg-mts-primary-dark">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Material</DialogTitle>
                  </DialogHeader>
                  <MaterialForm
                    onSubmit={handleCreateMaterial}
                    onCancel={() => setIsCreateDialogOpen(false)}
                    isLoading={isLoading}
                  />
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Search & Filters */}
          <div className="lg:col-span-1 space-y-6">
            <SearchFilterPanel 
              onMaterialSelect={handleMaterialSelect}
              className="animate-fade-in-up"
            />
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3">
            <div 
              ref={canvasContainerRef}
              className="w-full h-[calc(100vh-200px)] min-h-[600px] animate-scale-in"
            >
              <StagingAreaCanvas
                width={canvasSize.width}
                height={canvasSize.height}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Material Dialog */}
      <Dialog open={!!selectedMaterial} onOpenChange={() => setSelectedMaterial(undefined)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
          </DialogHeader>
          {selectedMaterial && (
            <MaterialForm
              material={selectedMaterial}
              onSubmit={handleUpdateMaterial}
              onCancel={() => setSelectedMaterial(undefined)}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaterialTrackingSystem;