const features = [
  { id: "email", icon: "✉️", label: "Smart Email" },
  { id: "notes", icon: "📝", label: "Meeting Notes" },
  { id: "planner", icon: "📅", label: "Task Planner" },
  { id: "research", icon: "🔎", label: "Research Assistant" },
  { id: "chat", icon: "💬", label: "AI Chatbot" },
];

const careerFeatures = [
  { id: "cover", icon: "📄", label: "Cover Letter" },
  { id: "linkedin", icon: "💼", label: "LinkedIn Bio" },
  { id: "interview", icon: "🎯", label: "Interview Prep" },
  { id: "salary", icon: "💰", label: "Salary Email" },
  { id: "cv", icon: "✨", label: "CV Bullet Points" },
];

function NavButton({ feature, active, setActive }) {
  return (
    <button
      onClick={() => setActive(feature.id)}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all ${
        active === feature.id
          ? "bg-primary text-white font-medium shadow-lg shadow-primary/20"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <span className="text-base">{feature.icon}</span>
      <span>{feature.label}</span>
    </button>
  );
}

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="hidden md:flex w-72 shrink-0 min-h-screen bg-card border-r border-border flex-col">
      
      {/* Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-lg">
            🚀
          </div>

          <div>
            <p className="font-bold text-sm text-white">CareerAI</p>
            <p className="text-xs text-slate-400">AI Productivity Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-5 space-y-6 overflow-y-auto">

        {/* Required CAPACITI Features */}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest px-3 mb-3">
            Workplace AI
          </p>

          <div className="space-y-2">
            {features.map((feature) => (
              <NavButton
                key={feature.id}
                feature={feature}
                active={active}
                setActive={setActive}
              />
            ))}
          </div>
        </div>

        {/* Our Career Features */}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest px-3 mb-3">
            Career Tools
          </p>

          <div className="space-y-2">
            {careerFeatures.map((feature) => (
              <NavButton
                key={feature.id}
                feature={feature}
                active={active}
                setActive={setActive}
              />
            ))}
          </div>
        </div>

      </nav>

      {/* Responsible AI */}
      <div className="p-5 border-t border-border">
        <div className="bg-dark rounded-xl p-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            ⚠️{" "}
            <strong className="text-slate-300">
              Responsible AI:
            </strong>{" "}
            Always review, personalise and verify AI-generated content before
            using or sharing it.
          </p>
        </div>
      </div>

    </aside>
  );
}