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
    <div className="absolute top-4 right-4 flex flex-col gap-3 bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-elevated">
      {/* Header */}
      <div className="text-center">
        <div className="text-sm font-semibold text-foreground mb-1">Canvas Controls</div>
        <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
          {Math.round(scale * 100)}%
        </div>
      </div>
      
      {/* Zoom Controls */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-muted-foreground mb-1">Zoom</div>
        <div className="flex flex-col gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
            className="h-9 w-full justify-start gap-2 text-xs"
            title="Zoom In (Mouse wheel up)"
          >
            <ZoomIn className="h-3 w-3" />
            Zoom In
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
            className="h-9 w-full justify-start gap-2 text-xs"
            title="Zoom Out (Mouse wheel down)"
          >
            <ZoomOut className="h-3 w-3" />
            Zoom Out
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onResetView}
            className="h-9 w-full justify-start gap-2 text-xs"
            title="Reset View"
          >
            <RotateCcw className="h-3 w-3" />
            Reset View
          </Button>
        </div>
      </div>
      
      {/* Selection Info */}
      {selectedCount > 0 && (
        <div className="pt-3 border-t border-border">
          <div className="text-xs font-medium text-muted-foreground mb-2">Selection</div>
          <Badge variant="default" className="text-xs w-full justify-center bg-mts-primary">
            {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
          </Badge>
        </div>
      )}
      
      {/* Tool Mode */}
      <div className="pt-3 border-t border-border">
        <div className="text-xs font-medium text-muted-foreground mb-2">Active Tool</div>
        <div className="flex flex-col gap-1">
          <Button
            variant="default"
            size="sm"
            className="h-9 w-full justify-start gap-2 text-xs bg-mts-primary hover:bg-mts-primary-dark"
            title="Select Mode (Active)"
          >
            <MousePointer className="h-3 w-3" />
            Select Mode
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-full justify-start gap-2 text-xs"
            title="Pan Mode (Drag canvas)"
          >
            <Move className="h-3 w-3" />
            Pan Mode
          </Button>
        </div>
      </div>
      
      {/* Quick Help */}
      <div className="pt-3 border-t border-border">
        <div className="text-xs font-medium text-muted-foreground mb-2">Quick Help</div>
        <div className="text-xs text-muted-foreground space-y-1 leading-relaxed">
          <div className="flex justify-between">
            <span>Zoom:</span>
            <span className="text-foreground font-mono">Mouse wheel</span>
          </div>
          <div className="flex justify-between">
            <span>Pan:</span>
            <span className="text-foreground font-mono">Drag canvas</span>
          </div>
          <div className="flex justify-between">
            <span>Multi-select:</span>
            <span className="text-foreground font-mono">Ctrl+Click</span>
          </div>
          <div className="flex justify-between">
            <span>Move:</span>
            <span className="text-foreground font-mono">Drag material</span>
          </div>
        </div>
      </div>
    </div>
  );
};