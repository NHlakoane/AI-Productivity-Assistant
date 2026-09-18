import { useState } from "react";
import { askClaude } from "../utils/claude";
import OutputCard from "../components/OutputCard";

export default function CoverLetter() {
  const [form, setForm]       = useState({ job: "", company: "", skills: "", tone: "formal" });
  const [output, setOutput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const generate = async () => {
    if (!form.job || !form.company) { setError("Please fill in the job title and company name."); return; }
    setError(""); setLoading(true); setOutput("");
    try {
      const system = `You are an expert career coach and professional writer specialising in job applications. 
You write compelling, authentic cover letters that highlight the candidate's strengths and match them to the role.
Always write in first person. Keep it to 3-4 paragraphs. Be specific and avoid generic filler phrases.`;

      const user = `Write a ${form.tone} cover letter for the following:
Job Title: ${form.job}
Company: ${form.company}
My key skills and experience: ${form.skills || "Not specified — write a general but compelling letter"}
Tone: ${form.tone}

The cover letter should feel genuine, highlight relevant skills, show enthusiasm for the role, and end with a confident call to action.`;

      const result = await askClaude(system, user);
      setOutput(result);
    } catch (e) {
      setError("Failed to generate. Check your API key and try again.");
    } finally { setLoading(false); }
  };

  const inp = "w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-all";

  return (
    <div className="max-w-2xl">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Job Title *</label>
            <input className={inp} placeholder="e.g. Software Engineer" value={form.job}
              onChange={e => setForm({...form, job: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Company *</label>
            <input className={inp} placeholder="e.g. Derivco" value={form.company}
              onChange={e => setForm({...form, company: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Your Skills & Experience</label>
          <textarea className={`${inp} resize-none`} rows={3}
            placeholder="e.g. 2 years React, Node.js, built a coffee shop ordering system..."
            value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Tone</label>
          <select className={inp} value={form.tone} onChange={e => setForm({...form, tone: e.target.value})}>
            <option value="formal">Formal & Professional</option>
            <option value="friendly">Friendly & Conversational</option>
            <option value="confident">Bold & Confident</option>
            <option value="enthusiastic">Enthusiastic & Energetic</option>
          </select>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button onClick={generate} disabled={loading}
          className="w-full bg-primary hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-all text-sm">
          {loading ? "Generating..." : "✨ Generate Cover Letter"}
        </button>
      </div>
      <OutputCard content={output} loading={loading} />
    </div>
  );
}