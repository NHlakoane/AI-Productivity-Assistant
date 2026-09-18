import { useState } from "react";
import { askClaude } from "../utils/claude";
import OutputCard from "../components/OutputCard";

export default function SalaryEmail() {
  const [form, setForm]       = useState({ role: "", current: "", target: "", reason: "", context: "offer" });
  const [output, setOutput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const generate = async () => {
    if (!form.role || !form.target) { setError("Please enter the role and your target salary."); return; }
    setError(""); setLoading(true); setOutput("");
    try {
      const system = `You are a salary negotiation expert and career coach. You write professional, 
confident salary negotiation emails that are assertive without being aggressive. 
You know how to frame salary discussions to maximise success while maintaining positive relationships.`;

      const user = `Write a salary negotiation email for:
Role: ${form.role}
Context: ${form.context === "offer" ? "Negotiating a job offer" : "Asking for a raise in current job"}
${form.current ? `Current/Offered Salary: ${form.current}` : ""}
Target Salary: ${form.target}
My justification: ${form.reason || "My skills and market value"}

Make it professional, confident, and include specific reasoning. Keep it concise — one page maximum.`;

      setOutput(await askClaude(system, user));
    } catch { setError("Failed to generate. Try again."); }
    finally { setLoading(false); }
  };

  const inp = "w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500";

  return (
    <div className="max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Context</label>
          <div className="grid grid-cols-2 gap-2">
            {[["offer", "💼 Negotiating a Job Offer"], ["raise", "📈 Asking for a Raise"]].map(([val, label]) => (
              <button key={val} onClick={() => setForm({...form, context: val})}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all border ${form.context === val ? "bg-primary border-primary text-white" : "border-border text-slate-400 hover:text-white"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Role *</label>
          <input className={inp} placeholder="Senior Developer" value={form.role}
            onChange={e => setForm({...form, role: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">
              {form.context === "offer" ? "Offered Salary" : "Current Salary"}
            </label>
            <input className={inp} placeholder="R25 000/month" value={form.current}
              onChange={e => setForm({...form, current: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Target Salary *</label>
            <input className={inp} placeholder="R32 000/month" value={form.target}
              onChange={e => setForm({...form, target: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Your Justification</label>
          <textarea className={`${inp} resize-none`} rows={3}
            placeholder="e.g. 3 years experience, led 2 major projects, market rate for this role is higher..."
            value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button onClick={generate} disabled={loading}
          className="w-full bg-primary hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-all text-sm">
          {loading ? "Generating..." : "✨ Generate Negotiation Email"}
        </button>
      </div>
      <OutputCard content={output} loading={loading} />
    </div>
  );
}