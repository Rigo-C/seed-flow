import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Plus, Trash2, FlaskConical, Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FormState } from "@/pages/ProductFlow";

interface NutritionalAnalysisTabProps {
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
  onComplete: () => void;
}

interface NutrientData {
  key: string;
  value: string;
  unit: string;
}

export const NutritionalAnalysisTab = ({ formState, updateFormState, onComplete }: NutritionalAnalysisTabProps) => {
  const [nutrients, setNutrients] = useState<NutrientData[]>([
    { key: "protein", value: "", unit: "%" },
    { key: "fat", value: "", unit: "%" },
    { key: "fiber", value: "", unit: "%" },
    { key: "moisture", value: "", unit: "%" },
    { key: "ash", value: "", unit: "%" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const commonNutrients = [
    { key: "protein", label: "Protein", unit: "%" },
    { key: "fat", label: "Fat", unit: "%" },
    { key: "fiber", label: "Crude Fiber", unit: "%" },
    { key: "moisture", label: "Moisture", unit: "%" },
    { key: "ash", label: "Ash", unit: "%" },
    { key: "carbohydrates", label: "Carbohydrates", unit: "%" },
    { key: "calcium", label: "Calcium", unit: "%" },
    { key: "phosphorus", label: "Phosphorus", unit: "%" },
    { key: "sodium", label: "Sodium", unit: "%" },
    { key: "calories", label: "Calories", unit: "kcal/cup" },
    { key: "omega_3", label: "Omega-3 Fatty Acids", unit: "%" },
    { key: "omega_6", label: "Omega-6 Fatty Acids", unit: "%" }
  ];

  const addNutrient = () => {
    setNutrients(prev => [...prev, { key: "", value: "", unit: "%" }]);
  };

  const removeNutrient = (index: number) => {
    setNutrients(prev => prev.filter((_, i) => i !== index));
  };

  const updateNutrient = (index: number, field: keyof NutrientData, value: string) => {
    setNutrients(prev => prev.map((nutrient, i) => 
      i === index ? { ...nutrient, [field]: value } : nutrient
    ));
  };

  const getNutrientLabel = (key: string) => {
    const common = commonNutrients.find(n => n.key === key);
    return common ? common.label : key.charAt(0).toUpperCase() + key.slice(1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const validNutrients = nutrients.filter(nutrient => 
        nutrient.key.trim() && nutrient.value.trim()
      );
      
      if (validNutrients.length === 0) {
        toast({
          title: "Info",
          description: "No nutritional data to save. Proceeding to next step."
        });
        onComplete();
        return;
      }

      if (!formState.productLineId) {
        throw new Error("Product line ID is required to save nutritional analysis");
      }

      const insertData = validNutrients.map(nutrient => ({
        product_line_id: formState.productLineId,
        key: nutrient.key.toLowerCase().replace(/\s+/g, '_'),
        value: parseFloat(nutrient.value),
        unit: nutrient.unit || null
      }));

      const { error } = await supabase
        .from("nutritional_analysis")
        .insert(insertData);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `${validNutrients.length} nutritional value(s) saved successfully.`
      });

      onComplete();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save nutritional analysis."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Nutritional Analysis</h2>
        <p className="text-muted-foreground">
          Add nutritional information for your product line (optional).
        </p>
      </div>

      {/* Nutritional Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Nutritional Values
          </CardTitle>
          <CardDescription>
            Enter the nutritional analysis data. Common values are pre-filled for convenience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nutrients.map((nutrient, index) => (
              <Card key={index} className="bg-muted/20">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Label htmlFor={`nutrient-key-${index}`}>Nutrient</Label>
                      <Input
                        id={`nutrient-key-${index}`}
                        value={nutrient.key}
                        onChange={(e) => updateNutrient(index, "key", e.target.value)}
                        placeholder="protein, fat, etc."
                        list={`nutrient-suggestions-${index}`}
                      />
                      <datalist id={`nutrient-suggestions-${index}`}>
                        {commonNutrients.map(n => (
                          <option key={n.key} value={n.key}>{n.label}</option>
                        ))}
                      </datalist>
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={`nutrient-value-${index}`}>Value</Label>
                      <Input
                        id={`nutrient-value-${index}`}
                        type="number"
                        step="0.01"
                        value={nutrient.value}
                        onChange={(e) => updateNutrient(index, "value", e.target.value)}
                        placeholder="25.0"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={`nutrient-unit-${index}`}>Unit</Label>
                      <Input
                        id={`nutrient-unit-${index}`}
                        value={nutrient.unit}
                        onChange={(e) => updateNutrient(index, "unit", e.target.value)}
                        placeholder="%, mg, etc."
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNutrient(index)}
                        className="text-destructive hover:text-destructive h-9 w-9 p-0"
                        disabled={nutrients.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {nutrient.key && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Display as: {getNutrientLabel(nutrient.key)}
                      {nutrient.value && `: ${nutrient.value}${nutrient.unit}`}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button onClick={addNutrient} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Nutrient
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Fill */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Quick Fill Common Values
          </CardTitle>
          <CardDescription>
            Click to quickly add common nutritional components if not already present.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {commonNutrients.map(common => {
              const exists = nutrients.some(n => n.key === common.key);
              return (
                <Button
                  key={common.key}
                  variant={exists ? "secondary" : "outline"}
                  size="sm"
                  disabled={exists}
                  onClick={() => {
                    if (!exists) {
                      setNutrients(prev => [...prev, { 
                        key: common.key, 
                        value: "", 
                        unit: common.unit 
                      }]);
                    }
                  }}
                >
                  {common.label} {exists && "✓"}
                </Button>
              );
            })}
          </div>
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
          {isLoading ? "Saving..." : "Continue to Options"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};