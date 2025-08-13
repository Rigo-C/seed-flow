import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Plus, Trash2, Image, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { FormState } from "@/pages/ProductFlow";

interface ProductVariantTabProps {
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
  onComplete: () => void;
}

interface VariantData {
  id?: string;
  name: string;
  imageUrl: string;
  lookupKey: string;
  asin: string;
}

export const ProductVariantTab = ({ formState, updateFormState, onComplete }: ProductVariantTabProps) => {
  const [variants, setVariants] = useState<VariantData[]>([
    { name: "", imageUrl: "", lookupKey: "", asin: "" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addVariant = () => {
    setVariants(prev => [...prev, { name: "", imageUrl: "", lookupKey: "", asin: "" }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (index: number, field: keyof VariantData, value: string) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const validVariants = variants.filter(variant => variant.name.trim());
      
      if (validVariants.length === 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please add at least one variant with a name."
        });
        return;
      }

      const variantInserts = validVariants.map(variant => ({
        product_id: formState.productLineId,
        name: variant.name,
        image_url: variant.imageUrl || null,
        lookup_key: variant.lookupKey || null,
        asin: variant.asin || null
      }));

      const { data: createdVariants, error } = await supabase
        .from("product_variants")
        .insert(variantInserts)
        .select("id");

      if (error) throw error;

      const variantIds = createdVariants.map(v => v.id);
      updateFormState({ variantIds });

      toast({
        title: "Success!",
        description: `${validVariants.length} variant(s) created successfully.`
      });

      onComplete();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create product variants."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = variants.some(variant => variant.name.trim());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Product Variants</h2>
        <p className="text-muted-foreground">
          Add different variants for your product line (e.g., different sizes, flavors, etc.)
        </p>
      </div>

      {/* Variants */}
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5" />
                  Variant {index + 1}
                </CardTitle>
                {variants.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`variant-name-${index}`}>Variant Name *</Label>
                  <Input
                    id={`variant-name-${index}`}
                    value={variant.name}
                    onChange={(e) => updateVariant(index, "name", e.target.value)}
                    placeholder="e.g., Chicken & Rice 5lb"
                  />
                </div>
                <div>
                  <Label htmlFor={`variant-lookup-${index}`}>UPC/EAN/Barcode</Label>
                  <Input
                    id={`variant-lookup-${index}`}
                    value={variant.lookupKey}
                    onChange={(e) => updateVariant(index, "lookupKey", e.target.value)}
                    placeholder="123456789012"
                  />
                </div>
                <div>
                  <Label htmlFor={`variant-image-${index}`}>Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`variant-image-${index}`}
                      value={variant.imageUrl}
                      onChange={(e) => updateVariant(index, "imageUrl", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button variant="outline" size="sm">
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor={`variant-asin-${index}`}>ASIN (Amazon)</Label>
                  <Input
                    id={`variant-asin-${index}`}
                    value={variant.asin}
                    onChange={(e) => updateVariant(index, "asin", e.target.value)}
                    placeholder="B08XXXXXXX"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Variant Button */}
      <div className="flex justify-center">
        <Button onClick={addVariant} variant="outline" size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Variant
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
          {isLoading ? "Creating..." : "Continue to Options"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};