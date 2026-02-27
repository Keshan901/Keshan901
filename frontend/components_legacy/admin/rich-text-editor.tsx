"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  name: string;
  initialValue?: string;
};

export function RichTextEditor({ name, initialValue = "" }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialValue,
    immediatelyRender: false
  });

  return (
    <div className="space-y-2">
      <div className="rounded-md border border-white/15 bg-slate-900/70 p-2">
        <EditorContent editor={editor} className="min-h-32 prose prose-invert max-w-none" />
      </div>
      <input type="hidden" name={name} value={editor?.getHTML() ?? ""} readOnly />
    </div>
  );
}
