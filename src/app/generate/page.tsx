"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
});

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const generateCode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Generated Code:", data.code);
      setCode(data.code);
    } catch (error) {
      console.error("Failed to fetch code:", error);
      // Consider setting an error state to display a message to the user.
      setCode("// Error generating code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
          Generate Website
        </h1>

        <div className="flex flex-col gap-6">
          {/* Main split view */}
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Code Panel */}
            <ResizablePanel
              minSize={30}
              defaultSize={50}
              className="bg-card border rounded-lg shadow-md"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Code Editor
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-3rem)] p-0">
                  <div className="h-full overflow-hidden rounded-md border-t">
                    <CodeEditor
                      value={code}
                      onChange={(value) => setCode(value || "")}
                    />
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>

            <ResizableHandle className="bg-border" />

            {/* Live Preview Panel */}
            <ResizablePanel
              minSize={30}
              defaultSize={50}
              className="bg-card border rounded-lg shadow-md"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-3rem)]">
                  <div className="flex-1 overflow-hidden border rounded-md bg-white dark:bg-gray-900">
                    <iframe
                      srcDoc={code}
                      sandbox="allow-scripts allow-same-origin"
                      className="w-full h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>

          {/* Prompt Form */}
          <Card className="bg-card border rounded-lg shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Describe Your Website
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., 'A modern e-commerce site with dark mode, product grid, and checkout flow'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="mb-4"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={generateCode}
                  disabled={loading || !prompt.trim()}
                  className={cn(
                    "w-full",
                    "bg-gradient-to-r from-purple-500 to-blue-500",
                    "text-white font-semibold",
                    "hover:from-purple-600 hover:to-blue-600",
                    "transition-all duration-300 shadow-lg"
                  )}
                >
                  {loading ? (
                    <span className="animate-pulse">Generating...</span>
                  ) : (
                    "Generate Website"
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
