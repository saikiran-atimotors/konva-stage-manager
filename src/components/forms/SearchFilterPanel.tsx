import React, { useState } from 'react';
import { Search, Filter, SortAsc, Grid3X3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Material } from '@/types/material';
import { useMaterials } from '@/hooks/useMaterials';

interface SearchFilterPanelProps {
  onMaterialSelect?: (material: Material) => void;
  className?: string;
}

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  onMaterialSelect,
  className = ''
}) => {
  const { materials, searchMaterials, getMaterialsByStatus } = useMaterials();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredMaterials = React.useMemo(() => {
    let result = searchQuery ? searchMaterials(searchQuery) : materials;
    
    if (statusFilter !== 'all') {
      result = result.filter(m => m.status === statusFilter);
    }
    
    if (typeFilter !== 'all') {
      result = result.filter(m => m.type === typeFilter);
    }
    
    // Sort results
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'quantity':
          return b.quantity - a.quantity;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
    
    return result;
  }, [searchQuery, statusFilter, typeFilter, sortBy, materials, searchMaterials]);

  const getStatusColor = (status: Material['status']) => {
    switch (status) {
      case 'available': return 'bg-material-available text-white';
      case 'reserved': return 'bg-material-reserved text-white';
      case 'in-use': return 'bg-material-in-use text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const uniqueTypes = Array.from(new Set(materials.map(m => m.type)));

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Grid3X3 className="h-5 w-5" />
          Material Search & Filter
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, type, or barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Toggle */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </span>
              <span className="text-xs text-muted-foreground">
                {filteredMaterials.length} of {materials.length}
              </span>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 mt-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="in-use">In Use</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="quantity">Quantity</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Results */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Grid3X3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No materials found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredMaterials.map(material => (
              <div
                key={material.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onMaterialSelect?.(material)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{material.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {material.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Qty: {material.quantity}</span>
                    {material.barcode && (
                      <span>• ID: {material.barcode}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`text-xs ${getStatusColor(material.status)}`}
                  >
                    {material.status}
                  </Badge>
                  <div 
                    className="w-4 h-4 rounded border-2 border-white shadow-sm"
                    style={{ backgroundColor: material.color }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-bold text-material-available">
              {getMaterialsByStatus('available').length}
            </div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-material-reserved">
              {getMaterialsByStatus('reserved').length}
            </div>
            <div className="text-xs text-muted-foreground">Reserved</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-material-in-use">
              {getMaterialsByStatus('in-use').length}
            </div>
            <div className="text-xs text-muted-foreground">In Use</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};