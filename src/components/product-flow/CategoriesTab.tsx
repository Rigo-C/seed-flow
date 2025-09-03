import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, Tag, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FormState } from "@/pages/ProductFlow";

interface CategoriesTabProps {
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
  onComplete: () => void;
}

export const CategoriesTab = ({ formState, updateFormState, onComplete }: CategoriesTabProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // For now, we'll use predefined categories until the database schema is fully updated
  const predefinedCategories = [
    { id: "dry-food", name: "Dry Food", description: "Kibble and dry pet food products", target_species: ["dog", "cat"] },
    { id: "wet-food", name: "Wet Food", description: "Canned and wet food products", target_species: ["dog", "cat"] },
    { id: "treats", name: "Treats & Snacks", description: "Training treats and snacks", target_species: ["dog", "cat"] },
    { id: "supplements", name: "Supplements", description: "Health and nutrition supplements", target_species: ["dog", "cat"] },
    { id: "raw-food", name: "Raw Food", description: "Raw and freeze-dried foods", target_species: ["dog", "cat"] }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      
      updateFormState({ categoryIds: newSelection });
      return newSelection;
    });
  };

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one category."
      });
      return;
    }

    // For now, we'll just store the category selection in the form state
    // until the full database schema is implemented
    toast({
      title: "Success!",
      description: `${selectedCategories.length} categories selected successfully.`
    });

    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Product Categories</h2>
        <p className="text-muted-foreground">
          Assign your product line to relevant categories for better organization and discoverability.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Available Categories
          </CardTitle>
          <CardDescription>
            Select categories that best describe your product line
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predefinedCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50"
              >
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label htmlFor={category.id} className="font-medium cursor-pointer">
                    {category.name}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {category.target_species.map(species => (
                      <span 
                        key={species}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                      >
                        <Leaf className="h-3 w-3 mr-1" />
                        {species.charAt(0).toUpperCase() + species.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {selectedCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              {selectedCategories.length} categories selected
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categoryId, index) => {
                const category = predefinedCategories.find(c => c.id === categoryId);
                return category ? (
                  <span 
                    key={categoryId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/20 text-primary"
                  >
                    {index === 0 && "⭐ "}
                    {category.name}
                    {index === 0 && " (Primary)"}
                  </span>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={selectedCategories.length === 0 || isLoading}
          variant="premium"
          size="lg"
        >
          {isLoading ? "Assigning..." : "Continue to Identifiers"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};