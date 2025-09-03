import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Shield, Leaf, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FormState } from "@/pages/ProductFlow";

interface ProductRatingTabProps {
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
  onComplete: () => void;
}

export const ProductRatingTab = ({ formState, updateFormState, onComplete }: ProductRatingTabProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // For now, we'll skip product rating until the full schema is implemented
    toast({
      title: "Success!",
      description: "Product data seed workflow completed successfully!"
    });

    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Product Rating</h2>
        <p className="text-muted-foreground">
          Set comprehensive quality and safety ratings for your product line.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Rating System Configuration
          </CardTitle>
          <CardDescription>
            This section will be fully implemented once the database schema includes the product ratings table.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              Comprehensive product rating system including ingredient quality, nutritional balance, processing scores, and safety factors.
            </p>
            <Badge variant="outline">
              Pending Database Schema Update
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Safety Score</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Ingredient Quality</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Nutritional Balance</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Overall Rating</span>
                </div>
              </CardContent>
            </Card>
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
          {isLoading ? "Completing..." : "Complete Workflow"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};