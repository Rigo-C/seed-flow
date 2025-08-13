import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Plus, Trash2, Settings, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FormState } from "@/pages/ProductFlow";

interface ProductOptionsTabProps {
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
  onComplete: () => void;
}

interface OptionValue {
  value: string;
}

interface OptionData {
  id?: string;
  name: string;
  label: string;
  dataType: string;
  unit: string;
  values: OptionValue[];
}

export const ProductOptionsTab = ({ formState, updateFormState, onComplete }: ProductOptionsTabProps) => {
  const [options, setOptions] = useState<OptionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const dataTypes = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "Yes/No" }
  ];

  const addOption = () => {
    setOptions(prev => [...prev, { 
      name: "", 
      label: "", 
      dataType: "text", 
      unit: "", 
      values: [{ value: "" }] 
    }]);
  };

  const removeOption = (index: number) => {
    setOptions(prev => prev.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: keyof OptionData, value: string) => {
    setOptions(prev => prev.map((option, i) => 
      i === index ? { ...option, [field]: value } : option
    ));
  };

  const addOptionValue = (optionIndex: number) => {
    setOptions(prev => prev.map((option, i) => 
      i === optionIndex 
        ? { ...option, values: [...option.values, { value: "" }] }
        : option
    ));
  };

  const removeOptionValue = (optionIndex: number, valueIndex: number) => {
    setOptions(prev => prev.map((option, i) => 
      i === optionIndex 
        ? { ...option, values: option.values.filter((_, vi) => vi !== valueIndex) }
        : option
    ));
  };

  const updateOptionValue = (optionIndex: number, valueIndex: number, value: string) => {
    setOptions(prev => prev.map((option, i) => 
      i === optionIndex 
        ? { 
            ...option, 
            values: option.values.map((val, vi) => 
              vi === valueIndex ? { value } : val
            ) 
          }
        : option
    ));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const validOptions = options.filter(option => 
        option.name.trim() && option.label.trim() && 
        option.values.some(v => v.value.trim())
      );
      
      // Allow proceeding without creating any options
      if (validOptions.length === 0) {
        updateFormState({ optionIds: [] });
        toast({
          title: "Success!",
          description: "Proceeding without product options."
        });
        onComplete();
        return;
      }

      const optionIds: string[] = [];

      for (const option of validOptions) {
        let optionId: string;

        // Check if option already exists
        const { data: existingOption } = await supabase
          .from("product_options")
          .select("id")
          .eq("name", option.name)
          .single();

        if (existingOption) {
          // Use existing option
          optionId = existingOption.id;
          optionIds.push(optionId);
        } else {
          // Create new option
          const { data: createdOption, error: optionError } = await supabase
            .from("product_options")
            .insert({
              name: option.name,
              label: option.label,
              data_type: option.dataType,
              unit: option.unit || null
            })
            .select("id")
            .single();

          if (optionError) throw optionError;
          optionId = createdOption.id;
          optionIds.push(optionId);
        }

        // Create option values (check for duplicates)
        const validValues = option.values.filter(v => v.value.trim());
        if (validValues.length > 0) {
          for (const val of validValues) {
            // Check if value already exists for this option
            const { data: existingValue } = await supabase
              .from("product_option_values")
              .select("id")
              .eq("product_option_id", optionId)
              .eq("value", val.value)
              .single();

            if (!existingValue) {
              // Create new value only if it doesn't exist
              const { error: valueError } = await supabase
                .from("product_option_values")
                .insert({
                  product_option_id: optionId,
                  value: val.value
                });

              if (valueError) throw valueError;
            }
          }
        }
      }

      updateFormState({ optionIds });

      toast({
        title: "Success!",
        description: `${validOptions.length} product option(s) created successfully.`
      });

      onComplete();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create product options."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Always allow proceeding - options are not required
  const isValid = true;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Product Options</h2>
        <p className="text-muted-foreground">
          Define the selectable attributes like size, flavor, weight, etc.
        </p>
      </div>

      {/* Options */}
      <div className="space-y-6">
        {options.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No product options yet</p>
                <p className="text-sm">Click "Add Option" to create selectable attributes, or continue without options.</p>
              </div>
            </CardContent>
          </Card>
        )}
        {options.map((option, optionIndex) => (
          <Card key={optionIndex}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5" />
                  Option {optionIndex + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(optionIndex)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Option Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor={`option-name-${optionIndex}`}>Option Name *</Label>
                  <Input
                    id={`option-name-${optionIndex}`}
                    value={option.name}
                    onChange={(e) => updateOption(optionIndex, "name", e.target.value)}
                    placeholder="weight"
                  />
                </div>
                <div>
                  <Label htmlFor={`option-label-${optionIndex}`}>Display Label *</Label>
                  <Input
                    id={`option-label-${optionIndex}`}
                    value={option.label}
                    onChange={(e) => updateOption(optionIndex, "label", e.target.value)}
                    placeholder="Weight"
                  />
                </div>
                <div>
                  <Label>Data Type</Label>
                  <Select 
                    value={option.dataType} 
                    onValueChange={(value) => updateOption(optionIndex, "dataType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dataTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`option-unit-${optionIndex}`}>Unit</Label>
                  <Input
                    id={`option-unit-${optionIndex}`}
                    value={option.unit}
                    onChange={(e) => updateOption(optionIndex, "unit", e.target.value)}
                    placeholder="lbs, oz, etc."
                  />
                </div>
              </div>

              {/* Option Values */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Option Values</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addOptionValue(optionIndex)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Value
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {option.values.map((value, valueIndex) => (
                    <div key={valueIndex} className="flex gap-2">
                      <Input
                        value={value.value}
                        onChange={(e) => updateOptionValue(optionIndex, valueIndex, e.target.value)}
                        placeholder="Enter value"
                      />
                      {option.values.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOptionValue(optionIndex, valueIndex)}
                          className="text-destructive hover:text-destructive px-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Option Button */}
      <div className="flex justify-center">
        <Button onClick={addOption} variant="outline" size="lg">
          <Plus className="h-4 w-4 mr-2" />
          {options.length === 0 ? "Add Option" : "Add Another Option"}
        </Button>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          variant="premium"
          size="lg"
        >
          {isLoading ? "Creating..." : "Continue to Variant Options"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};