// components/CodeEditor.tsx
"use client";

import Editor from "@monaco-editor/react";

type Props = {
  value: string;
  onChange?: (value: string | undefined) => void;
};

export default function CodeEditor({ value, onChange }: Props) {
  return (
    <div className="border rounded-md overflow-hidden h-[500px]">
      <Editor
        height="100vh"
        defaultLanguage="html"
        defaultValue={value}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
        }}
      />
    </div>
  );
}
