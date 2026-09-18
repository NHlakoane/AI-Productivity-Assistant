import { useState } from "react";
import { askGeminiChat } from "../utils/claude";
import FeatureShell from "../components/FeatureShell";
import FormField from "../components/FormField";
import GenerateButton from "../components/GenerateButton";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      content:
        "Hi! I'm your AI Workplace Assistant. Ask me about workplace communication, productivity, planning, career development or general professional tasks.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!input.trim() || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const systemPrompt = `
You are CareerAI's AI Workplace Assistant.

You help users with:
- workplace productivity
- professional communication
- task planning
- career development
- job applications
- workplace problem solving
- general professional questions

Be helpful, concise and practical.

Do not invent facts.

When the user asks for professional writing,
provide a polished draft that they can edit.

When the user asks for advice, explain the reasoning
and give practical options.

Do not claim to have access to private systems,
calendars, emails, company databases or external websites
unless such access is actually provided.

Encourage users to review important AI-generated information
before acting on it.
`;

      const result = await askGeminiChat(
        systemPrompt,
        updatedMessages
      );

      setMessages([
        ...updatedMessages,
        {
          role: "model",
          content: result,
        },
      ]);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "The AI assistant could not respond."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <FeatureShell
      icon="💬"
      title="AI Workplace Assistant"
      description="Ask questions and interact with your AI productivity assistant."
    >
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            AI Conversation
          </p>
        </div>

        <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === "user"
                    ? "bg-primary text-white"
                    : "bg-dark border border-border text-slate-300"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-dark border border-border rounded-xl px-4 py-3 text-sm text-slate-400">
                AI is thinking...
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mx-5 mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="border-t border-border p-5">
          <FormField
            label="Message"
            value={input}
            onChange={setInput}
            placeholder="Ask your workplace assistant something..."
            rows={4}
          />

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-slate-500">
              Press Enter to send. Shift + Enter for a new line.
            </p>

            <GenerateButton
              onClick={sendMessage}
              loading={loading}
            >
              Send Message
            </GenerateButton>
          </div>
        </div>
      </div>
    </FeatureShell>
  );
}