export default function GenerateButton({
  onClick,
  loading,
  children = "Generate with AI",
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/20"
    >
      {loading ? "Generating..." : `✨ ${children}`}
    </button>
  );
}