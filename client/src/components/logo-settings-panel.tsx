import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Settings, Monitor, Smartphone, Palette, Zap, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { LogoSettings } from "@shared/schema";

interface LogoSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoSettingsPanel({ isOpen, onClose }: LogoSettingsPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/logo-settings'],
    enabled: isOpen,
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<LogoSettings>) => {
      if (!(settings as any)?.data) throw new Error('No settings found');
      const response = await fetch(`/api/logo-settings/${(settings as any).data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/logo-settings'] });
      toast({
        title: "Settings Updated",
        description: "Logo synchronization settings have been applied successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update logo settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetToDefaults = () => {
    const defaults = {
      syncMode: 'independent',
      desktopAnimationType: 'css',
      mobileAnimationType: 'framer',
      animationSpeed: 'normal',
      enableOrbitalDots: true,
      dotSizeScale: 1.0,
      ringOpacity: 1.0,
      enablePulseEffect: false,
      colorTheme: 'default'
    };
    updateMutation.mutate(defaults);
  };

  const currentSettings = (settings as any)?.data;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle>Logo Synchronization Settings</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">Loading settings...</div>
          ) : (
            <>
              {/* Sync Mode */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Synchronization Mode
                </Label>
                <Select
                  value={currentSettings?.syncMode || 'independent'}
                  onValueChange={(value) => updateMutation.mutate({ syncMode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="independent">Independent (Desktop/Mobile Different)</SelectItem>
                    <SelectItem value="synchronized">Synchronized (Same Across Devices)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose whether desktop and mobile logos should animate differently or identically.
                </p>
              </div>

              <Separator />

              {/* Desktop Settings */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Desktop Animation Settings
                </Label>
                
                <div className="space-y-3 ml-6">
                  <div>
                    <Label className="text-sm">Animation Type</Label>
                    <Select
                      value={currentSettings?.desktopAnimationType || 'css'}
                      onValueChange={(value) => updateMutation.mutate({ desktopAnimationType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="css">CSS Animations (Performance Optimized)</SelectItem>
                        <SelectItem value="framer">Framer Motion (Smooth Transitions)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Mobile Settings */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Mobile Animation Settings
                </Label>
                
                <div className="space-y-3 ml-6">
                  <div>
                    <Label className="text-sm">Animation Type</Label>
                    <Select
                      value={currentSettings?.mobileAnimationType || 'framer'}
                      onValueChange={(value) => updateMutation.mutate({ mobileAnimationType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="css">CSS Animations (Performance Optimized)</SelectItem>
                        <SelectItem value="framer">Framer Motion (Smooth Transitions)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Animation Speed */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Animation Speed</Label>
                <Select
                  value={currentSettings?.animationSpeed || 'normal'}
                  onValueChange={(value) => updateMutation.mutate({ animationSpeed: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow (Relaxed)</SelectItem>
                    <SelectItem value="normal">Normal (Balanced)</SelectItem>
                    <SelectItem value="fast">Fast (Energetic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Visual Settings */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Visual Customization
                </Label>
                
                <div className="space-y-4 ml-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Enable Orbital Dots</Label>
                    <Switch
                      checked={currentSettings?.enableOrbitalDots ?? true}
                      onCheckedChange={(checked) => updateMutation.mutate({ enableOrbitalDots: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Dot Size Scale: {currentSettings?.dotSizeScale?.toFixed(1) || '1.0'}x</Label>
                    <Slider
                      value={[currentSettings?.dotSizeScale || 1.0]}
                      onValueChange={([value]) => updateMutation.mutate({ dotSizeScale: value })}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Ring Opacity: {Math.round((currentSettings?.ringOpacity || 1.0) * 100)}%</Label>
                    <Slider
                      value={[currentSettings?.ringOpacity || 1.0]}
                      onValueChange={([value]) => updateMutation.mutate({ ringOpacity: value })}
                      min={0.1}
                      max={1.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Enable Pulse Effect</Label>
                    <Switch
                      checked={currentSettings?.enablePulseEffect ?? false}
                      onCheckedChange={(checked) => updateMutation.mutate({ enablePulseEffect: checked })}
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Color Theme</Label>
                    <Select
                      value={currentSettings?.colorTheme || 'default'}
                      onValueChange={(value) => updateMutation.mutate({ colorTheme: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default (Orange/Blue)</SelectItem>
                        <SelectItem value="monochrome">Monochrome (Grayscale)</SelectItem>
                        <SelectItem value="rainbow">Rainbow (Multi-color)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={resetToDefaults}
                  disabled={updateMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </Button>
                <Button onClick={onClose}>Close</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}