import { useState } from "react";
import { askClaude } from "../utils/claude";
import OutputCard from "../components/OutputCard";
import FeatureShell from "../components/FeatureShell";
import FormField from "../components/FormField";
import GenerateButton from "../components/GenerateButton";

export default function MeetingNotes() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!notes.trim()) {
      setError("Please paste or enter your meeting notes.");
      return;
    }

    setError("");
    setLoading(true);
    setOutput("");

    try {
      const systemPrompt = `
You are an expert meeting productivity assistant.

Analyse meeting notes and transform them into a clear,
professional meeting summary.

Your output must contain these sections:

MEETING SUMMARY
Briefly explain the main purpose and discussion.

KEY DISCUSSION POINTS
List the most important topics discussed.

DECISIONS
List decisions that were actually made.
If there were no clear decisions, say so.

ACTION ITEMS
List tasks that need to be completed.
Include the responsible person only when the notes clearly identify them.

DEADLINES
List deadlines mentioned in the notes.
Never invent deadlines.

IMPORTANT:
Do not fabricate information.
Only use information contained in the provided notes.
`;

      const userPrompt = `
Summarise these meeting notes:

${notes}
`;

      const result = await askClaude(
        systemPrompt,
        userPrompt
      );

      setOutput(result);
    } catch (error) {
      console.error(error);
      setError(
        error.message ||
          "Failed to summarise the meeting notes."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeatureShell
      icon="📝"
      title="Meeting Notes Summarizer"
      description="Turn long meeting notes into structured summaries, decisions and action items."
    >
      <div className="bg-card border border-border rounded-xl p-6">
        <FormField
          label="Meeting notes"
          required
          value={notes}
          onChange={setNotes}
          placeholder="Paste your meeting notes here..."
          rows={12}
        />

        <p className="text-xs text-slate-500 mt-3">
          Tip: Include names, tasks and dates if they were mentioned
          during the meeting.
        </p>

        {error && (
          <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6">
          <GenerateButton
            onClick={generate}
            loading={loading}
          >
            Summarise Meeting
          </GenerateButton>
        </div>
      </div>

      <OutputCard
        content={output}
        setContent={setOutput}
        loading={loading}
        title="Meeting Summary"
      />
    </FeatureShell>
  );
}