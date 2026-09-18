export default function FeatureShell({
  icon,
  title,
  description,
  children,
}) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
            {icon}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              {title}
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {description}
            </p>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}