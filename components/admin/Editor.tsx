"use client";

import { EditorContent, useEditor, useEditorState, type Editor as TEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Code, Heading2, Heading3, ImagePlus, Italic, Link2, List,
  ListOrdered, Loader2, Minus, Quote, Redo2, Strikethrough, Trash2, Underline as UnderlineIcon, Undo2, Unlink,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { CustomImage } from "./CustomImage";
import { uploadImage } from "./upload";

type Props = {
  content: string;
  onChange: (html: string) => void;
  onUploaded?: (url: string) => void;
  onError?: (msg: string) => void;
};

const SIZES = [
  { key: "small", label: "S" },
  { key: "medium", label: "M" },
  { key: "large", label: "L" },
  { key: "full", label: "Full" },
  { key: "wide", label: "Wide" },
] as const;

export default function Editor({ content, onChange, onUploaded, onError }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const editorRef = useRef<TEditor | null>(null);

  const insertFiles = useCallback(
    async (editor: TEditor, files: File[], pos?: number) => {
      const images = files.filter((f) => f.type.startsWith("image/"));
      for (const file of images) {
        setUploading((n) => n + 1);
        try {
          const url = await uploadImage(file);
          onUploaded?.(url);
          const alt = file.name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ");
          const chain = editor.chain().focus();
          (pos !== undefined ? chain.insertContentAt(pos, { type: "image", attrs: { src: url, alt } }) : chain.setImage({ src: url, alt })).run();
        } catch (e) {
          onError?.((e as Error).message);
        } finally {
          setUploading((n) => n - 1);
        }
      }
    },
    [onUploaded, onError]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener" } },
      }),
      CustomImage.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({
        placeholder: ({ node }) => (node.type.name === "heading" ? "Heading" : "Start writing. Select text to format it, or paste / drop images…"),
      }),
    ],
    content,
    editorProps: {
      attributes: { class: "prose-article adm-editor-content" },
      handlePaste: (view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        if (!files.some((f) => f.type.startsWith("image/")) || !editorRef.current) return false;
        event.preventDefault();
        insertFiles(editorRef.current, files);
        return true;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (!files.some((f) => f.type.startsWith("image/")) || !editorRef.current) return false;
        event.preventDefault();
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        insertFiles(editorRef.current, files, pos);
        return true;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  editorRef.current = editor;

  const selected = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            underline: e.isActive("underline"),
            strike: e.isActive("strike"),
            code: e.isActive("code"),
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            ul: e.isActive("bulletList"),
            ol: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            codeBlock: e.isActive("codeBlock"),
            link: e.isActive("link"),
            image: e.isActive("image"),
            imageAttrs: e.isActive("image") ? e.getAttributes("image") : null,
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
            words: e.getText().split(/\s+/).filter(Boolean).length,
          }
        : null,
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "" || url === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return <div className="adm-editor-skeleton" />;
  const state = selected ?? {
    bold: false, italic: false, underline: false, strike: false, code: false, h2: false, h3: false,
    ul: false, ol: false, quote: false, codeBlock: false, link: false, image: false,
    imageAttrs: null, canUndo: false, canRedo: false, words: 0,
  };

  const img = state.imageAttrs as { align?: string; size?: string; alt?: string } | null;
  const setImg = (patch: Record<string, string>) => editor.chain().focus().updateAttributes("image", patch).run();

  return (
    <div className="adm-editor">
      <div className="adm-tb" role="toolbar" aria-label="Formatting">
        <Btn on={state.h2} title="Heading (H2)" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></Btn>
        <Btn on={state.h3} title="Subheading (H3)" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></Btn>
        <Sep />
        <Btn on={state.bold} title="Bold (⌘B)" onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={15} /></Btn>
        <Btn on={state.italic} title="Italic (⌘I)" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={15} /></Btn>
        <Btn on={state.underline} title="Underline (⌘U)" onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={15} /></Btn>
        <Btn on={state.strike} title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={15} /></Btn>
        <Btn on={state.code} title="Inline code" onClick={() => editor.chain().focus().toggleCode().run()}><Code size={15} /></Btn>
        <Sep />
        <Btn on={state.ul} title="Bulleted list" onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></Btn>
        <Btn on={state.ol} title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></Btn>
        <Btn on={state.quote} title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={15} /></Btn>
        <Btn title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={16} /></Btn>
        <Sep />
        <Btn on={state.link} title="Link (⌘K)" onClick={setLink}><Link2 size={15} /></Btn>
        {state.link && <Btn title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}><Unlink size={15} /></Btn>}
        <Btn title="Insert image" onClick={() => fileRef.current?.click()}>
          {uploading ? <Loader2 size={15} className="spin" /> : <ImagePlus size={15} />}
        </Btn>
        <Sep />
        <Btn title="Undo (⌘Z)" disabled={!state.canUndo} onClick={() => editor.chain().focus().undo().run()}><Undo2 size={15} /></Btn>
        <Btn title="Redo (⇧⌘Z)" disabled={!state.canRedo} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={15} /></Btn>
        <span className="adm-tb-count">{state.words} words · {Math.max(1, Math.round(state.words / 225))} min</span>
      </div>

      {img && (
        <div className="adm-imgbar">
          <span className="adm-imgbar-label">Image</span>
          <div className="adm-seg" onMouseDown={keepFocus}>
            {[["left", AlignLeft], ["center", AlignCenter], ["right", AlignRight]].map(([k, Icon]) => {
              const I = Icon as typeof AlignLeft;
              return (
                <button key={k as string} className={img.align === k ? "is-on" : ""} title={`Align ${k}`} onClick={() => setImg({ align: k as string })}>
                  <I size={14} />
                </button>
              );
            })}
          </div>
          <div className="adm-seg" onMouseDown={keepFocus}>
            {SIZES.map((s) => (
              <button key={s.key} className={img.size === s.key ? "is-on" : ""} onClick={() => setImg({ size: s.key })}>
                {s.label}
              </button>
            ))}
          </div>
          <input
            className="adm-imgbar-alt"
            placeholder="Alt text (describe the image)"
            defaultValue={img.alt ?? ""}
            key={editor.state.selection.from}
            onBlur={(e) => setImg({ alt: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
          />
          <button className="adm-icon-btn danger" title="Remove image" onClick={() => editor.chain().focus().deleteSelection().run()}>
            <Trash2 size={14} />
          </button>
        </div>
      )}

      <BubbleMenu editor={editor} shouldShow={({ editor: e, state: s }) => !s.selection.empty && !e.isActive("image")}>
        <div className="adm-bubble" onMouseDown={keepFocus}>
          <button className={state.bold ? "is-on" : ""} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={14} /></button>
          <button className={state.italic ? "is-on" : ""} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={14} /></button>
          <button className={state.underline ? "is-on" : ""} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={14} /></button>
          <button className={state.link ? "is-on" : ""} onClick={setLink}><Link2 size={14} /></button>
          <i />
          <button className={state.h2 ? "is-on" : ""} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={14} /></button>
          <button className={state.quote ? "is-on" : ""} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={14} /></button>
        </div>
      </BubbleMenu>

      <EditorContent editor={editor} />

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) insertFiles(editor, files);
        }}
      />
    </div>
  );
}

function Btn({ on, title, disabled, onClick, children }: { on?: boolean; title: string; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className={`adm-tb-btn${on ? " is-on" : ""}`} title={title} aria-label={title} aria-pressed={on} disabled={disabled} onMouseDown={keepFocus} onClick={onClick}>
      {children}
    </button>
  );
}

/** Toolbar clicks must not steal focus from the editor, or the next keystrokes are lost. */
const keepFocus = (e: React.MouseEvent) => e.preventDefault();

function Sep() {
  return <span className="adm-tb-sep" aria-hidden="true" />;
}
