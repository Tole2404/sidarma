import React, { useEffect, useRef } from "react";
import { Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered } from "lucide-react";
 
interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}
 
export default function RichTextEditor({ value, onChange, placeholder = "Mulai menulis..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);
 
  // Sync prop value to editable element
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== value) {
        isUpdatingRef.current = true;
        editorRef.current.innerHTML = value;
        isUpdatingRef.current = false;
      }
    }
  }, [value]);
 
  const exec = (command: string, arg: string = "") => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };
 
  const handleInput = () => {
    if (isUpdatingRef.current) return;
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };
 
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden flex flex-col focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 items-center px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 select-none">
        <button
          type="button"
          onClick={() => exec("bold")}
          title="Tebal (Bold)"
          className="p-1.5 rounded-lg text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          title="Miring (Italic)"
          className="p-1.5 rounded-lg text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          title="Garis Bawah (Underline)"
          className="p-1.5 rounded-lg text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <Underline className="h-4 w-4" />
        </button>
 
        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-850 mx-1" />
 
        <button
          type="button"
          onClick={() => exec("formatBlock", "<h2>")}
          title="Heading 2 (H2)"
          className="p-1.5 rounded-lg text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "<h3>")}
          title="Heading 3 (H3)"
          className="p-1.5 rounded-lg text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <Heading3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "<p>")}
          title="Paragraf (P)"
          className="px-2 py-1 rounded-lg text-zinc-600 dark:text-zinc-450 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white text-xs font-extrabold font-mono transition-colors"
        >
          P
        </button>
 
        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-850 mx-1" />
 
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          title="Daftar Bulatan (Bullet List)"
          className="p-1.5 rounded-lg text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          title="Daftar Angka (Ordered List)"
          className="p-1.5 rounded-lg text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
 
        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-850 mx-1" />
 
        <button
          type="button"
          onClick={() => exec("removeFormat")}
          title="Hapus Format"
          className="px-2 py-1 rounded-lg text-zinc-450 dark:text-zinc-500 hover:bg-zinc-250 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-white text-xs font-semibold transition-colors ml-auto"
        >
          Hapus Format
        </button>
      </div>
 
      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="flex-1 min-h-[250px] max-h-[400px] overflow-y-auto p-4 focus:outline-none dark:text-white prose prose-sm dark:prose-invert max-w-none"
        {...{ placeholder }}
      />
    </div>
  );
}
