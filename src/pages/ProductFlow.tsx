import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Package, Palette, Settings, Tag, MapPin, Check } from "lucide-react";
import { NavigationHeader } from "@/components/NavigationHeader";
import { BrandProductLineTab } from "@/components/product-flow/BrandProductLineTab";
import { ProductVariantTab } from "@/components/product-flow/ProductVariantTab";
import { ProductOptionsTab } from "@/components/product-flow/ProductOptionsTab";
import { VariantOptionsTab } from "@/components/product-flow/VariantOptionsTab";
import { IngredientsTab } from "@/components/product-flow/IngredientsTab";
import { SourcesTab } from "@/components/product-flow/SourcesTab";

export interface FormState {
  brandId?: string;
  productLineId?: string;
  variantIds: string[];
  optionIds: string[];
  completedTabs: string[];
}

const ProductFlow = () => {
  const [activeTab, setActiveTab] = useState("brand-product-line");
  const [formState, setFormState] = useState<FormState>({
    variantIds: [],
    optionIds: [],
    completedTabs: []
  });

  const tabs = [
    { 
      id: "brand-product-line", 
      label: "Brand & Product Line", 
      icon: Package,
      description: "Create brand and product line"
    },
    { 
      id: "variants", 
      label: "Product Variants", 
      icon: Palette,
      description: "Add product variants"
    },
    { 
      id: "options", 
      label: "Product Options", 
      icon: Settings,
      description: "Define option types and values"
    },
    { 
      id: "variant-options", 
      label: "Variant Options", 
      icon: Tag,
      description: "Assign options to variants"
    },
    { 
      id: "ingredients", 
      label: "Ingredients", 
      icon: Tag,
      description: "Map ingredients to variants"
    },
    { 
      id: "sources", 
      label: "Sources", 
      icon: MapPin,
      description: "Add retailer information"
    }
  ];

  const updateFormState = (updates: Partial<FormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const markTabCompleted = (tabId: string) => {
    setFormState(prev => ({
      ...prev,
      completedTabs: [...new Set([...prev.completedTabs, tabId])]
    }));
  };

  const getCurrentTabIndex = () => tabs.findIndex(tab => tab.id === activeTab);
  const progressValue = ((getCurrentTabIndex() + 1) / tabs.length) * 100;

  const canAccessTab = (tabId: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === 0) return true;
    
    const previousTab = tabs[tabIndex - 1];
    return formState.completedTabs.includes(previousTab.id);
  };

  const goToNextTab = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const clearWorkflow = () => {
    setFormState({
      variantIds: [],
      optionIds: [],
      completedTabs: []
    });
    setActiveTab("brand-product-line");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <NavigationHeader title="Product Flow Builder" />
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Build Your Product
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Follow the guided workflow to create comprehensive product listings
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8 shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Progress</CardTitle>
                <CardDescription>
                  Step {getCurrentTabIndex() + 1} of {tabs.length}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(progressValue)}%
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
            <Progress value={progressValue} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Main Form */}
        <Card className="shadow-elegant">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-6 w-full bg-muted/50">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isCompleted = formState.completedTabs.includes(tab.id);
                const canAccess = canAccessTab(tab.id);
                
                return (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    disabled={!canAccess}
                    className="flex flex-col gap-1 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <div className="flex items-center gap-1">
                      {isCompleted ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                      <span className="hidden md:inline text-sm">{tab.label}</span>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="p-6">
              <TabsContent value="brand-product-line" className="mt-0">
                <BrandProductLineTab 
                  formState={formState}
                  updateFormState={updateFormState}
                  onComplete={() => {
                    markTabCompleted("brand-product-line");
                    goToNextTab();
                  }}
                />
              </TabsContent>

              <TabsContent value="variants" className="mt-0">
                <ProductVariantTab 
                  formState={formState}
                  updateFormState={updateFormState}
                  onComplete={() => {
                    markTabCompleted("variants");
                    goToNextTab();
                  }}
                />
              </TabsContent>

              <TabsContent value="options" className="mt-0">
                <ProductOptionsTab 
                  formState={formState}
                  updateFormState={updateFormState}
                  onComplete={() => {
                    markTabCompleted("options");
                    goToNextTab();
                  }}
                />
              </TabsContent>

              <TabsContent value="variant-options" className="mt-0">
                <VariantOptionsTab 
                  formState={formState}
                  updateFormState={updateFormState}
                  onComplete={() => {
                    markTabCompleted("variant-options");
                    goToNextTab();
                  }}
                />
              </TabsContent>

              <TabsContent value="ingredients" className="mt-0">
                <IngredientsTab 
                  formState={formState}
                  updateFormState={updateFormState}
                  onComplete={() => {
                    markTabCompleted("ingredients");
                    goToNextTab();
                  }}
                />
              </TabsContent>

              <TabsContent value="sources" className="mt-0">
                <SourcesTab 
                  formState={formState}
                  updateFormState={updateFormState}
                  onComplete={() => {
                    markTabCompleted("sources");
                    clearWorkflow();
                  }}
                />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ProductFlow;