import { useState } from "react";
import { askClaude } from "../utils/claude";
import OutputCard from "../components/OutputCard";
import FeatureShell from "../components/FeatureShell";
import FormField from "../components/FormField";
import SelectField from "../components/SelectField";
import GenerateButton from "../components/GenerateButton";

export default function TaskPlanner() {
  const [form, setForm] = useState({
    tasks: "",
    timeframe: "today",
    hours: "8",
    priorities: "",
  });

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!form.tasks.trim()) {
      setError("Please enter at least one task.");
      return;
    }

    setError("");
    setLoading(true);
    setOutput("");

    try {
      const systemPrompt = `
You are an expert productivity and task-planning assistant.

Your job is to transform a list of workplace tasks into a realistic,
organised schedule.

Prioritise tasks based on:
1. Explicit priority provided by the user.
2. Deadlines.
3. Dependencies.
4. Importance and urgency.
5. Reasonable workload.

Do not invent deadlines.

Create a clear plan with:

PRIORITISED TASKS
Number the tasks from highest to lowest priority.

SCHEDULE
Create practical time blocks where possible.

QUICK WINS
Identify smaller tasks that can be completed efficiently.

RISKS / NOTES
Mention overloaded schedules, missing information or dependencies.

IMPORTANT:
Do not pretend to access the user's calendar.
Do not create meetings or appointments.
This is a planning recommendation only.
`;

      const userPrompt = `
Create a ${form.timeframe} work plan.

Available working hours:
${form.hours} hours

Tasks:
${form.tasks}

Additional priorities or constraints:
${form.priorities || "No additional priorities were provided."}
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
          "Failed to create the task plan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeatureShell
      icon="📅"
      title="AI Task Planner"
      description="Turn your workload into a prioritised and organised work plan."
    >
      <div className="bg-card border border-border rounded-xl p-6">
        <FormField
          label="Tasks"
          required
          value={form.tasks}
          onChange={(value) =>
            setForm({ ...form, tasks: value })
          }
          placeholder={`Example:
Finish project report - high priority
Reply to client email - high priority
Review documentation - medium priority
Update GitHub repository - low priority`}
          rows={9}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <SelectField
            label="Planning period"
            value={form.timeframe}
            onChange={(value) =>
              setForm({ ...form, timeframe: value })
            }
            options={[
              {
                value: "today",
                label: "Today",
              },
              {
                value: "this week",
                label: "This Week",
              },
            ]}
          />

          <FormField
            label="Available working hours"
            value={form.hours}
            onChange={(value) =>
              setForm({ ...form, hours: value })
            }
            type="number"
            placeholder="8"
          />
        </div>

        <div className="mt-5">
          <FormField
            label="Additional priorities or constraints"
            value={form.priorities}
            onChange={(value) =>
              setForm({ ...form, priorities: value })
            }
            placeholder="Example: Client deadline is Friday. Team meeting at 14:00."
            rows={4}
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
            Build My Plan
          </GenerateButton>
        </div>
      </div>

      <OutputCard
        content={output}
        setContent={setOutput}
        loading={loading}
        title="AI Task Plan"
      />
    </FeatureShell>
  );
}