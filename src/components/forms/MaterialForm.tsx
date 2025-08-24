import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Material } from '@/types/material';

const materialSchema = z.object({
  name: z.string().min(1, 'Material name is required'),
  type: z.string().min(1, 'Material type is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  status: z.enum(['available', 'reserved', 'in-use']),
  barcode: z.string().optional(),
  properties: z.string().optional(),
  gridPosition: z.object({
    row: z.number().min(0),
    col: z.number().min(0),
    areaId: z.string()
  }),
  color: z.string().optional()
});

type MaterialFormData = z.infer<typeof materialSchema>;

interface MaterialFormProps {
  material?: Material;
  onSubmit: (data: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const MaterialForm: React.FC<MaterialFormProps> = ({
  material,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: material?.name || '',
      type: material?.type || '',
      quantity: material?.quantity || 1,
      status: material?.status || 'available',
      barcode: material?.barcode || '',
      properties: material?.properties ? JSON.stringify(material.properties, null, 2) : '',
      gridPosition: material?.gridPosition || { row: 0, col: 0, areaId: 'area-1' },
      color: material?.color || '#10B981'
    }
  });

  const handleSubmit = (data: MaterialFormData) => {
    let parsedProperties = {};
    if (data.properties) {
      try {
        parsedProperties = JSON.parse(data.properties);
      } catch (e) {
        // If JSON parsing fails, treat as simple string
        parsedProperties = { notes: data.properties };
      }
    }

    const materialData = {
      name: data.name,
      type: data.type,
      quantity: data.quantity,
      status: data.status,
      barcode: data.barcode,
      properties: parsedProperties,
      gridPosition: {
        row: data.gridPosition.row,
        col: data.gridPosition.col,
        areaId: data.gridPosition.areaId
      },
      color: data.color,
      size: material?.size || { width: 60, height: 40 }
    };

    onSubmit(materialData);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{material ? 'Edit Material' : 'Create New Material'}</CardTitle>
        <CardDescription>
          {material 
            ? 'Update the material information below'
            : 'Add a new material to the tracking system'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Steel Beam A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Structural, Foundation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="in-use">In Use</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode/ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SB001" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for scanning
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input 
                        type="color" 
                        {...field}
                        className="h-10 w-20"
                      />
                    </FormControl>
                    <FormDescription>
                      Visual color on canvas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="properties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Properties (JSON)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder='{"length": "6m", "weight": "250kg", "notes": "Handle with care"}'
                      className="min-h-[100px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional properties in JSON format, or simple notes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-mts-primary hover:bg-mts-primary-dark"
              >
                {isLoading ? 'Saving...' : material ? 'Update Material' : 'Create Material'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};