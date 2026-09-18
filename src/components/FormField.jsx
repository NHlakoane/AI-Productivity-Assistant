export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  rows,
  required = false,
}) {
  const commonClass =
    "w-full bg-dark border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-primary transition-colors";

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}

        {required && (
          <span className="text-primary ml-1">*</span>
        )}
      </label>

      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${commonClass} resize-y`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={commonClass}
        />
      )}
    </div>
  );
}