import { useState } from "react";

export default function OutputCard({
  content,
  setContent,
  loading,
  title = "AI Output",
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 mt-6">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />

          <span className="text-sm font-medium">
            AI is generating your content...
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <div className="h-3 bg-slate-700 rounded animate-pulse w-full" />
          <div className="h-3 bg-slate-700 rounded animate-pulse w-full" />
          <div className="h-3 bg-slate-700 rounded animate-pulse w-5/6" />
          <div className="h-3 bg-slate-700 rounded animate-pulse w-2/3" />
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div className="bg-card border border-primary/30 rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">
            {title}
          </span>

          <p className="text-xs text-slate-500 mt-1">
            Edit the AI-generated content before using it.
          </p>
        </div>

        <button
          onClick={copy}
          className="text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => {
          if (setContent) {
            setContent(e.target.value);
          }
        }}
        readOnly={!setContent}
        className="w-full min-h-[300px] bg-dark border border-border rounded-xl p-4 text-sm text-slate-200 leading-relaxed resize-y focus:border-primary transition-colors"
      />
    </div>
  );
}