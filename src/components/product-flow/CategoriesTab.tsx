import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Plus, Folder, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FormState } from "@/pages/ProductFlow";

interface CategoriesTabProps {
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
  onComplete: () => void;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface NewCategoryData {
  name: string;
  description: string;
}

export const CategoriesTab = ({ formState, updateFormState, onComplete }: CategoriesTabProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [newCategories, setNewCategories] = useState<NewCategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoadingData(true);
      const { data, error } = await supabase
        .from("product_categories")
        .select("id, name, description")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product categories."
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    setSelectedCategoryIds(prev => 
      checked 
        ? [...prev, categoryId]
        : prev.filter(id => id !== categoryId)
    );
  };

  const addNewCategory = () => {
    setNewCategories(prev => [...prev, { name: "", description: "" }]);
  };

  const removeNewCategory = (index: number) => {
    setNewCategories(prev => prev.filter((_, i) => i !== index));
  };

  const updateNewCategory = (index: number, field: keyof NewCategoryData, value: string) => {
    setNewCategories(prev => prev.map((cat, i) => 
      i === index ? { ...cat, [field]: value } : cat
    ));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let finalCategoryIds = [...selectedCategoryIds];

      // Create new categories if any
      if (newCategories.length > 0) {
        const validNewCategories = newCategories.filter(cat => cat.name.trim());
        
        if (validNewCategories.length > 0) {
          const { data: createdCategories, error: createError } = await supabase
            .from("product_categories")
            .insert(validNewCategories.map(cat => ({
              name: cat.name.trim(),
              description: cat.description.trim() || null
            })))
            .select("id");

          if (createError) throw createError;
          
          finalCategoryIds = [...finalCategoryIds, ...createdCategories.map(cat => cat.id)];
        }
      }

      // Note: In a real implementation, you might want to create a product_line_categories 
      // junction table to link product lines to categories. For now, we'll just store 
      // the category IDs in the form state for reference.
      updateFormState({ categoryIds: finalCategoryIds });

      toast({
        title: "Success!",
        description: `${finalCategoryIds.length} category/categories assigned to product line.`
      });

      onComplete();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign categories."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Product Categories</h2>
        <p className="text-muted-foreground">
          Assign your product line to relevant categories (optional).
        </p>
      </div>

      {/* Existing Categories */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Available Categories
            </CardTitle>
            <CardDescription>
              Select existing categories that apply to your product line.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map(category => (
                <div key={category.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategoryIds.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryToggle(category.id, checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label 
                      htmlFor={`category-${category.id}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </Label>
                    {category.description && (
                      <p className="text-xs text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Categories
              </CardTitle>
              <CardDescription>
                Add new product categories if existing ones don't fit your needs.
              </CardDescription>
            </div>
            <Button onClick={addNewCategory} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {newCategories.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No new categories added yet</p>
            </div>
          ) : (
            newCategories.map((category, index) => (
              <Card key={index} className="bg-muted/20">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`new-category-name-${index}`}>Category Name *</Label>
                      <Input
                        id={`new-category-name-${index}`}
                        value={category.name}
                        onChange={(e) => updateNewCategory(index, "name", e.target.value)}
                        placeholder="e.g., Dry Food, Treats, Supplements"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNewCategory(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label htmlFor={`new-category-desc-${index}`}>Description</Label>
                    <Textarea
                      id={`new-category-desc-${index}`}
                      value={category.description}
                      onChange={(e) => updateNewCategory(index, "description", e.target.value)}
                      placeholder="Optional description for this category"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          variant="premium"
          size="lg"
        >
          {isLoading ? "Saving..." : "Continue to Variants"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
