import { useState } from "react";
import { askClaude } from "../utils/claude";
import OutputCard from "../components/OutputCard";

export default function LinkedInBio() {
  const [form, setForm]       = useState({ name: "", role: "", experience: "", goals: "" });
  const [output, setOutput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const generate = async () => {
    if (!form.role) { setError("Please enter your current or target role."); return; }
    setError(""); setLoading(true); setOutput("");
    try {
      const system = `You are a LinkedIn personal branding expert who has helped thousands of professionals 
land jobs at top companies. You write LinkedIn summaries that are authentic, keyword-rich, 
and compelling to both recruiters and hiring managers. Write in first person. Keep it under 300 words.`;

      const user = `Write a compelling LinkedIn About section for:
Name: ${form.name || "the user"}
Current/Target Role: ${form.role}
Experience & Skills: ${form.experience || "Not specified"}
Career Goals: ${form.goals || "Open to new opportunities"}

Make it human, not robotic. Start with a hook. Include relevant keywords for the role. End with a clear call to action.`;

      setOutput(await askClaude(system, user));
    } catch { setError("Failed to generate. Try again."); }
    finally { setLoading(false); }
  };

  const inp = "w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500";

  return (
    <div className="max-w-2xl">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Your Name</label>
            <input className={inp} placeholder="Neo Hlakoane" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Role *</label>
            <input className={inp} placeholder="Full Stack Developer" value={form.role}
              onChange={e => setForm({...form, role: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Experience & Skills</label>
          <textarea className={`${inp} resize-none`} rows={3}
            placeholder="React, Node.js, PostgreSQL, built 5+ full stack apps, BSc IT graduate..."
            value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Career Goals</label>
          <input className={inp} placeholder="Looking for a junior developer role at a product company"
            value={form.goals} onChange={e => setForm({...form, goals: e.target.value})} />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button onClick={generate} disabled={loading}
          className="w-full bg-primary hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-all text-sm">
          {loading ? "Generating..." : "✨ Generate LinkedIn Bio"}
        </button>
      </div>
      <OutputCard content={output} loading={loading} />
    </div>
  );
}