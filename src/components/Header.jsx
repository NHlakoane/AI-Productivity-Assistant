const titles = {
  email: {
    title: "Smart Email Generator",
    sub: "Generate professional workplace emails with AI",
  },

  notes: {
    title: "Meeting Notes Summarizer",
    sub: "Turn lengthy meeting notes into clear summaries and action items",
  },

  planner: {
    title: "AI Task Planner",
    sub: "Prioritise your work and build an organised schedule",
  },

  research: {
    title: "AI Research Assistant",
    sub: "Explore topics, summarise information and extract useful insights",
  },

  chat: {
    title: "AI Workplace Assistant",
    sub: "Ask questions and interact with your AI productivity assistant",
  },

  cover: {
    title: "Cover Letter Generator",
    sub: "Generate a tailored cover letter for any job application",
  },

  linkedin: {
    title: "LinkedIn Bio Writer",
    sub: "Craft a compelling LinkedIn summary that attracts recruiters",
  },

  interview: {
    title: "Interview Prep Coach",
    sub: "Practice answers to tough interview questions with AI feedback",
  },

  salary: {
    title: "Salary Negotiation Email",
    sub: "Write a confident, professional salary negotiation email",
  },

  cv: {
    title: "CV Bullet Point Improver",
    sub: "Transform weak CV bullets into powerful achievement statements",
  },
};

const options = [
  {
    group: "Workplace AI",
    items: [
      ["email", "✉️ Smart Email"],
      ["notes", "📝 Meeting Notes"],
      ["planner", "📅 Task Planner"],
      ["research", "🔎 Research Assistant"],
      ["chat", "💬 AI Chatbot"],
    ],
  },

  {
    group: "Career Tools",
    items: [
      ["cover", "📄 Cover Letter"],
      ["linkedin", "💼 LinkedIn Bio"],
      ["interview", "🎯 Interview Prep"],
      ["salary", "💰 Salary Email"],
      ["cv", "✨ CV Bullet Points"],
    ],
  },
];

export default function Header({ active, setActive }) {
  const current = titles[active] || titles.email;

  return (
    <header className="border-b border-border px-5 md:px-8 py-5 bg-card/50">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            {current.title}
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            {current.sub}
          </p>
        </div>

        <select
          value={active}
          onChange={(e) => setActive(e.target.value)}
          className="md:hidden bg-dark border border-border rounded-xl px-3 py-2 text-sm text-white"
        >
          {options.map((group) => (
            <optgroup
              key={group.group}
              label={group.group}
            >
              {group.items.map(([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </header>
  );
}