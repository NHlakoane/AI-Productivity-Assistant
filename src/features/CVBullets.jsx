import { useState } from "react";
import { askClaude } from "../utils/claude";
import OutputCard from "../components/OutputCard";

export default function CVBullets() {
  const [form, setForm]       = useState({ role: "", bullets: "", level: "junior" });
  const [output, setOutput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const examples = [
    "Worked on the website",
    "Helped with customer support",
    "Did database work",
    "Worked in a team on projects",
  ];

  const generate = async () => {
    if (!form.bullets) { setError("Please enter at least one CV bullet point to improve."); return; }
    setError(""); setLoading(true); setOutput("");
    try {
      const system = `You are an expert CV writer and career coach who has reviewed thousands of CVs. 
You transform weak, vague bullet points into powerful achievement statements using action verbs, 
quantifiable results, and the PAR method (Problem, Action, Result). 
You understand what ATS systems look for and what hiring managers want to see.`;

      const user = `Improve these CV bullet points for a ${form.level} ${form.role || "professional"}:

ORIGINAL BULLETS:
${form.bullets}

For each bullet:
1. Show the original (weak version)
2. Show the improved version with action verb + specific achievement + result/impact
3. Briefly explain what makes the improved version stronger

Also suggest 3 additional strong bullet points they could use based on the role.`;

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
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Target Role</label>
            <input className={inp} placeholder="Software Developer" value={form.role}
              onChange={e => setForm({...form, role: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Experience Level</label>
            <select className={inp} value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
              <option value="junior">Junior (0-2 years)</option>
              <option value="mid">Mid-level (2-5 years)</option>
              <option value="senior">Senior (5+ years)</option>
              <option value="graduate">Graduate / Entry Level</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
            Your Current Bullet Points *
          </label>
          <p className="text-xs text-slate-500 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {examples.map(ex => (
              <button key={ex} onClick={() => setForm({...form, bullets: form.bullets ? form.bullets + "\n" + ex : ex})}
                className="text-xs px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors">
                + {ex}
              </button>
            ))}
          </div>
          <textarea className={`${inp} resize-none`} rows={5}
            placeholder={"Enter one bullet point per line:\n- Worked on the company website\n- Did testing\n- Helped the team"}
            value={form.bullets} onChange={e => setForm({...form, bullets: e.target.value})} />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button onClick={generate} disabled={loading}
          className="w-full bg-primary hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-all text-sm">
          {loading ? "Improving..." : "✨ Improve My CV Bullets"}
        </button>
      </div>
      <OutputCard content={output} loading={loading} />
    </div>
  );
}