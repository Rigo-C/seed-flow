import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FormState } from "@/pages/ProductFlow";

interface NutritionalAnalysisTabProps {
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
  onComplete: () => void;
}

interface Variant {
  id: string;
  name: string;
}

export const NutritionalAnalysisTab = ({ formState, updateFormState, onComplete }: NutritionalAnalysisTabProps) => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set up basic variant data from form state for now
    if (formState.variantIds.length > 0) {
      setVariants(formState.variantIds.map((id, index) => ({
        id,
        name: `Variant ${index + 1}`
      })));
    }
  }, [formState.variantIds]);

  const handleSubmit = async () => {
    // For now, we'll skip nutritional analysis until the full schema is implemented
    toast({
      title: "Success!",
      description: "Nutritional analysis will be implemented with the full database schema."
    });

    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Nutritional Analysis</h2>
        <p className="text-muted-foreground">
          Add detailed nutritional information for each product variant.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Nutritional Data Configuration
          </CardTitle>
          <CardDescription>
            This section will be fully implemented once the database schema includes nutritional attributes and values tables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              Comprehensive nutritional analysis features including macronutrients, vitamins, minerals, and more.
            </p>
            <Badge variant="outline">
              Pending Database Schema Update
            </Badge>
          </div>

          {variants.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Variants Ready for Nutritional Data:</h4>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant, index) => (
                  <Badge key={variant.id} variant="secondary">
                    Variant {index + 1}
                  </Badge>
                ))}
              </div>
            </div>
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
          {isLoading ? "Saving..." : "Continue to Sources"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};