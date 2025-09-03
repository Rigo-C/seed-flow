import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Star, TrendingUp, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FormState } from "@/pages/ProductFlow";

interface ProductRatingTabProps {
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
  onComplete: () => void;
}

interface RatingFactors {
  overall_quality: number;
  ingredient_quality: number;
  nutritional_value: number;
  price_value: number;
  palatability: number;
  digestibility: number;
  packaging: number;
  availability: number;
  brand_reputation: number;
  [key: string]: number;
}

export const ProductRatingTab = ({ formState, updateFormState, onComplete }: ProductRatingTabProps) => {
  const [overallScore, setOverallScore] = useState<number>(5);
  const [ratingFactors, setRatingFactors] = useState<RatingFactors>({
    overall_quality: 5,
    ingredient_quality: 5,
    nutritional_value: 5,
    price_value: 5,
    palatability: 5,
    digestibility: 5,
    packaging: 5,
    availability: 5,
    brand_reputation: 5
  });
  const [customFactors, setCustomFactors] = useState<Array<{key: string; value: number}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const ratingCategories = [
    { key: "overall_quality", label: "Overall Quality", description: "General product quality assessment" },
    { key: "ingredient_quality", label: "Ingredient Quality", description: "Quality and sourcing of ingredients" },
    { key: "nutritional_value", label: "Nutritional Value", description: "Completeness and balance of nutrition" },
    { key: "price_value", label: "Price/Value Ratio", description: "Value for money compared to alternatives" },
    { key: "palatability", label: "Palatability", description: "How much pets typically enjoy this food" },
    { key: "digestibility", label: "Digestibility", description: "How easily pets can digest this food" },
    { key: "packaging", label: "Packaging Quality", description: "Quality and convenience of packaging" },
    { key: "availability", label: "Availability", description: "How easy it is to find and purchase" },
    { key: "brand_reputation", label: "Brand Reputation", description: "Brand's reputation and trustworthiness" }
  ];

  const updateRatingFactor = (key: string, value: number) => {
    setRatingFactors(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addCustomFactor = () => {
    setCustomFactors(prev => [...prev, { key: "", value: 5 }]);
  };

  const removeCustomFactor = (index: number) => {
    setCustomFactors(prev => prev.filter((_, i) => i !== index));
  };

  const updateCustomFactor = (index: number, field: 'key' | 'value', value: string | number) => {
    setCustomFactors(prev => prev.map((factor, i) => 
      i === index ? { ...factor, [field]: value } : factor
    ));
  };

  const calculateAverageScore = () => {
    const allFactors = [...Object.values(ratingFactors), ...customFactors.map(f => f.value)];
    return allFactors.length > 0 ? 
      Math.round((allFactors.reduce((sum, score) => sum + score, 0) / allFactors.length) * 10) / 10 : 5;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!formState.productLineId) {
        throw new Error("Product line ID is required to save rating");
      }

      // Combine standard and custom factors
      const allFactors = { ...ratingFactors };
      customFactors.forEach(factor => {
        if (factor.key.trim()) {
          allFactors[factor.key.toLowerCase().replace(/\s+/g, '_')] = factor.value;
        }
      });

      const finalScore = overallScore || calculateAverageScore();

      const { error } = await supabase
        .from("product_ratings")
        .insert({
          product_line_id: formState.productLineId,
          score: finalScore,
          factors: allFactors
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Product rating saved with score of ${finalScore}/10.`
      });

      onComplete();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save product rating."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Product Rating</h2>
        <p className="text-muted-foreground">
          Rate various aspects of the product to help consumers make informed decisions (optional).
        </p>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Overall Score
          </CardTitle>
          <CardDescription>
            Set an overall rating or let it calculate automatically from individual factors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label className="min-w-0">Score (1-10):</Label>
            <div className="flex-1">
              <Slider
                value={[overallScore]}
                onValueChange={([value]) => setOverallScore(value)}
                min={1}
                max={10}
                step={0.1}
                className="flex-1"
              />
            </div>
            <div className="flex items-center space-x-2 min-w-0">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="font-bold text-lg">{overallScore.toFixed(1)}</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Calculated average from factors: {calculateAverageScore().toFixed(1)}/10
          </div>
        </CardContent>
      </Card>

      {/* Rating Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Rating Factors
          </CardTitle>
          <CardDescription>
            Rate specific aspects of the product. These will be used to calculate an overall score if not manually set.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {ratingCategories.map(category => (
            <div key={category.key} className="space-y-2">
              <div>
                <Label className="text-sm font-medium">{category.label}</Label>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Slider
                    value={[ratingFactors[category.key]]}
                    onValueChange={([value]) => updateRatingFactor(category.key, value)}
                    min={1}
                    max={10}
                    step={0.1}
                    className="flex-1"
                  />
                </div>
                <div className="min-w-0 w-12 text-right">
                  <span className="text-sm font-medium">{ratingFactors[category.key].toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Custom Factors */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Custom Rating Factors
              </CardTitle>
              <CardDescription>
                Add custom factors specific to your product evaluation.
              </CardDescription>
            </div>
            <Button onClick={addCustomFactor} variant="outline" size="sm">
              Add Factor
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {customFactors.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No custom factors added yet</p>
            </div>
          ) : (
            customFactors.map((factor, index) => (
              <div key={index} className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor={`custom-factor-${index}`}>Factor Name</Label>
                  <Input
                    id={`custom-factor-${index}`}
                    value={factor.key}
                    onChange={(e) => updateCustomFactor(index, "key", e.target.value)}
                    placeholder="e.g., Sustainability, Texture"
                  />
                </div>
                <div className="flex-1">
                  <Label>Rating (1-10)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      value={[factor.value]}
                      onValueChange={([value]) => updateCustomFactor(index, "value", value)}
                      min={1}
                      max={10}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="w-12 text-right text-sm">{factor.value.toFixed(1)}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomFactor(index)}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
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
          {isLoading ? "Saving..." : "Continue to Sources"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};