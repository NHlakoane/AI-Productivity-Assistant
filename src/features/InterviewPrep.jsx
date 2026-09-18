import { useState } from "react";
import { askClaude } from "../utils/claude";
import OutputCard from "../components/OutputCard";

export default function InterviewPrep() {
  const [form, setForm]       = useState({ role: "", company: "", question: "", answer: "" });
  const [output, setOutput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [mode, setMode]       = useState("questions"); // questions | feedback

  const commonQuestions = [
    "Tell me about yourself",
    "Why do you want to work here?",
    "What is your greatest weakness?",
    "Where do you see yourself in 5 years?",
    "Tell me about a challenge you overcame",
    "Why should we hire you?",
  ];

  const generate = async () => {
    if (!form.role) { setError("Please enter the role you are interviewing for."); return; }
    setError(""); setLoading(true); setOutput("");
    try {
      if (mode === "questions") {
        const system = `You are a senior hiring manager and interview coach with 15 years of experience. 
You know exactly what interviewers are looking for and how to prepare candidates to succeed.`;
        const user = `Generate 8 likely interview questions for a ${form.role} role${form.company ? ` at ${form.company}` : ""}.
For each question, provide: the question itself, why interviewers ask it, and a strong answer framework using the STAR method where relevant.
Format clearly with numbers.`;
        setOutput(await askClaude(system, user));
      } else {
        if (!form.question || !form.answer) { setError("Enter both a question and your answer for feedback."); setLoading(false); return; }
        const system = `You are an expert interview coach. You give honest, constructive feedback on interview answers.
You highlight what works, what to improve, and provide a stronger version of the answer.`;
        const user = `Interview Question: ${form.question}
My Answer: ${form.answer}
Role: ${form.role}

Give me: 1) What I did well, 2) What to improve, 3) A stronger version of my answer using STAR method.`;
        setOutput(await askClaude(system, user));
      }
    } catch { setError("Failed to generate. Try again."); }
    finally { setLoading(false); }
  };

  const inp = "w-full bg-dark border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500";

  return (
    <div className="max-w-2xl">
      <div className="flex gap-2 mb-5">
        {["questions", "feedback"].map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? "bg-primary text-white" : "bg-card border border-border text-slate-400 hover:text-white"}`}>
            {m === "questions" ? "📋 Generate Questions" : "🎯 Get Answer Feedback"}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Role *</label>
            <input className={inp} placeholder="Junior Developer" value={form.role}
              onChange={e => setForm({...form, role: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Company</label>
            <input className={inp} placeholder="Google, Derivco..." value={form.company}
              onChange={e => setForm({...form, company: e.target.value})} />
          </div>
        </div>
        {mode === "feedback" && (
          <>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Question</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {commonQuestions.map(q => (
                  <button key={q} onClick={() => setForm({...form, question: q})}
                    className="text-xs px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors">
                    {q}
                  </button>
                ))}
              </div>
              <input className={inp} placeholder="Or type your own question" value={form.question}
                onChange={e => setForm({...form, question: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Your Answer</label>
              <textarea className={`${inp} resize-none`} rows={4}
                placeholder="Type your current answer here and I'll tell you how to improve it..."
                value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} />
            </div>
          </>
        )}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button onClick={generate} disabled={loading}
          className="w-full bg-primary hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-all text-sm">
          {loading ? "Generating..." : mode === "questions" ? "✨ Generate Questions" : "✨ Get Feedback"}
        </button>
      </div>
      <OutputCard content={output} loading={loading} />
    </div>
  );
}