"use client";

import React, { useState, useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { useThemeCustomizer, fontOptions } from "@/components/theme/ThemeProvider";
import { 
  Settings, 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Type, 
  Check, 
  RotateCcw,
  Sparkles,
  Zap
} from "lucide-react";
import NavigationDrawer from "../../components/ui/navigationDrawer";

const ThemeCustomizer: React.FC = () => {
  const { theme, setTheme } = useNextTheme();
  const { 
    primaryColor, 
    setPrimaryColor, 
    fontFamily, 
    setFontFamily, 
    isCustomizerOpen, 
    toggleCustomizer 
  } = useThemeCustomizer();
  
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("theme");

  useEffect(() => setMounted(true), []);

  const colorOptions = [
    { name: "brand", label: "Brand Blue", color: "#465fff", gradient: "from-blue-500 to-indigo-600" },
    { name: "blue", label: "Sky Blue", color: "#0ba5ec", gradient: "from-sky-400 to-blue-600" },
    { name: "yellow", label: "Yellow", color: "#facc15", gradient: "from-amber-500 to-yellow-500" },
    { name: "magenta", label: "Magenta", color: "#d946ef", gradient: "from-fuchsia-500 to-pink-600" },
    { name: "purple", label: "Purple", color: "#7a5af8", gradient: "from-purple-500 to-violet-600" },
    { name: "pink", label: "Pink", color: "#ec4899", gradient: "from-pink-500 to-rose-500" },
    { name: "green", label: "Green", color: "#12b76a", gradient: "from-emerald-500 to-green-600" },
    { name: "orange", label: "Orange", color: "#fb6514", gradient: "from-orange-500 to-red-500" },
    { name: "red", label: "Red", color: "#f04438", gradient: "from-red-500 to-pink-500" },
  ];

  const themeOptions = [
    { key: "light", label: "Light", icon: Sun, description: "Bright interface" },
    { key: "dark", label: "Dark", icon: Moon, description: "Easy on eyes" },
    { key: "system", label: "System", icon: Monitor, description: "Auto sync" },
  ];

  const fontOptionsList = Object.entries(fontOptions).map(([key, value]) => ({
    key,
    name: value.name,
    preview: "Aa",
    description: key === 'libre-baskerville' ? 'Serif' : key === 'jetbrains-mono' ? 'Monospace' : key === 'system' ? 'Default' : 'Sans-serif'
  }));

  const sections = [
    { id: "theme", label: "Mode", icon: Sun },
    { id: "colors", label: "Colors", icon: Palette },
    { id: "typography", label: "Fonts", icon: Type },
  ];

  const resetToDefaults = () => {
    setTheme("system");
    setPrimaryColor("brand" as any);
    setFontFamily("outfit" as any);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed right-4 bottom-4 z-[100000]">
        <button
          onClick={toggleCustomizer}
          className="group relative bg-primary hover:shadow-2xl rounded-full p-3 cursor-pointer shadow-lg"
          aria-label="Open theme customizer"
        >
          <Settings className="h-5 w-5 text-white" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900"></div>
          
          <div className="absolute bottom-full right-0 mb-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
            <div className="card px-3 py-1.5 text-xs font-medium whitespace-nowrap shadow-xl rounded-lg">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary" />
                Theme Studio
              </div>
              <div className="absolute top-full right-4 border-t-[5px] border-t-gray-900 dark:border-t-white border-x-[5px] border-x-transparent"></div>
            </div>
          </div>
        </button>
      </div>

      <NavigationDrawer
        isOpen={isCustomizerOpen}
        onClose={toggleCustomizer}
        location="right"
        title="Theme Studio"
        headerContent={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className="relative p-1.5 bg-gradient-to-br from-primary to-primary/70 rounded-lg shadow-md">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold">Theme Studio</h3>
                <p className="text-xs opacity-60">Make it yours</p>
              </div>
            </div>
            <button
              onClick={resetToDefaults}
              className="p-1.5 hover:bg-muted rounded-lg cursor-pointer"
              title="Reset to defaults"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        }
        width="22rem"
      >
        {/* Vertical Navigation */}
        <div className="flex gap-2 my-4 px-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 rounded-lg flex flex-col items-center justify-center gap-1.5 py-3 text-xs font-semibold cursor-pointer ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 max-h-[calc(100vh-4.5rem)]"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(155, 155, 155, 0.3) transparent",
          }}
        >
          {/* Theme Mode Section */}
          {activeSection === "theme" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Sun className="h-3.5 w-3.5 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">Appearance</h4>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = theme === option.key;
                  return (
                    <button
                      key={option.key}
                      onClick={() => setTheme(option.key)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer ${
                        isActive
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/30 hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isActive ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? "text-white" : ""}`} />
                      </div>
                      <div className="text-center">
                        <div className={`font-bold text-xs ${isActive ? "text-primary" : ""}`}>
                          {option.label}
                        </div>
                        <div className="text-xs opacity-60 mt-0.5">{option.description}</div>
                      </div>
                      {isActive && (
                        <div className="absolute top-1.5 right-1.5 p-0.5 bg-primary rounded-full">
                          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colors Section */}
          {activeSection === "colors" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Palette className="h-3.5 w-3.5 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">Color Palette</h4>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((option) => {
                  const isActive = primaryColor === option.name;
                  return (
                    <button
                      key={option.name}
                      onClick={() => setPrimaryColor(option.name as any)}
                      className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 cursor-pointer ${
                        isActive
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div
                        className={`w-full aspect-square rounded-lg bg-gradient-to-br ${option.gradient} shadow-lg flex items-center justify-center`}
                      >
                        {isActive && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                      </div>
                      <div className="text-center w-full">
                        <div className="font-semibold text-xs truncate">{option.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Typography Section */}
          {activeSection === "typography" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Type className="h-3.5 w-3.5 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">Typography</h4>
              </div>
              
              <div className="space-y-2">
                {fontOptionsList.map((font) => {
                  const isActive = fontFamily === font.key;
                  return (
                    <button
                      key={font.key}
                      onClick={() => setFontFamily(font.key as any)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer ${
                        isActive
                          ? "border-primary bg-primary"
                          : "border-border hover:border-primary/30 hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold ${
                          isActive ? "bg-background text-primary" : "bg-muted"
                        }`}
                        style={{ fontFamily: fontOptions[font.key as keyof typeof fontOptions].family }}
                      >
                        {font.preview}
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-bold text-sm ${isActive ? "text-primary-foreground" : ""}`}>
                          {font.name}
                        </div>
                        <div className={`text-xs ${isActive ? "text-primary-foreground/70" : "opacity-60"}`}>
                          {font.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="p-1 bg-background rounded-lg">
                          <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-4 pb-4">
          <div className="p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-start gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg mt-0.5">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
              <div className="flex-1 text-xs">
                <p className="font-semibold mb-0.5">Preferences saved</p>
                <p className="text-xs opacity-60">Changes apply instantly</p>
              </div>
            </div>
          </div>
        </div>
      </NavigationDrawer>
    </>
  );
};

export default ThemeCustomizer;