import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Move, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CanvasControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  selectedCount: number;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onResetView,
  selectedCount
}) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 bg-card border border-border rounded-lg p-2 shadow-elevated">
      {/* Zoom Level Display */}
      <div className="text-xs text-muted-foreground text-center font-mono">
        {Math.round(scale * 100)}%
      </div>
      
      {/* Zoom Controls */}
      <div className="flex flex-col gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
          className="p-2 h-8 w-8"
          title="Zoom In"
        >
          <ZoomIn className="h-3 w-3" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          className="p-2 h-8 w-8"
          title="Zoom Out"
        >
          <ZoomOut className="h-3 w-3" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onResetView}
          className="p-2 h-8 w-8"
          title="Reset View"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Selection Info */}
      {selectedCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          {selectedCount} selected
        </Badge>
      )}
      
      {/* Tool Mode Indicators */}
      <div className="flex flex-col gap-1 pt-2 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">Tools</div>
        
        <Button
          variant="default"
          size="sm"
          className="p-2 h-8 w-8"
          title="Select Mode (Active)"
        >
          <MousePointer className="h-3 w-3" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="p-2 h-8 w-8"
          title="Pan Mode"
        >
          <Move className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Instructions */}
      <div className="text-xs text-muted-foreground text-center max-w-24 leading-tight">
        <div>Mouse wheel: Zoom</div>
        <div>Drag: Pan</div>
        <div>Ctrl+Click: Multi-select</div>
      </div>
    </div>
  );
};