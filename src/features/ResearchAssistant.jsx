import { useState } from "react";
import { askClaude } from "../utils/claude";
import OutputCard from "../components/OutputCard";
import FeatureShell from "../components/FeatureShell";
import FormField from "../components/FormField";
import SelectField from "../components/SelectField";
import GenerateButton from "../components/GenerateButton";

export default function ResearchAssistant() {
  const [form, setForm] = useState({
    topic: "",
    depth: "standard",
    context: "",
  });

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!form.topic.trim()) {
      setError("Please enter a research topic or question.");
      return;
    }

    setError("");
    setLoading(true);
    setOutput("");

    try {
      const systemPrompt = `
You are an AI research assistant for workplace productivity.

Help users understand topics clearly and practically.

Your response should contain:

OVERVIEW
A concise explanation of the topic.

KEY INSIGHTS
The most important concepts or findings.

PRACTICAL APPLICATION
Explain how the information can be applied in a workplace context.

RECOMMENDATIONS
Provide useful next steps or considerations.

LIMITATIONS / VERIFICATION
Clearly identify information that should be verified independently,
especially facts that may change over time.

IMPORTANT:
Do not fabricate sources, citations, statistics or quotations.
Do not pretend that you browsed the internet unless browsing tools
were actually provided.
Clearly distinguish general knowledge from information supplied
by the user.
`;

      const userPrompt = `
Research topic or question:
${form.topic}

Research depth:
${form.depth}

Additional context:
${form.context || "No additional context provided."}

Provide a useful, structured research brief.
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
          "Failed to generate the research brief."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeatureShell
      icon="🔎"
      title="AI Research Assistant"
      description="Explore topics, understand information and turn research into practical insights."
    >
      <div className="bg-card border border-border rounded-xl p-6">
        <FormField
          label="Research topic or question"
          required
          value={form.topic}
          onChange={(value) =>
            setForm({ ...form, topic: value })
          }
          placeholder="Example: How can AI improve cybersecurity operations?"
          rows={5}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <SelectField
            label="Research depth"
            value={form.depth}
            onChange={(value) =>
              setForm({ ...form, depth: value })
            }
            options={[
              {
                value: "quick",
                label: "Quick Overview",
              },
              {
                value: "standard",
                label: "Standard",
              },
              {
                value: "detailed",
                label: "Detailed",
              },
            ]}
          />

          <div />
        </div>

        <div className="mt-5">
          <FormField
            label="Additional context"
            value={form.context}
            onChange={(value) =>
              setForm({ ...form, context: value })
            }
            placeholder="What are you researching this for? Include a project, workplace problem or specific angle."
            rows={5}
          />
        </div>

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
            Research Topic
          </GenerateButton>
        </div>
      </div>

      <OutputCard
        content={output}
        setContent={setOutput}
        loading={loading}
        title="Research Brief"
      />
    </FeatureShell>
  );
}