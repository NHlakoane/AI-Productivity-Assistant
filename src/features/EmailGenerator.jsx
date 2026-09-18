import { useState } from "react";
import { askClaude } from "../utils/claude";
import OutputCard from "../components/OutputCard";
import FeatureShell from "../components/FeatureShell";
import FormField from "../components/FormField";
import SelectField from "../components/SelectField";
import GenerateButton from "../components/GenerateButton";

export default function EmailGenerator() {
  const [form, setForm] = useState({
    recipient: "",
    purpose: "",
    details: "",
    tone: "formal",
  });

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!form.recipient || !form.purpose) {
      setError("Please provide the recipient and purpose of the email.");
      return;
    }

    setError("");
    setLoading(true);
    setOutput("");

    try {
      const systemPrompt = `
You are an expert workplace communication assistant.

Your job is to write professional emails that are clear, natural,
specific and appropriate for the workplace.

Follow the requested tone exactly.

Never invent facts, dates, promises, achievements or information that
the user did not provide.

Return:
Subject: [email subject]

[email body]

Do not include explanations before or after the email.
`;

      const userPrompt = `
Create a workplace email.

Recipient:
${form.recipient}

Purpose:
${form.purpose}

Additional details:
${form.details || "No additional details were provided."}

Tone:
${form.tone}

Make the email professional, concise and human.
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
          "Failed to generate the email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeatureShell
      icon="✉️"
      title="Smart Email Generator"
      description="Generate professional workplace emails with the right tone and structure."
    >
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Recipient"
            required
            value={form.recipient}
            onChange={(value) =>
              setForm({ ...form, recipient: value })
            }
            placeholder="e.g. Hiring Manager, Team Lead, Client"
          />

          <SelectField
            label="Tone"
            value={form.tone}
            onChange={(value) =>
              setForm({ ...form, tone: value })
            }
            options={[
              {
                value: "formal",
                label: "Formal",
              },
              {
                value: "friendly",
                label: "Friendly",
              },
              {
                value: "persuasive",
                label: "Persuasive",
              },
            ]}
          />
        </div>

        <div className="mt-5">
          <FormField
            label="Purpose of the email"
            required
            value={form.purpose}
            onChange={(value) =>
              setForm({ ...form, purpose: value })
            }
            placeholder="What do you want the email to accomplish?"
            rows={3}
          />
        </div>

        <div className="mt-5">
          <FormField
            label="Additional details"
            value={form.details}
            onChange={(value) =>
              setForm({ ...form, details: value })
            }
            placeholder="Include names, context, deadlines, requests or other information..."
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
            Generate Email
          </GenerateButton>
        </div>
      </div>

      <OutputCard
        content={output}
        setContent={setOutput}
        loading={loading}
        title="Generated Email"
      />
    </FeatureShell>
  );
}