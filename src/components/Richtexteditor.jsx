import { useRef } from "react";

export default function RichTextEditor({
  initialValue = "",
  onChange,
  placeholder = "Write your post…",
}) {
  const ref = useRef(null);
  const mounted = useRef(false);

  if (!mounted.current) {
    mounted.current = true;
  }

  function setInitial(node) {
    ref.current = node;
    if (node && !node.dataset.initialized) {
      node.innerHTML = initialValue || "";
      node.dataset.initialized = "true";
    }
  }

  function exec(cmd, val = null) {
    document.execCommand(cmd, false, val);
    ref.current?.focus();
    onChange?.(ref.current?.innerHTML ?? "");
  }

  function handleLink() {
    const url = window.prompt("Link URL (https://…)");
    if (url) exec("createLink", url);
  }

  return (
    <div className="border border-ink/20 bg-paper">
      <div className="flex flex-wrap gap-1 border-b border-ink/10 p-2">
        <ToolbarButton
          onClick={() => exec("bold")}
          label="B"
          className="font-bold"
          title="Bold"
        />
        <ToolbarButton
          onClick={() => exec("italic")}
          label="I"
          className="italic"
          title="Italic"
        />
        <ToolbarButton
          onClick={() => exec("underline")}
          label="U"
          className="underline"
          title="Underline"
        />
        <Divider />
        <ToolbarButton
          onClick={() => exec("formatBlock", "H2")}
          label="H2"
          title="Heading 2"
        />
        <ToolbarButton
          onClick={() => exec("formatBlock", "H3")}
          label="H3"
          title="Heading 3"
        />
        <ToolbarButton
          onClick={() => exec("formatBlock", "P")}
          label="¶"
          title="Paragraph"
        />
        <Divider />
        <ToolbarButton
          onClick={() => exec("insertUnorderedList")}
          label="• List"
          title="Bullet list"
        />
        <ToolbarButton
          onClick={() => exec("insertOrderedList")}
          label="1. List"
          title="Numbered list"
        />
        <ToolbarButton
          onClick={() => exec("formatBlock", "BLOCKQUOTE")}
          label="❝"
          title="Quote"
        />
        <Divider />
        <ToolbarButton onClick={handleLink} label="Link" title="Insert link" />
        <ToolbarButton
          onClick={() => exec("removeFormat")}
          label="Clear"
          title="Clear formatting"
        />
      </div>
      <div
        ref={setInitial}
        contentEditable
        onInput={() => onChange?.(ref.current.innerHTML)}
        data-placeholder={placeholder}
        className="rte-content min-h-[320px] px-4 py-4 font-body text-ink outline-none"
      />
    </div>
  );
}

function ToolbarButton({ onClick, label, className = "", title }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`border border-ink/15 px-2.5 py-1 font-mono text-xs text-ink/70 hover:border-steel hover:text-steel ${className}`}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 w-px bg-ink/10" />;
}
