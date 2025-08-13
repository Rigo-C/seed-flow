import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Tag, Link } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FormState } from "@/pages/ProductFlow";

interface VariantOptionsTabProps {
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
  onComplete: () => void;
}

interface Variant {
  id: string;
  name: string;
}

interface ProductOption {
  id: string;
  name: string;
  label: string;
  values: { id: string; value: string }[];
}

interface VariantOptionAssignment {
  variantId: string;
  optionId: string;
  valueId: string;
}

export const VariantOptionsTab = ({ formState, updateFormState, onComplete }: VariantOptionsTabProps) => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [assignments, setAssignments] = useState<VariantOptionAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    loadData();
  }, [formState.variantIds, formState.optionIds]);

  const loadData = async () => {
    try {
      setIsLoadingData(true);

      // Load variants
      if (formState.variantIds.length > 0) {
        const { data: variantsData, error: variantsError } = await supabase
          .from("product_variants")
          .select("id, name")
          .in("id", formState.variantIds);

        if (variantsError) throw variantsError;
        setVariants(variantsData || []);
      }

      // Load product options and their values
      if (formState.optionIds.length > 0) {
        const { data: optionsData, error: optionsError } = await supabase
          .from("product_options")
          .select(`
            id,
            name,
            label,
            product_option_values (
              id,
              value
            )
          `)
          .in("id", formState.optionIds);

        if (optionsError) throw optionsError;

        const formattedOptions = optionsData?.map(option => ({
          id: option.id,
          name: option.name,
          label: option.label,
          values: option.product_option_values || []
        })) || [];

        setProductOptions(formattedOptions);

        // Initialize assignments
        const initialAssignments: VariantOptionAssignment[] = [];
        formState.variantIds.forEach(variantId => {
          formattedOptions.forEach(option => {
            initialAssignments.push({
              variantId,
              optionId: option.id,
              valueId: ""
            });
          });
        });
        setAssignments(initialAssignments);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load variants and options."
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const updateAssignment = (variantId: string, optionId: string, valueId: string) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.variantId === variantId && assignment.optionId === optionId
        ? { ...assignment, valueId }
        : assignment
    ));
  };

  const getAssignmentValue = (variantId: string, optionId: string) => {
    const assignment = assignments.find(a => 
      a.variantId === variantId && a.optionId === optionId
    );
    return assignment?.valueId || "";
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const validAssignments = assignments.filter(a => a.valueId);
      
      // Allow skipping if using existing brand/product line and no assignments made
      if (validAssignments.length === 0) {
        if (!formState.isNewProductLine) {
          // Skip variant option assignments for existing product lines
          toast({
            title: "Success!",
            description: "Proceeding without variant option assignments."
          });
          onComplete();
          return;
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Please assign at least one option value to a variant."
          });
          return;
        }
      }

      const insertData = validAssignments.map(assignment => ({
        product_variant_id: assignment.variantId,
        product_option_value_id: assignment.valueId
      }));

      const { error } = await supabase
        .from("product_variant_options")
        .insert(insertData);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `${validAssignments.length} variant option assignment(s) created successfully.`
      });

      onComplete();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create variant option assignments."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Allow proceeding if using existing product line or if assignments are made
  const isValid = !formState.isNewProductLine || assignments.some(a => a.valueId);

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading variants and options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Variant Options</h2>
        <p className="text-muted-foreground">
          Assign specific option values to each product variant.
          {!formState.isNewProductLine && " You can skip this step if just adding ingredients to existing variants."}
        </p>
      </div>

      {/* Assignment Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Option Assignments
          </CardTitle>
          <CardDescription>
            Select the appropriate option values for each variant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {variants.length === 0 || productOptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No variants or options available. Please complete the previous steps first.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {variants.map(variant => (
                <Card key={variant.id} className="bg-muted/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Tag className="h-5 w-5" />
                      {variant.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {productOptions.map(option => (
                        <div key={option.id}>
                          <Label className="text-sm font-medium">
                            {option.label}
                          </Label>
                          <Select
                            value={getAssignmentValue(variant.id, option.id)}
                            onValueChange={(value) => updateAssignment(variant.id, option.id, value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder={`Select ${option.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {option.values.map(value => (
                                <SelectItem key={value.id} value={value.id}>
                                  {value.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        {!formState.isNewProductLine && (
          <p className="text-sm text-muted-foreground">
            Skip variant options if only adding ingredients to existing variants
          </p>
        )}
        <div className="flex gap-3 ml-auto">
          {!formState.isNewProductLine && (
            <Button
              onClick={onComplete}
              variant="outline"
              size="lg"
            >
              Skip to Ingredients
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            variant="premium"
            size="lg"
          >
            {isLoading ? "Saving..." : "Continue to Ingredients"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};